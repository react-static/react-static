import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
//
import { normalizeRoutes, pathJoin } from './shared'

const propsCache = {}
const inflight = {}
const failed = {}

// const preloadCache = {}

export const prefetch = async path => {
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
  path = pathJoin(path.substring(hasOrigin ? window.location.origin.length : 0, end))

  // Defer to the cache first
  if (propsCache[path]) {
    return propsCache[path]
  }

  // Don't attempt previously failed prefetches
  if (failed[path]) {
    return
  }

  // Fallback to fetching the path's route data
  try {
    // Reuse request for duplicate inflight requests
    inflight[path] = inflight[path] || axios.get(pathJoin(path, 'routeData.json'))
    const { data } = await inflight[path]

    // Place it in the cache
    propsCache[path] = data
    delete inflight[path]

    return data
  } catch (err) {
    failed[path] = true
    delete inflight[path]
    if (process.env.NODE_ENV === 'development') {
      console.warn('No props were found for route:', path)
    }
    throw err
  }
}

const DefaultLoading = () =>
  (<div
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
          r: '20',
          stroke: 'rgba(0,0,0,0.4)',
          strokeWidth: '4px',
          cx: '25',
          cy: '25',
          strokeDasharray: '10.4',
          strokeLinecap: 'round',
          fill: 'transparent',
        }}
      />
    </svg>
  </div>)

export const GetRouteProps = (Comp, options = {}) =>
  class AsyncPropsComponent extends Component {
    static contextTypes = {
      initialProps: PropTypes.object,
      static: PropTypes.object,
    }
    constructor () {
      super()
      this._update = this._update.bind(this)
    }
    state = { data: null }
    componentWillMount () {
      this._update()
    }
    componentWillReceiveProps () {
      this._update()
    }
    async _update () {
      if (typeof window !== 'undefined') {
        const currentPath = pathJoin(window.location.pathname, window.location.search)

        // Hit the cache first
        if (propsCache[currentPath]) {
          return this.setState({
            data: propsCache[currentPath].initialProps,
          })
        }

        // For dev mode, hit the async getProps for the route
        if (process.env.NODE_ENV === 'development') {
          this.setState({
            data: null,
          })
          const userConfig = require('__static-config').default
          const routes = normalizeRoutes(await userConfig.getRoutes({ prod: false }))
          const currentRoute = routes.find(d => d.path === currentPath)

          if (!currentRoute) {
            console.warn('No routed defined for:', currentPath)
          }

          if (currentRoute.getProps) {
            const initialProps = await currentRoute.getProps({ route: currentRoute })
            propsCache[currentPath] = {
              initialProps,
            }
            return this.setState({
              data: initialProps,
            })
          }
          console.warn('No getProps function defined for route:', currentRoute.path)
          return
        }

        // Then try for the embedded data
        if (window.__routeData && window.__routeData.path === currentPath) {
          propsCache[currentPath] = window.__routeData
          this.setState({
            data: propsCache[currentPath].initialProps,
          })
          return
        }

        // Then retrieve async
        this.setState({
          data: null,
        })
        const { data } = await axios.get(pathJoin(currentPath, 'routeData.json'))
        propsCache[currentPath] = data
        return this.setState({
          data: data.initialProps,
        })
      }
    }
    render () {
      const initialProps = this.context.initialProps || this.state.data
      if (!initialProps) {
        return options.loading ? <options.loading /> : <DefaultLoading />
      }
      return <Comp {...this.props} {...initialProps} />
    }
  }

export class Prefetch extends Component {
  static defaultProps = {
    path: null,
    onLoad: () => {},
  }
  async componentDidMount () {
    if (process.env.NODE_ENV === 'production') {
      const { path, onLoad } = this.props

      const data = await prefetch(path)
      onLoad(data, path)
      // Warm the cache for any known assets
      // if (data.preload) {
      //   data.preload.forEach(async p => {
      //     // Do not double prefetch or attempt on previously failed assets
      //     if (preloadCache[p]) {
      //       return
      //     }
      //     try {
      //       await axios.get(p)
      //       preloadCache[p] = true
      //     } catch (err) {
      //       //
      //     }
      //   })
      // }
    }
  }
  render () {
    return this.props.children || null
  }
}
