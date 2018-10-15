import React from 'react'

import { prefetch, routeInfoByPath } from '../'
import { getCurrentRoutePath } from '../utils'
import Spinner from './Spinner'

const warnedPaths = {}
let instances = []

// TODO:v6 Do we need this anymore? It's for when data changes in
// dev mode and we need the RouteData components to rerender...
// I think we still need it.

// global.reloadAll = () => {
//   instances.forEach(instance => instance.reloadRouteData())
// }

export default class RouteData extends React.Component {
  static defaultProps = {
    Loader: Spinner,
  }
  componentDidMount() {
    if (process.env.REACT_STATIC_ENV === 'development') {
      instances.push(this)
      this.loadRouteData()
    }
  }
  componentWillUnmount() {
    if (process.env.REACT_STATIC_ENV === 'development') {
      instances = instances.filter(d => d !== this)
    }
    this.unmounting = true
  }
  // reloadRouteData = () =>
  //   (async () => {
  //     await this.loadRouteData()
  //     this.forceUpdate()
  //   })()
  loadRouteData = () =>
    (async () => {
      const { is404 } = this.props
      const routePath = getCurrentRoutePath()
      try {
        await prefetch(routePath)
        return new Promise(resolve => {
          this.setState({ loading: false }, resolve)
        })
      } catch (err) {
        return new Promise(resolve => {
          this.setState({ loading: false }, resolve)
        })
      }
    })()
  render() {
    const { children, Loader } = this.props
    const path = getCurrentRoutePath()

    // If we haven't requested the routeInfo yet, or it's loading
    // Show a spinner
    if (!routeInfoByPath[path] || routeInfoByPath[path].loading) {
      return <Loader />
    }

    if (routeInfoByPath[path]) {
      // Otherwise, get it from the routeInfoByPath (subsequent client side)
      return children(routeInfoByPath[path].allProps)
    }

    if (!warnedPaths[path]) {
      warnedPaths[path] = true
      throw new Error(
        `React-Static could not find any data for this route: ${path}. If this is a dynamic route, please remove any reliance on RouteData or withRouteData from this routes components`
      )
    }

    return null
  }
}

export function withRouteData(Comp, opts = {}) {
  return props => (
    <RouteData {...opts}>
      {routeData => <Comp {...routeData} {...props} />}
    </RouteData>
  )
}
