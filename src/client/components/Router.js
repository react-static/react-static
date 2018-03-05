import React from 'react'
import PropTypes from 'prop-types'
import createBrowserHistory from 'history/createBrowserHistory'
import createMemoryHistory from 'history/createMemoryHistory'
import createHashHistory from 'history/createHashHistory'
import { Router as ReactRouter, StaticRouter } from 'react-router-dom'
//
import { cleanPath } from '../../utils/shared'
import {
  getRouteInfo,
  propsByHash,
  needsPrefetch,
  prefetch,
  setLoading,
  registerTemplateIDForPath,
} from '../methods'
import RouterScroller from './RouterScroller'
import DevSpinner from './DevSpinner'

export default class Router extends React.Component {
  static defaultProps = {
    type: 'browser',
    autoScrollToTop: true,
    autoScrollToHash: true,
    scrollToTopDuration: 0,
    scrollToHashDuration: 800,
    scrollToHashOffset: 0,
  }
  static contextTypes = {
    staticURL: PropTypes.string,
    routeInfo: PropTypes.object,
  }
  state = {
    ready: false,
    error: null,
    errorInfo: null,
  }
  constructor (props, context) {
    super()

    // In SRR and production, synchronously register the templateID for the
    // initial path
    let routeInfo = context.routeInfo
    let path = cleanPath(context.staticURL)

    if (typeof document !== 'undefined') {
      routeInfo = window.__routeInfo
      const { href } = window.location
      path = cleanPath(href)
    }

    if (routeInfo) {
      registerTemplateIDForPath(path, routeInfo.templateID)
    }
  }
  componentDidMount () {
    this.bootstrapRouteInfo()
  }
  componentDidCatch (error, errorInfo) {
    // Catch errors in any child components and re-renders with an error message
    this.setState({
      error,
      errorInfo,
    })
  }
  bootstrapRouteInfo = () =>
    (async () => {
      if (typeof window !== 'undefined') {
        // Get the entry path from location
        const { href } = window.location
        const path = cleanPath(href)

        // Injest and cache the embedded routeInfo in the page if possible
        if (window.__routeInfo && window.__routeInfo.path === path) {
          const allProps = window.__routeInfo.allProps
          Object.keys(window.__routeInfo.sharedPropsHashes).forEach(propKey => {
            propsByHash[window.__routeInfo.sharedPropsHashes[propKey]] = allProps[propKey]
          })
        }

        // In dev mode, request the templateID and ready the router
        if (process.env.REACT_STATIC_ENV === 'development') {
          const routeInfo = await getRouteInfo(path)
          if (routeInfo) {
            registerTemplateIDForPath(path, routeInfo.templateID)
            this.setState({ ready: true })
          }
        }
      }
    })()
  patchHistoryNavigation = resolvedHistory => {
    // Only patch navigation once
    if (this.patchedNavigation) {
      return
    }
    // Here, we patch the push and replace methods on history so we can
    // intercept them.
    ['push', 'replace'].forEach(method => {
      // Hold on to the original method, we will need it.
      const originalMethod = resolvedHistory[method]
      // Replace it with our own patched version
      resolvedHistory[method] = async (...args) => {
        // Clean the path first
        const path = cleanPath(typeof args[0] === 'string' ? args[0] : args[0].path)
        // Determine as quickly as possible if we need to fetch data for this route
        const shouldPrefetch = await needsPrefetch(path)

        // If we need to load...
        if (shouldPrefetch) {
          // Notify with a loading state
          setLoading(true)
          // Prefetch any data or templates needed with a high priority
          await prefetch(path, {
            priority: true,
          })
          // Notify we're done loading
          setLoading(false)
        }

        // Apply the original method and arguments as if nothing happened
        originalMethod.apply(resolvedHistory, args)
      }
    })

    // Only patch navigation once :)
    this.patchedNavigation = true
  }
  render () {
    const {
      history,
      type,
      children,
      autoScrollToTop,
      autoScrollToHash,
      scrollToTopDuration,
      scrollToHashDuration,
      scrollToHashOffset,
      ...rest
    } = this.props
    const { staticURL } = this.context
    const context = staticURL ? {} : undefined

    const { ready, error, errorInfo } = this.state

    let ResolvedRouter
    let resolvedHistory

    if (error) {
      // Fallback UI if an error occurs
      return (
        <div
          style={{
            margin: '1rem',
            padding: '1rem',
            background: 'rgba(0,0,0,0.05)',
          }}
        >
          <h2>Oh-no! Something’s gone wrong!</h2>
          <pre style={{ whiteSpace: 'normal', color: 'red' }}>
            <code>{error && error.toString()}</code>
          </pre>
          <h3>This error occurred here:</h3>
          <pre style={{ color: 'red', overflow: 'auto' }}>
            <code>{errorInfo.componentStack}</code>
          </pre>
          <p>For more information, please see the console.</p>
        </div>
      )
    }

    // If statically rendering, use the static router
    if (staticURL) {
      ResolvedRouter = StaticRouter
      resolvedHistory = undefined
    } else {
      ResolvedRouter = ReactRouter
      resolvedHistory = history || global.__reactStaticRouterHistory
      if (!resolvedHistory) {
        if (type === 'memory') {
          resolvedHistory = createMemoryHistory()
        } else if (type === 'hash') {
          resolvedHistory = createHashHistory()
        } else {
          resolvedHistory = createBrowserHistory({
            basename: process.env.REACT_STATIC_BASEPATH,
          })
        }
      }
      global.__reactStaticRouterHistory = resolvedHistory
      this.patchHistoryNavigation(resolvedHistory)
    }

    if (process.env.REACT_STATIC_ENV === 'development' && !ready) {
      return <DevSpinner />
    }

    return (
      <ResolvedRouter
        history={resolvedHistory}
        location={staticURL}
        context={context}
        basename={process.env.REACT_STATIC_BASEPATH}
        {...rest}
      >
        <RouterScroller
          {...{
            autoScrollToTop,
            autoScrollToHash,
            scrollToTopDuration,
            scrollToHashDuration,
            scrollToHashOffset,
          }}
        >
          {children}
        </RouterScroller>
      </ResolvedRouter>
    )
  }
}
