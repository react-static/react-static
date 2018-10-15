import React, { Component } from 'react'
//
import {
  templates,
  templateIndexByPath,
  templateUpdated,
  getRouteInfo,
  prefetchTemplate,
  registerTemplateIndexForPath,
} from '../'
import { getRoutePath, getCurrentRoutePath } from '../utils'
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

export default class Routes extends Component {
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
          registerTemplateIndexForPath(
            currentRoutePath,
            routeInfo.templateIndex
          )
        }
      } finally {
        this.setState({ ready: true })
      }
    }
  }
  render() {
    const { children, Loader } = this.props
    const { ready } = this.state

    const currentRoutePath = getCurrentRoutePath()

    const getComponentForPath = routePath => {
      // Clean the path
      routePath = getRoutePath(routePath)
      // Try and get the component
      let Comp = templates[templateIndexByPath[routePath]]
      // Detect a 404
      let is404 = routePath === '404'
      // Detect a non-attempted template
      if (typeof Comp === 'undefined') {
        ;(async () => {
          await prefetchTemplate(routePath)
          this.forceUpdate()
        })()
        return Loader
      }
      // Detect a loading template
      if (Comp === null) {
        return Loader
      }
      // Detect a failed template
      if (Comp === false) {
        if (templateIndexByPath) is404 = true
        Comp = templates[templateIndexByPath['/404']]
      }
      return (newProps = {}) =>
        Comp ? <Comp {...newProps} {...(is404 ? { is404: true } : {})} /> : null
    }

    const renderProps = {
      getComponentForPath,
    }

    if (!ready) {
      return <Loader />
    }

    if (children) {
      return children(renderProps)
    }

    const Comp = getComponentForPath(currentRoutePath)
    return <Comp />
  }
}
