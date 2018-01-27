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
  Link as ReactRouterLink,
  NavLink as ReactRouterNavLink
} from 'react-router-dom'
//
import { pathJoin, unwrapArray, isObject, createPool } from './shared'
import ScrollTo from './utils/ScrollTo'

// Proxy React Router
export { Prompt, Redirect, Route, Switch, matchPath, withRouter } from 'react-router-dom'

// Proxy Helmet as Head
export { Helmet as Head }

//

const prefetchPool = createPool({
  concurrency: Number(process.env.REACT_STATIC_PREFETCH_RATE) || 10
})
const propsByHash = {}
const pathProps = {}
const inflight = {}

let sitePropsPromise
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
          s.src = '/routeInfo.js'
          s.onload = resolve
          document.body.append(s)
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
        padding: '10px'
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
          height: '50px'
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
            fill: 'transparent'
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

  // In development request all props in one go.
  if (process.env.REACT_STATIC_ENV === 'development') {
    const isStaticRoute = routes.includes(path)

    // Not a static route? Bail out.
    if (!isStaticRoute) {
      return
    }

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
        initialProps
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
          ...propsByHash[hash]
        }
      } else {
        // Otherwise, just set it as the key
        initialProps[key] = propsByHash[hash]
      }
    })
  )

  // Cache the entire props for the route
  pathProps[path] = {
    initialProps
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

export async function prefetch (path, options = {}) {
  // Clean the path
  path = cleanPath(path)

  if (!path) {
    return
  }

  const { only } = options

  if (only === 'data') {
    return prefetchData(path, options)
  } else if (only === 'template') {
    await prefetchTemplate(path, options)
    return
  }

  const [data] = await Promise.all([prefetchData(path), prefetchTemplate(path)])
  return data
}

export function getRouteProps (Comp) {
  return withRouter(
    class GetRouteProps extends Component {
      static contextTypes = {
        initialProps: PropTypes.object
      }
      state = {
        loaded: false
      }
      componentWillMount () {
        if (process.env.REACT_STATIC_ENV === 'development') {
          this.loadRouteProps()
        }
      }
      componentWillReceiveProps (nextProps) {
        if (process.env.REACT_STATIC_ENV === 'development') {
          if (
            this.props.location.pathname + this.props.location.search !==
            nextProps.location.pathname + nextProps.location.search
          ) {
            this.setState({ loaded: false }, this.loadRouteProps)
          }
        }
      }
      componentWillUnmount () {
        this.unmounting = true
      }
      loadRouteProps = () =>
        (async () => {
          const { pathname, search } = this.props.location
          const path = pathJoin(`${pathname}${search}`)
          await prefetch(path)
          if (this.unmounting) {
            return
          }
          this.setState({
            loaded: true
          })
        })()
      render () {
        const { pathname, search } = this.props.location
        const path = pathJoin(`${pathname}${search}`)

        let initialProps

        if (typeof window !== 'undefined') {
          if (window.__routeData && window.__routeData.path === path) {
            initialProps = window.__routeData.initialProps
          }
        }

        if (!initialProps && this.context.initialProps) {
          initialProps = this.context.initialProps
        } else {
          initialProps = pathProps[path] ? pathProps[path].initialProps : initialProps
        }

        if (!initialProps && this.state.loaded) {
          console.error(
            `Warning: getRouteProps could not find any props for route: ${path}. Either you are missing a getProps function for this route in your static.config.js or you are using the getRouteProps HOC when you don't need to.`
          )
        }

        if (!initialProps) {
          if (process.env.REACT_STATIC_ENV === 'development') {
            return <InitialLoading />
          }
          return null
        }

        return <Comp {...this.props} {...initialProps} />
      }
    }
  )
}

export function getSiteProps (Comp) {
  return class GetSiteProps extends Component {
    static contextTypes = {
      siteProps: PropTypes.object
    }
    state = {
      siteProps: false
    }
    async componentWillMount () {
      if (process.env.REACT_STATIC_ENV === 'development') {
        const { data: siteProps } = await (() => {
          if (sitePropsPromise) {
            return sitePropsPromise
          }
          sitePropsPromise = axios.get('/__react-static__/siteProps')
          return sitePropsPromise
        })()
        if (this.unmounting) {
          return
        }
        this.setState({
          siteProps
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
        if (process.env.REACT_STATIC_ENV === 'development') {
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
    only: null,
    onLoad: () => {}
  }
  async componentDidMount () {
    const { path, onLoad, only } = this.props
    const data = await prefetch(path, { only })
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

export class PrefetchWhenSeen extends Component {
  static defaultProps = {
    children: null,
    path: null,
    className: null,
    only: null,
    onLoad: () => {}
  }

  componentDidMount () {
    if (!ioIsSupported) {
      this.runPrefetch()
    }
  }

  runPrefetch = () =>
    (async () => {
      const { path, onLoad, only } = this.props
      const data = await prefetch(path, { only })
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
        handleRef: this.handleRef
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
  loading = d
  subscribers.forEach(s => s())
}

const RouterScroller = withRouter(
  class RouterScroller extends Component {
    static defaultProps = {
      scrollToTopDuration: 0,
      scrollToHashDuration: 800
    }
    componentDidMount () {
      this.scrollToHash()
    }
    componentDidUpdate (prev) {
      if (prev.location.hash !== this.props.location.hash && this.props.location.hash) {
        return this.scrollToHash()
      }
      if (prev.location.pathname !== this.props.location.pathname) {
        ScrollTo(0, {
          duration: this.props.scrollToTopDuration
        })
      }
    }
    scrollToHash = () => {
      const { hash, scrollToHashDuration } = this.props.location
      if (hash) {
        const resolvedHash = hash.substring(1)
        console.log(resolvedHash)
        if (resolvedHash) {
          const element = document.getElementById(resolvedHash)
          if (element !== null) {
            ScrollTo(element, {
              duration: scrollToHashDuration
            })
          }
        }
      }
    }
    render () {
      return unwrapArray(this.props.children)
    }
  }
)

export class Router extends Component {
  static defaultProps = {
    type: 'browser'
  }
  static subscribe = cb => {
    const ccb = () => cb(loading)
    subscribers.push(ccb)
    return () => {
      subscribers = subscribers.filter(d => d !== ccb)
    }
  }
  static contextTypes = {
    staticURL: PropTypes.string
  }
  state = {
    error: null,
    errorInfo: null
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
      errorInfo
    })
  }
  render () {
    const {
      history,
      type,
      children,
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
            background: 'rgba(0,0,0,0.05)'
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
      ;['push', 'replace'].forEach(method => {
        const originalMethod = resolvedHistory[method]
        resolvedHistory[method] = async (...args) => {
          const path = typeof args[0] === 'string' ? args[0] : args[0].path + args[0].search
          setLoading(true)
          await prefetch(path, {
            priority: true
          })
          setLoading(false)
          originalMethod.apply(resolvedHistory, args)
        }
      })
    }

    return (
      <ResolvedRouter history={resolvedHistory} location={staticURL} context={context} {...rest}>
        <RouterScroller {...{ scrollToTopDuration, scrollToHashDuration }}>
          {children}
        </RouterScroller>
      </ResolvedRouter>
    )
  }
}

function isRoutingUrl (to) {
  if (typeof to === 'undefined') return false
  return (
    !to.match(/^#/) &&
    !to.match(/^[a-z]{1,10}:\/\//) &&
    !to.match(/^(data|mailto):/) &&
    !to.match(/^\/\//)
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
  'replace'
]

export function NavLink ({ Comp, only, ...rest }) {
  const { to } = rest
  const resolvedTo = isObject(to) ? to.path : to
  // Router Link
  if (isRoutingUrl(resolvedTo)) {
    return (
      <PrefetchWhenSeen
        path={resolvedTo}
        only={only}
        render={({ handleRef }) => <ReactRouterNavLink {...rest} innerRef={handleRef} />}
      />
    )
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

export const Link = NavLink
