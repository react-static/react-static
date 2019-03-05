import React from 'react'

import { prefetch, routeInfoByPath, routeErrorByPath } from '../'
import Spinner from './Spinner'
import { withStaticInfo } from './StaticInfo'
import { withRoutePathContext } from './Routes'
import { getFullRouteData } from '../utils'

let instances = []

if (process.env.REACT_STATIC_ENV === 'development') {
  global.reloadAll = () => {
    instances.forEach(instance => instance.safeForceUpdate())
  }
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

        const routeError = routeErrorByPath[routePath]
        const routeInfo = routeError
          ? routeInfoByPath['404']
          : routeInfoByPath[routePath]

        // If there was an error reported for this path, throw an error
        // unless there is data for the 404 page
        if (routeError && (!routeInfo || !routeInfo.data)) {
          throw new Error(
            `React-Static: <RouteData> could not find any data for this route: ${routePath}. If this is a dynamic route, please remove any reliance on RouteData or withRouteData from this routes components`
          )
        }

        // If we haven't requested the routeInfo and its shared data yet, or it's loading
        // Show a spinner and prefetch the data
        // TODO:suspense - This will become a suspense resource
        if (shouldLoadData(routeInfo)) {
          ;(async () => {
            await Promise.all([
              prefetch(routeInfo.path, { priority: true }),
              new Promise(resolve =>
                setTimeout(resolve, process.env.REACT_STATIC_MIN_LOAD_TIME)
              ),
            ])
            this.safeForceUpdate()
          })()
          return <Loader />
        }

        // Otherwise, get it from the routeInfoByPath (subsequent client side)
        // and merge it with the shared data
        const routeData = getFullRouteData(routeInfo)

        return children(routeData)
      }
    }
  )
)

function shouldLoadData(routeInfo) {
  if (!routeInfo || !routeInfo.data) {
    return true
  }

  return shouldLoadSharedData(routeInfo)
}

function shouldLoadSharedData(routeInfo) {
  return hasPropHashes(routeInfo) && !routeInfo.sharedData
}

function hasPropHashes(routeInfo) {
  return (
    routeInfo.sharedHashesByProp &&
    Object.keys(routeInfo.sharedHashesByProp).length > 0
  )
}

export default RouteData

export function withRouteData(Comp, opts = {}) {
  return props => (
    <RouteData {...opts}>
      {routeData => <Comp {...routeData} {...props} />}
    </RouteData>
  )
}
