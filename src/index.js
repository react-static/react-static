import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import createBrowserHistory from 'history/createBrowserHistory'
import createMemoryHistory from 'history/createMemoryHistory'
import createHashHistory from 'history/createHashHistory'
import { Helmet } from 'react-helmet'
import { Router as ReactRouter, StaticRouter } from 'react-router-dom'
//
import { pathJoin } from './shared'

// Proxy React Router
export {
  Link,
  NavLink,
  Prompt,
  Redirect,
  Route,
  Switch,
  matchPath,
  withRouter,
} from 'react-router-dom'

// Proxy Helmet as Head
export { Helmet as Head }

//

const propsCache = {}
const inflight = {}
const failed = {}

let sitePropsPromise
let InitialLoading

let routesPromise

if (typeof document !== 'undefined') {
  routesPromise = (async () => {
    let res
    if (process.env.NODE_ENV === 'development') {
      res = await axios.get(`${process.env.STATIC_ENDPOINT}/getroutes`)
      return res.data
    }
    return window.__routesList
  })()
}

if (process.env.NODE_ENV === 'development') {
  InitialLoading = () => (
    <div
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'center',
        padding: '10px',
      }}
    >
      <style>
        {`
        @keyframes react-static-loader {
          0% {
            transform: rotate(0deg)
          }
          100% {
            transform: rotate(360deg)
          }
        }
      `}
      </style>
      <svg
        style={{
          width: '50px',
          height: '50px',
        }}
      >
        <circle
          style={{
            transformOrigin: '50% 50% 0px',
            animation: 'react-static-loader 1s infinite',
            r: 20,
            stroke: 'rgba(0,0,0,0.4)',
            strokeWidth: 4,
            cx: 25,
            cy: 25,
            strokeDasharray: 10.4,
            strokeLinecap: 'round',
            fill: 'transparent',
          }}
        />
      </svg>
    </div>
  )
}

function cleanPath (path) {
  // Resolve the local path
  if (!path) {
    return
  }
  // Only allow origin or absolute links
  const hasOrigin = path.startsWith(window.location.origin)
  const isAbsolute = path.startsWith('/')
  if (!hasOrigin && !isAbsolute) {
    return
  }
  let end = path.indexOf('#')
  end = end === -1 ? undefined : end
  return pathJoin(path.substring(hasOrigin ? window.location.origin.length : 0, end))
}

function isPrefetched (path) {
  path = cleanPath(path)
  if (!path) {
    return
  }

  if (propsCache[path]) {
    return propsCache[path]
  }
}

export async function prefetch (path) {
  path = cleanPath(path)

  if (!path) {
    return
  }

  // Defer to the cache first
  if (propsCache[path]) {
    return propsCache[path]
  }

  // Don't attempt previously failed prefetches
  if (failed[path]) {
    return
  }

  // Find the current route (or lack of route)
  const routes = await routesPromise
  const isStaticRoute = routes.indexOf(path) > -1

  if (!isStaticRoute) {
    return
  }

  if (process.env.NODE_ENV === 'development') {
    // Reuse request for duplicate inflight requests
    try {
      if (!inflight[path]) {
        inflight[path] = axios.get(`${process.env.STATIC_ENDPOINT}/route${path}`)
      }
      const { data: initialProps } = await inflight[path]

      // Place it in the cache
      propsCache[path] = {
        initialProps,
      }
    } catch (err) {
      console.error('Error: There was an error during getProps() for route:', path)
      console.error(err)
    }
    delete inflight[path]
    return propsCache[path]
  }

  // Then try for the embedded data
  if (window.__routeData && window.__routeData.path === path) {
    propsCache[path] = window.__routeData
    return propsCache[path]
  }

  // Fallback to fetching the path's route data
  try {
    // Reuse request for duplicate inflight requests
    inflight[path] = inflight[path] || axios.get(pathJoin(path, 'routeData.json'))
    const { data } = await inflight[path]

    // Place it in the cache
    propsCache[path] = data
  } catch (err) {
    // Mark the request as failed
    failed[path] = true
    console.warn('Warning: There was an error during getProps() for route:', path)
    console.error(err)
  }
  delete inflight[path]
  return propsCache[path]
}

export function getRouteProps (Comp) {
  return class GetRouteProps extends Component {
    static contextTypes = {
      initialProps: PropTypes.object,
      router: PropTypes.object,
    }
    state = {
      loaded: false,
    }
    async componentWillMount () {
      if (process.env.NODE_ENV === 'development') {
        const { pathname } = this.context.router.route.location
        const path = pathJoin(pathname)
        await prefetch(path)
        if (this.unmounting) {
          return
        }
        this.setState({
          loaded: true,
        })
      }
    }
    componentWillUnmount () {
      this.unmounting = true
    }
    render () {
      const { pathname } = this.context.router.route.location
      const path = pathJoin(pathname)

      let initialProps
      if (typeof window !== 'undefined') {
        if (window.__routeData && window.__routeData.path === path) {
          initialProps = window.__routeData.initialProps
        }
      }

      if (!initialProps && this.context.initialProps) {
        initialProps = this.context.initialProps
      } else {
        initialProps = propsCache[path] ? propsCache[path].initialProps : initialProps
      }

      if (!initialProps && this.state.loaded) {
        console.error(
          `Warning: getRouteProps could not find any props for route: ${path}. Either you are missing a getProps function for this route in your static.config.js or you are using the getRouteProps HOC when you don't need to.`,
        )
      }

      if (!initialProps) {
        if (process.env.NODE_ENV === 'development') {
          return <InitialLoading />
        }
        return null
      }

      return <Comp {...this.props} {...initialProps} />
    }
  }
}

export function getSiteProps (Comp) {
  return class GetSiteProps extends Component {
    static contextTypes = {
      siteProps: PropTypes.object,
    }
    state = {
      siteProps: false,
    }
    async componentWillMount () {
      if (process.env.NODE_ENV === 'development') {
        const { data: siteProps } = await (() => {
          if (sitePropsPromise) {
            return sitePropsPromise
          }
          sitePropsPromise = axios.get(`${process.env.STATIC_ENDPOINT}/siteProps`)
          return sitePropsPromise
        })()
        if (this.unmounting) {
          return
        }
        this.setState({
          siteProps,
        })
      }
    }
    componentWillUnmount () {
      this.unmounting = true
    }
    render () {
      let siteProps
      if (typeof window !== 'undefined') {
        if (window.__routeData) {
          siteProps = window.__routeData.siteProps
        }
      }

      if (!siteProps && this.context.siteProps) {
        siteProps = this.context.siteProps
      }

      if (!siteProps && this.state.siteProps) {
        siteProps = this.state.siteProps
      }

      if (!siteProps) {
        if (process.env.NODE_ENV === 'development') {
          return <InitialLoading />
        }
        return null
      }

      return <Comp {...this.props} {...siteProps} />
    }
  }
}

export class Prefetch extends Component {
  static defaultProps = {
    children: null,
    path: null,
    onLoad: () => {},
  }
  async componentDidMount () {
    const { path, onLoad } = this.props

    const data = await prefetch(path)
    onLoad(data, path)
  }
  render () {
    return this.props.children
  }
}

const ioIsSupported = typeof window !== 'undefined' && 'IntersectionObserver' in window
const handleIntersection = (element, callback) => {
  const io = new window.IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (element === entry.target) {
        if (entry.isIntersecting) {
          io.unobserve(element)
          io.disconnect()
          callback()
        }
      }
    })
  })

  io.observe(element)
}

export class PrefetchWhenSeen extends Component {
  static defaultProps = {
    children: null,
    path: null,
    onLoad: () => {},
  }

  componentDidMount () {
    if (!ioIsSupported) {
      this.runPrefetch()
    }
  }

  runPrefetch = () => {
    const { path, onLoad } = this.props
    prefetch(path).then(data => {
      onLoad(data, path)
    })
  }

  handleRef = ref => {
    if (ioIsSupported && ref) {
      handleIntersection(ref, this.runPrefetch)
    }
  }

  render () {
    return <div ref={this.handleRef}>{this.props.children}</div>
  }
}

let loading = false
let subscribers = []
const setLoading = d => {
  loading = d
  subscribers.forEach(s => s())
}

export class Router extends Component {
  static defaultProps = {
    type: 'browser',
  }
  static subscribe = cb => {
    const ccb = () => cb(loading)
    subscribers.push(ccb)
    return () => {
      subscribers = subscribers.filter(d => d !== ccb)
    }
  }
  static contextTypes = {
    URL: PropTypes.string,
  }
  state = {
    error: null,
    errorInfo: null,
  }
  componentDidCatch (error, errorInfo) {
    // Catch errors in any child components and re-renders with an error message
    this.setState({
      error,
      errorInfo,
    })
  }
  render () {
    const { history, type, ...rest } = this.props
    const { URL } = this.context
    const context = URL ? {} : undefined

    let ResolvedRouter
    let resolvedHistory

    if (this.state.error) {
      // Fallback UI if an error occurs
      return (
        <div
          style={{
            margin: '1rem',
            padding: '1rem',
            background: 'rgba(0,0,0,0.05)',
          }}
        >
          <h2>Oh-no! Something's gone wrong!</h2>
          <pre style={{ whiteSpace: 'normal', color: 'red' }}>
            <code>{this.state.error && this.state.error.toString()}</code>
          </pre>
          <h3>This error occurred here:</h3>
          <pre style={{ color: 'red', overflow: 'auto' }}>
            <code>{this.state.errorInfo.componentStack}</code>
          </pre>
          <p>For more information, please see the console.</p>
        </div>
      )
    }

    // If statically rendering, use the static router
    if (URL) {
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
          resolvedHistory = createBrowserHistory()
        }
      }
      global.__reactStaticRouterHistory = resolvedHistory
      ;['push', 'replace'].forEach(method => {
        const originalMethod = resolvedHistory[method]
        resolvedHistory[method] = async (...args) => {
          const path = typeof args[0] === 'string' ? args[0] : args[0].pathname + args[0].search
          if (!isPrefetched(path)) {
            try {
              setLoading(true)
              await prefetch(path)
            } catch (err) {
              console.error(err)
            }
            setLoading(false)
          }
          originalMethod.apply(resolvedHistory, args)
        }
      })
    }

    return <ResolvedRouter history={resolvedHistory} location={URL} context={context} {...rest} />
  }
}
