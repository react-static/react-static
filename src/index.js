import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import createBrowserHistory from 'history/createBrowserHistory'
import createMemoryHistory from 'history/createMemoryHistory'
import createHashHistory from 'history/createHashHistory'
import { Helmet } from 'react-helmet'
import {
  Router as ReactRouter,
  StaticRouter,
  withRouter,
  NavLink as ReactRouterNavLink,
} from 'react-router-dom'

//

import { pathJoin, unwrapArray, isObject, createPool, deprecate } from './shared'
import scrollTo from './utils/ScrollTo'

//

const prefetchPool = createPool({
  concurrency: Number(process.env.REACT_STATIC_PREFETCH_RATE) || 10,
})
const propsByHash = {}
const pathProps = {}
const inflight = {}

let siteDataPromise
let InitialLoading

let routesPromise

const getRouteInfo = async () => {
  if (typeof document !== 'undefined') {
    if (!routesPromise) {
      routesPromise = (async () => {
        if (process.env.REACT_STATIC_ENV === 'development') {
          const { data } = await axios.get('/__react-static__/routeInfo')
          return data
        }
        await new Promise(resolve => {
          const s = document.createElement('script')
          s.type = 'text/javascript'
          s.src = `${process.env.PUBLIC_PATH}routeInfo.js`
          s.onload = resolve
          if (document.body.append) {
            document.body.append(s)
          } else {
            document.body.appendChild(s)
          }
        })
        return window.__routeInfo
      })()
    }
    return routesPromise
  }
}

if (process.env.REACT_STATIC_ENV === 'development') {
  InitialLoading = () => (
    <div
      className="react-static-loading"
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

async function prefetchData (path, { priority } = {}) {
  // Get route info so we can check if path has any data
  const routes = await getRouteInfo()

  // Defer to the cache first
  if (pathProps[path]) {
    return pathProps[path]
  }

  const isStaticRoute = routes[path]

  // Not a static route? Bail out.
  if (!isStaticRoute) {
    return
  }

  // In development request all props in one go.
  if (process.env.REACT_STATIC_ENV === 'development') {
    // Then try for the embedded data first and return it
    if (window.__routeData && window.__routeData.path === path) {
      pathProps[path] = window.__routeData
      return pathProps[path]
    }
    // Reuse request for duplicate inflight requests
    try {
      if (!inflight[path]) {
        inflight[path] = axios.get(`/__react-static__/route${path}`)
      }
      const { data: initialProps } = await inflight[path]

      // Place it in the cache
      pathProps[path] = {
        initialProps,
      }
    } catch (err) {
      console.error('Error: There was an error retrieving props for this route! path:', path)
      throw err
    }
    delete inflight[path]
    return pathProps[path]
  }

  // for production, we'll need the full route
  const propsMap = routes[path]

  // Not a static route? Bail out.
  if (!propsMap) {
    return
  }

  // Request and build the props one by one
  let initialProps = {}

  // Request the template and loop over the propsMap, requesting each prop
  await Promise.all(
    Object.keys(propsMap).map(async key => {
      const hash = propsMap[key]

      // Check the propsByHash first
      if (!propsByHash[hash]) {
        // Reuse request for duplicate inflight requests
        try {
          if (!inflight[hash]) {
            if (priority) {
              inflight[hash] = axios.get(`/staticData/${hash}.json`)
            } else {
              inflight[hash] = prefetchPool.add(() => axios.get(`/staticData/${hash}.json`))
            }
          }
          const { data: prop } = await inflight[hash]

          // Place it in the cache
          propsByHash[hash] = prop
        } catch (err) {
          console.error('Error: There was an error retrieving a prop for this route! hashID:', hash)
          console.error(err)
        }
        delete inflight[hash]
      }

      // If this prop was the local prop, spread it on the entire prop object
      if (key === '__local') {
        initialProps = {
          ...initialProps,
          ...propsByHash[hash],
        }
      } else {
        // Otherwise, just set it as the key
        initialProps[key] = propsByHash[hash]
      }
    })
  )

  // Cache the entire props for the route
  pathProps[path] = {
    initialProps,
  }

  // Return the props
  return pathProps[path]
}

async function prefetchTemplate (path, { priority } = {}) {
  // Preload the template if available
  const pathTemplate =
    window.reactStaticGetComponentForPath && window.reactStaticGetComponentForPath(path)
  if (pathTemplate && pathTemplate.preload) {
    if (priority) {
      await pathTemplate.preload()
    } else {
      await prefetchPool.add(() => pathTemplate.preload())
    }
    return pathTemplate
  }
}

async function needsPrefetch (path) {
  // Clean the path
  path = cleanPath(path)

  if (!path) {
    return false
  }

  // Get route info so we can check if path has any data
  const routes = await getRouteInfo()

  const isStaticRoute = routes[path]

  // Not a static route? Bail out.
  if (isStaticRoute) {
    return true
  }

  // Defer to the cache first
  if (!pathProps[path]) {
    return true
  }
}

async function prefetch (path, options = {}) {
  // Clean the path
  path = cleanPath(path)

  if (!path) {
    return
  }

  const { type } = options

  if (type === 'data') {
    return prefetchData(path, options)
  } else if (type === 'template') {
    await prefetchTemplate(path, options)
    return
  }

  const [data] = await Promise.all([prefetchData(path), prefetchTemplate(path)])
  return data
}

const RouteData = withRouter(
  class RouteData extends React.Component {
    static contextTypes = {
      initialProps: PropTypes.object,
    }
    state = {
      loaded: false,
    }
    componentWillMount () {
      if (process.env.REACT_STATIC_ENV === 'development') {
        this.loadRouteData()
      }
    }
    componentWillReceiveProps (nextProps) {
      if (process.env.REACT_STATIC_ENV === 'development') {
        if (this.props.location.pathname !== nextProps.location.pathname) {
          this.setState({ loaded: false }, this.loadRouteData)
        }
      }
    }
    componentWillUnmount () {
      this.unmounting = true
    }
    loadRouteData = () =>
      (async () => {
        const { pathname } = this.props.location
        const path = pathJoin(pathname)
        await prefetch(path)
        if (this.unmounting) {
          return
        }
        this.setState({
          loaded: true,
        })
      })()
    render () {
      const { component, render, children, location: { pathname }, ...rest } = this.props
      const path = pathJoin(pathname)

      let routeData

      if (typeof window !== 'undefined') {
        if (window.__routeData && window.__routeData.path === path) {
          routeData = window.__routeData.initialProps
        }
      }

      if (!routeData && this.context.initialProps) {
        routeData = this.context.initialProps
      } else {
        routeData = pathProps[path] ? pathProps[path].initialProps : routeData
      }

      if (!routeData && this.state.loaded) {
        console.error(
          `Warning: withRouteData could not find any props for route: ${path}. Either you are missing a getData function for this route in your static.config.js or you are using the withRouteData HOC when you don't need to.`
        )
      }

      if (!routeData) {
        if (process.env.REACT_STATIC_ENV === 'development') {
          return <InitialLoading />
        }
        return null
      }

      const finalProps = {
        ...rest,
        ...routeData,
      }
      if (component) {
        return React.createElement(component, finalProps)
      }
      if (render) {
        return render(finalProps)
      }
      return children(finalProps)
    }
  }
)

class SiteData extends Component {
  static contextTypes = {
    siteData: PropTypes.object,
  }
  state = {
    siteData: false,
  }
  async componentWillMount () {
    if (process.env.REACT_STATIC_ENV === 'development') {
      const { data: siteData } = await (() => {
        if (siteDataPromise) {
          return siteDataPromise
        }
        siteDataPromise = axios.get('/__react-static__/siteData')
        return siteDataPromise
      })()
      if (this.unmounting) {
        return
      }
      this.setState({
        siteData,
      })
    }
  }
  componentWillUnmount () {
    this.unmounting = true
  }
  render () {
    const { component, render, children, ...rest } = this.props
    let siteData
    if (typeof window !== 'undefined') {
      if (window.__routeData) {
        siteData = window.__routeData.siteData
      }
    }

    if (!siteData && this.context.siteData) {
      siteData = this.context.siteData
    }

    if (!siteData && this.state.siteData) {
      siteData = this.state.siteData
    }

    if (!siteData) {
      if (process.env.REACT_STATIC_ENV === 'development') {
        return <InitialLoading />
      }
      return null
    }

    const finalProps = {
      ...rest,
      ...siteData,
    }
    if (component) {
      return React.createElement(component, finalProps)
    }
    if (render) {
      return render(finalProps)
    }
    return children(finalProps)
  }
}

class Prefetch extends Component {
  static defaultProps = {
    children: null,
    path: null,
    type: null,
    onLoad: () => {},
  }
  async componentDidMount () {
    const { path, onLoad, type } = this.props
    const data = await prefetch(path, { type })
    onLoad(data, path)
  }
  render () {
    return unwrapArray(this.props.children)
  }
}

const ioIsSupported = typeof window !== 'undefined' && 'IntersectionObserver' in window
const handleIntersection = (element, callback) => {
  const io = new window.IntersectionObserver(entries => {
    entries.forEach(entry => {
      // Edge doesn't support isIntersecting. intersectionRatio > 0 works as a fallback
      if (element === entry.target && (entry.isIntersecting || entry.intersectionRatio > 0)) {
        io.unobserve(element)
        io.disconnect()
        callback()
      }
    })
  })

  io.observe(element)
}

class PrefetchWhenSeen extends Component {
  static defaultProps = {
    children: null,
    path: null,
    className: null,
    type: null,
    onLoad: () => {},
  }

  componentDidMount () {
    if (!ioIsSupported) {
      this.runPrefetch()
    }
  }

  runPrefetch = () =>
    (async () => {
      const { path, onLoad, type } = this.props
      const data = await prefetch(path, { type })
      onLoad(data, path)
    })()

  handleRef = ref => {
    if (ioIsSupported && ref) {
      handleIntersection(ref, this.runPrefetch)
    }
  }

  render () {
    const { component, render, children, ...rest } = this.props
    if (component) {
      return React.createElement(component, {
        handleRef: this.handleRef,
      })
    }
    if (render) {
      return render({ handleRef: this.handleRef })
    }
    return (
      <div ref={this.handleRef} {...rest}>
        {children}
      </div>
    )
  }
}

let loading = false
let subscribers = []
const setLoading = d => {
  if (loading !== d) {
    loading = d
    subscribers.forEach(s => s())
  }
}
const onLoading = cb => {
  const ccb = () => cb(loading)
  subscribers.push(ccb)
  return () => {
    subscribers = subscribers.filter(d => d !== ccb)
  }
}

class Loading extends React.Component {
  state = {
    loading,
  }
  componentWillMount () {
    this.unsubscribe = onLoading(loading =>
      this.setState({
        loading,
      })
    )
  }
  render () {
    const { component, render, children, ...rest } = this.props
    const finalProps = {
      ...rest,
      loading: this.state.loading,
    }
    if (component) {
      return React.createElement(component, finalProps)
    }
    if (render) {
      return render(finalProps)
    }
    return children(finalProps)
  }
}

const RouterScroller = withRouter(
  class RouterScroller extends Component {
    componentDidMount () {
      this.scrollToHash()
    }
    componentDidUpdate (prev) {
      if (prev.location.pathname !== this.props.location.pathname && !this.props.location.hash) {
        if (window.__noScrollTo) {
          window.__noScrollTo = false
          return
        }
        this.scrollToTop()
        return
      }
      if (prev.location.hash !== this.props.location.hash) {
        return this.scrollToHash()
      }
    }
    scrollToTop = () => {
      const { autoScrollToTop, scrollToTopDuration } = this.props
      if (autoScrollToTop) {
        scrollTo(0, {
          duration: scrollToTopDuration,
        })
      }
    }
    scrollToHash = () => {
      const { scrollToHashDuration, autoScrollToHash, location: { hash } } = this.props
      if (!autoScrollToHash) {
        return
      }
      if (hash) {
        const resolvedHash = hash.substring(1)
        if (resolvedHash) {
          const element = document.getElementById(resolvedHash)
          if (element !== null) {
            scrollTo(element, {
              duration: scrollToHashDuration,
            })
          }
        }
      } else {
        scrollTo(0, {
          duration: scrollToHashDuration,
        })
      }
    }
    render () {
      return unwrapArray(this.props.children)
    }
  }
)

class Router extends Component {
  static defaultProps = {
    type: 'browser',
    autoScrollToTop: true,
    autoScrollToHash: true,
    scrollToTopDuration: 0,
    scrollToHashDuration: 800,
  }
  static contextTypes = {
    staticURL: PropTypes.string,
  }
  state = {
    error: null,
    errorInfo: null,
  }
  componentDidMount () {
    getRouteInfo()
    if (typeof window !== 'undefined') {
      const { href, origin } = window.location
      const path = pathJoin(href.replace(origin, ''))
      if (window.__routeData && window.__routeData.path === path) {
        const initialProps = window.__routeData.initialProps
        Object.keys(initialProps).forEach(key => {
          propsByHash[window.__routeData.propsMap[key]] = initialProps[key]
        })
      }
    }
  }
  componentDidCatch (error, errorInfo) {
    // Catch errors in any child components and re-renders with an error message
    this.setState({
      error,
      errorInfo,
    })
  }
  patchHistoryNavigation = resolvedHistory => {
    if (this.patchedNavigation) {
      return
    }
    ['push', 'replace'].forEach(method => {
      const originalMethod = resolvedHistory[method]
      resolvedHistory[method] = async (...args) => {
        const path = typeof args[0] === 'string' ? args[0] : args[0].path
        const shouldPrefetch = await needsPrefetch(path)
        if (shouldPrefetch) {
          setLoading(true)
          await prefetch(path, {
            priority: true,
          })
          setLoading(false)
        }
        originalMethod.apply(resolvedHistory, args)
      }
    })
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
      ...rest
    } = this.props
    const { staticURL } = this.context
    const context = staticURL ? {} : undefined

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
          resolvedHistory = createBrowserHistory()
        }
      }
      global.__reactStaticRouterHistory = resolvedHistory
      this.patchHistoryNavigation(resolvedHistory)
    }

    return (
      <ResolvedRouter history={resolvedHistory} location={staticURL} context={context} {...rest}>
        <RouterScroller
          {...{ autoScrollToTop, autoScrollToHash, scrollToTopDuration, scrollToHashDuration }}
        >
          {children}
        </RouterScroller>
      </ResolvedRouter>
    )
  }
}

// Detects internal link url schemas
function isRoutingUrl (to) {
  if (typeof to === 'undefined') return false
  return (
    !to.match(/^([A-z]?)+:/) && // starts with external protocol
    !to.match(/^#/) && // starts with hash fragment
    !to.match(/^[a-z]{1,10}:\/\//) // starts with double slash protocol
  )
}

const reactRouterProps = [
  'activeClassName',
  'activeStyle',
  'exact',
  'isActive',
  'location',
  'strict',
  'to',
  'replace',
]

function SmartLink ({ prefetch = true, scrollToTop = true, onClick, ...rest }) {
  const { to } = rest
  let resolvedTo = to
  if (isObject(to)) {
    if (!to.pathname && to.path) {
      console.warn(
        'You are using the `path` key in a <Link to={...} /> when you should be using the `pathname` key. This will be deprecated in future versions!'
      )
      to.pathname = to.path
      delete to.path
      resolvedTo = to.pathname
    } else if (to.pathname) {
      resolvedTo = to.pathname
    }
  }
  // Router Link
  if (isRoutingUrl(resolvedTo)) {
    const finalRest = {
      ...rest,
      onClick: e => {
        if (typeof document !== 'undefined' && !scrollToTop) {
          window.__noScrollTo = true
        }
        if (onClick) {
          onClick(e)
        }
      },
    }

    if (prefetch) {
      return (
        <PrefetchWhenSeen
          path={resolvedTo}
          type={prefetch}
          render={({ handleRef }) => <ReactRouterNavLink {...finalRest} innerRef={handleRef} />}
        />
      )
    }
    return <ReactRouterNavLink {...finalRest} />
  }

  // Browser Link
  const { children, ...aRest } = rest
  aRest.href = aRest.to
  delete aRest.to

  reactRouterProps.filter(prop => aRest[prop]).forEach(prop => {
    console.warn(`Warning: ${prop} makes no sense on a <Link to="${aRest.href}">.`)
  })
  reactRouterProps.forEach(prop => delete aRest[prop])

  return <a {...aRest}>{children}</a>
}

const Link = SmartLink
const NavLink = SmartLink

function withRouteData (Comp) {
  return function ConnectedRouteData (props) {
    return <RouteData component={Comp} {...props} />
  }
}

function withSiteData (Comp) {
  return function ConnectedSiteData (props) {
    return <SiteData component={Comp} {...props} />
  }
}

function withLoading (Comp) {
  return function ConnectedLoading (props) {
    return <Loading component={Comp} {...props} />
  }
}

// Deprecations
const getRouteProps = (...args) => {
  deprecate('getRouteProps', 'withRouteData')
  return withRouteData(...args)
}
const getSiteData = (...args) => {
  deprecate('getSiteData', 'withSiteData')
  return withSiteData(...args)
}

// Exports

// Proxy React Router
export { Prompt, Redirect, Route, Switch, matchPath, withRouter } from 'react-router-dom'
// Proxy Helmet as Head
export { Helmet as Head }
// Export react-static utils
export {
  // components
  RouteData,
  SiteData,
  Loading,
  Prefetch,
  PrefetchWhenSeen,
  Router,
  NavLink,
  Link,
  // methods
  prefetch,
  scrollTo,
  withRouteData,
  withSiteData,
  withLoading,
  onLoading,
  // deprecated
  getRouteProps,
  getSiteData,
}
