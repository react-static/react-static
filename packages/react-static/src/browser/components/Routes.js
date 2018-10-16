import React, { Component } from 'react'
//
import {
  templatesByPath,
  templateErrorByPath,
  templateUpdated,
  getRouteInfo,
  prefetchTemplate,
  registerTemplateForPath,
  getCurrentRoutePath,
} from '../'
import { withStaticInfo } from './StaticInfo'
import { getRoutePath, isSSR } from '../utils'
import Spinner from './Spinner'

let locationSubscribers = []
const triggerLocationChange = () => locationSubscribers.forEach(s => s())
const onLocationChange = cb => {
  locationSubscribers.push(cb)
  return () => {
    locationSubscribers = locationSubscribers.filter(d => d !== cb)
  }
}

init()

function init() {
  if (typeof document !== 'undefined') {
    const oldPopstate = window.onpopstate
    window.onpopstate = (...args) => {
      if (oldPopstate) {
        oldPopstate(...args)
      }
      triggerLocationChange()
    }
    ;['pushState', 'replaceState'].forEach(methodName => {
      const old = window.history[methodName]
      window.history[methodName] = (...args) => {
        triggerLocationChange()
        return old.apply(window.history, args)
      }
    })
  }
}

export default withStaticInfo(
  class Routes extends Component {
    static defaultProps = {
      Loader: Spinner,
    }
    state = {
      ready: process.env.NODE_ENV === 'production',
    }
    componentDidMount() {
      templateUpdated.cb = () => this.forceUpdate()
      this.fetchRouteInfo()
      this.offLocationChange = onLocationChange(() => this.forceUpdate())
    }
    componentWillUnmount() {
      if (this.offLocationChange) this.offLocationChange()
    }
    fetchRouteInfo = async () => {
      const currentRoutePath = getCurrentRoutePath()

      if (process.env.REACT_STATIC_ENV === 'development') {
        try {
          const routeInfo = await getRouteInfo(currentRoutePath, {
            priority: true,
          })
          if (routeInfo) {
            registerTemplateForPath(currentRoutePath, routeInfo.templateIndex)
          }
        } finally {
          this.setState({ ready: true })
        }
      }
    }
    render() {
      const { children, Loader, staticInfo } = this.props
      const { ready } = this.state

      const currentRoutePath = isSSR() ? staticInfo.path : getCurrentRoutePath()

      const getComponentForPath = routePath => {
        // Clean the path
        routePath = getRoutePath(routePath)
        // Try and get the component
        let Comp = templatesByPath[routePath]
        // Detect a 404
        let is404 = routePath === '404'
        // Detect a failed template
        if (templateErrorByPath[routePath]) {
          is404 = true
          Comp = templatesByPath['/404']
        }

        // Detect an unloaded template
        if (!Comp) {
          ;(async () => {
            await Promise.all([
              prefetchTemplate(routePath),
              new Promise(resolve =>
                setTimeout(resolve, process.env.REACT_STATIC_MIN_LOAD_TIME)
              ),
            ])
            this.forceUpdate()
          })()
          return Loader
        }

        return (newProps = {}) =>
          Comp ? (
            <Comp {...newProps} {...(is404 ? { is404: true } : {})} />
          ) : null
      }

      if (!ready) {
        return <Loader />
      }

      if (children) {
        return children({
          getComponentForPath,
        })
      }

      const Comp = getComponentForPath(currentRoutePath)
      return <Comp />
    }
  }
)
