import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Router as ReactRouter } from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import { Helmet } from 'react-helmet'
//
import { normalizeRoutes, pathJoin } from './shared'

const propsCache = {}
const inflight = {}
const failed = {}

// const preloadCache = {}

let routesPromise
let InitialLoading

if (process.env.NODE_ENV === 'development') {
  routesPromise = (async () => {
    const userConfig = require('__static-config').default
    return normalizeRoutes(await userConfig.getRoutes({ dev: true }))
  })()
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

  // For dev mode, hit the async getProps for the route
  if (process.env.NODE_ENV === 'development') {
    const routes = await routesPromise
    const currentRoute = routes.find(d => d.path === path)

    // Warn for missing routes
    if (!currentRoute) {
      console.warn('No route defined for:', path)
      return
    }

    if (currentRoute.getProps) {
      // Reuse request for duplicate inflight requests
      try {
        if (!inflight[path]) {
          inflight[path] = currentRoute.getProps({ route: currentRoute, dev: true })
        }
        const initialProps = await inflight[path]

        // Place it in the cache
        propsCache[path] = {
          initialProps,
        }
      } catch (err) {
        console.warn('There was an error during getProps() for route:', path)
        console.error(err)
      }
      delete inflight[path]
      return propsCache[path]
    }
    return
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
    console.warn('There was an error during getProps() for route:', path)
    console.error(err)
  }
  delete inflight[path]
  return propsCache[path]
}

export const getRouteProps = Comp =>
  class AsyncPropsComponent extends Component {
    static contextTypes = {
      initialProps: PropTypes.object,
      router: PropTypes.object,
    }
    async componentWillMount () {
      if (process.env.NODE_ENV === 'development') {
        const { url } = this.context.router.route.match
        const path = pathJoin(url)
        await prefetch(path)
        this.setState({})
      }
    }
    render () {
      const { url } = this.context.router.route.match
      const path = pathJoin(url)

      let embeddedProps
      if (typeof window !== 'undefined') {
        if (window.__routeData && window.__routeData.path === path) {
          embeddedProps = window.__routeData.initialProps
        }
      }

      const initialProps =
        embeddedProps ||
        (propsCache[path] ? propsCache[path].initialProps : this.context.initialProps)

      if (!initialProps) {
        if (process.env.NODE_ENV === 'development') {
          return <InitialLoading />
        }
        return null
      }
      return <Comp {...this.props} {...initialProps} />
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

let loading = false
let subscribers = []
const setLoading = d => {
  loading = d
  subscribers.forEach(s => s())
}

export class Router extends Component {
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
  render () {
    const { history, ...rest } = this.props
    const { URL } = this.context
    const context = URL ? {} : undefined

    let ResolvedRouter
    let resolvedHistory

    // If statically rendering, use the static router
    if (URL) {
      ResolvedRouter = require('react-router').StaticRouter
      resolvedHistory = undefined
    } else {
      ResolvedRouter = ReactRouter
      resolvedHistory = history || createBrowserHistory()
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
              console.warn('Uh oh! We should probably display a soft 404 here')
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

export const Head = Helmet
