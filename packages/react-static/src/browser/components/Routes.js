import React, { Component } from 'react'
//
import {
  templatesByPath,
  templateErrorByPath,
  templateUpdated,
  prefetch,
  getCurrentRoutePath,
} from '../'
import { withStaticInfo } from './StaticInfo'
import { getRoutePath, isSSR } from '../utils'
import onLocation from '../utils/Location'
import Spinner from './Spinner'

const RoutePathContext = React.createContext()

export const withRoutePathContext = Comp => props => (
  <RoutePathContext.Consumer>
    {routePath => <Comp {...props} routePath={routePath} />}
  </RoutePathContext.Consumer>
)

const componentCache = new WeakMap()
function with404Prop(Component) {
  // If the wrapped Component is currently in cached, return it from cache.
  if (componentCache.has(Component)) {
    return componentCache.get(Component)
  }

  // Otherwise, create a new wrapped Component...
  const WrappedComponent = props => <Component is404 {...props} />

  // ...and cache it
  componentCache.set(Component, WrappedComponent)
  return WrappedComponent
}

export default withStaticInfo(
  class Routes extends Component {
    static defaultProps = {
      Loader: Spinner,
    }
    componentDidMount() {
      templateUpdated.cb = () => this.safeForceUpdate()
      this.offLocationChange = onLocation(() => this.safeForceUpdate())
    }
    componentWillUnmount() {
      this.unmounted = true
      if (this.offLocationChange) this.offLocationChange()
    }
    safeForceUpdate = () => {
      if (this.unmounted) {
        return
      }
      this.forceUpdate()
    }
    getComponentForPath = routePath => {
      const { Loader } = this.props

      // Clean the path
      routePath = getRoutePath(routePath)

      // Try and get the component
      let Comp = templatesByPath[routePath]

      // Detect a 404
      let is404 = routePath === '404'

      // Detect a failed template
      if (templateErrorByPath[routePath]) {
        is404 = true
        Comp = templatesByPath['404']
      }

      // Detect an unloaded template
      // TODO:suspense - This will become a suspense resource
      if (!Comp) {
        if (is404) {
          throw new Error(
            'This page template could not be found and a 404 template could not be found to fall back on. This means something is terribly wrong and you should probably file an issue!'
          )
        }
        ;(async () => {
          await Promise.all([
            prefetch(routePath, { priority: true }),
            new Promise(resolve =>
              setTimeout(resolve, process.env.REACT_STATIC_MIN_LOAD_TIME)
            ),
          ])
          this.safeForceUpdate()
        })()
        return Loader
      }

      return is404 ? with404Prop(Comp) : Comp
    }

    render() {
      const { children, staticInfo } = this.props

      const routePath = isSSR() ? staticInfo.path : getCurrentRoutePath()
      const Comp = this.getComponentForPath(routePath)

      return (
        <RoutePathContext.Provider value={routePath}>
          {children ? (
            children({
              routePath,
              getComponentForPath: this.getComponentForPath,
            })
          ) : (
            <Comp />
          )}
        </RoutePathContext.Provider>
      )
    }
  }
)
