import React from 'react'

import { prefetch, routeInfoByPath, routeErrorByPath } from '../'
import Spinner from './Spinner'
import { withStaticInfo } from './StaticInfo'
import { withRoutePathContext } from './Routes'

let instances = []

global.reloadAll = () => {
  instances.forEach(instance => instance.safeForceUpdate())
}

const RouteData = withStaticInfo(
  withRoutePathContext(
    class RouteData extends React.Component {
      static defaultProps = {
        Loader: Spinner,
      }
      componentDidMount() {
        instances.push(this)
      }
      componentWillUnmount() {
        instances = instances.filter(d => d !== this)
        this.unmounted = true
      }
      safeForceUpdate = () => {
        if (this.unmounted) {
          return
        }
        this.forceUpdate()
      }
      render() {
        const { children, Loader, routePath } = this.props

        // If there was an error reported for this path, throw an error
        if (routeErrorByPath[routePath]) {
          throw new Error(
            `React-Static: <RouteData> could not find any data for this route: ${routePath}. If this is a dynamic route, please remove any reliance on RouteData or withRouteData from this routes components`
          )
        }

        // If we haven't requested the routeInfo yet, or it's loading
        // Show a spinner and prefetch the data
        // TODO:suspense - This will become a suspense resource
        console.log(routeInfoByPath, routePath)
        if (
          !routeInfoByPath[routePath] ||
          !routeInfoByPath[routePath].allProps
        ) {
          ;(async () => {
            await Promise.all([
              prefetch(routePath, { priority: true }),
              new Promise(resolve =>
                setTimeout(resolve, process.env.REACT_STATIC_MIN_LOAD_TIME)
              ),
            ])
            this.safeForceUpdate()
          })()
          return <Loader />
        }

        // Otherwise, get it from the routeInfoByPath (subsequent client side)
        return children(routeInfoByPath[routePath].allProps)
      }
    }
  )
)

export default RouteData

export function withRouteData(Comp, opts = {}) {
  return props => (
    <RouteData {...opts}>
      {routeData => <Comp {...routeData} {...props} />}
    </RouteData>
  )
}
