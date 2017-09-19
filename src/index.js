import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
//
import { normalizeRoutes, pathJoin, throttle } from './static.shared'

const propsCache = {}
const failedCache = {}

const preloadCache = {}

const fetchAssets = async href => {
  // Do not double preload or attempt on previously failed preloads
  if (propsCache[href] || failedCache[href]) {
    return
  }
  try {
    const { data } = await axios.get(pathJoin(href, 'routeData.json'))
    propsCache[href] = data
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
  } catch (err) {
    failedCache[href] = true
    if (process.env.NODE_ENV === 'development') {
      console.warn('No props were found for route:', href)
    }
  }
}

const runPreload = () => {
  setTimeout(() => {
    let links = document.querySelectorAll('a')
    links = Array.from(links)
    links = links
      .filter(d => d.href.startsWith(window.location.origin))
      .map(d => {
        let end = d.href.indexOf('#')
        end = end === -1 ? undefined : end
        d._localHref = pathJoin(d.href.substring(window.location.origin.length, end))
        return d
      })
      .filter(d => d._localHref.length)
      .filter((d, index, self) => self.findIndex(dd => dd._localHref === d._localHref) === index)

    links.forEach(async link => {
      const rect = link.getBoundingClientRect()

      // Only preload links that are in the viewport
      if (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.left <= (window.innerWidth || document.documentElement.clientWidth)
      ) {
        fetchAssets(link._localHref)
      }
    })
  }, 500)
}

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  const throttledRunPreload = throttle(runPreload, 1000)

  setTimeout(() => throttledRunPreload(), 1000)
  document.addEventListener('scroll', throttledRunPreload, true)

  const originalPushState = window.history.pushState
  window.history.pushState = (...args) => {
    setTimeout(() => throttledRunPreload(), 1000)
    return originalPushState.apply(history, args)
  }

  const originalReplaceState = window.history.replaceState
  window.history.pushState = (...args) => {
    setTimeout(() => throttledRunPreload(), 1000)
    return originalReplaceState.apply(history, args)
  }
}

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
        return options.loading ? <options.loading /> : <span>Loading...</span>
      }
      return <Comp {...this.props} {...initialProps} />
    }
  }
