import React from 'react'

import {
  prefetch,
  routeInfoByPath,
  routeErrorByPath,
  getCurrentRoutePath,
} from '../'
import { isSSR } from '../utils'
import Spinner from './Spinner'
import { withStaticInfo } from './StaticInfo'

let instances = []

// TODO:v6 Do we need this anymore? It's for when data changes in
// dev mode and we need the RouteData components to rerender...
// I think we still need it.

// global.reloadAll = () => {
//   instances.forEach(instance => instance.reloadRouteData())
// }

const RouteData = withStaticInfo(
  class RouteData extends React.Component {
    static defaultProps = {
      Loader: Spinner,
    }
    componentDidMount() {
      if (typeof document !== 'undefined') {
        this.loadRouteData()
      }
      instances.push(this)
    }
    componentDidUpdate() {
      if (typeof document !== 'undefined') {
        if (this.currentPath !== getCurrentRoutePath()) {
          this.currentPath = getCurrentRoutePath()
          this.loadRouteData()
        }
      }
    }
    componentWillUnmount() {
      instances = instances.filter(d => d !== this)
      this.unmounting = true
    }
    // reloadRouteData = () =>
    //   (async () => {
    //     await this.loadRouteData()
    //     this.forceUpdate()
    //   })()
    loadRouteData = () =>
      (async () => {
        // const { is404 } = this.props // TODO:v6 We need to figure out 404 template and data loading
        await Promise.all([
          prefetch(getCurrentRoutePath()),
          new Promise(resolve =>
            setTimeout(resolve, process.env.REACT_STATIC_MIN_LOAD_TIME)
          ),
        ])
        this.setState({ loading: false })
      })()
    render() {
      const { children, Loader, staticInfo } = this.props
      const path = isSSR() ? staticInfo.path : getCurrentRoutePath()

      // If there was an error reported for this path, throw an error
      if (routeErrorByPath[path]) {
        throw new Error(
          `React-Static: <RouteData> could not find any data for this route: ${path}. If this is a dynamic route, please remove any reliance on RouteData or withRouteData from this routes components`
        )
      }

      // If we haven't requested the routeInfo yet, or it's loading
      // Show a spinner
      if (!routeInfoByPath[path] || !routeInfoByPath[path].allProps) {
        return <Loader />
      }

      // Otherwise, get it from the routeInfoByPath (subsequent client side)
      return children(routeInfoByPath[path].allProps)
    }
  }
)

export default RouteData

export function withRouteData(Comp, opts = {}) {
  return props => (
    <RouteData {...opts}>
      {routeData => <Comp {...routeData} {...props} />}
    </RouteData>
  )
}
