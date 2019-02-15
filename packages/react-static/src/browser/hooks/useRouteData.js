import { prefetch, routeInfoByPath, routeErrorByPath } from '../'
import { useRoutePath } from '../hooks/useRoutePath'

export const useRouteData = () => {
  const routePath = useRoutePath()

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

  // If we need to load data, suspend while it's requested
  if (shouldLoadData(routeInfo)) {
    throw prefetch(routePath, { priority: true })
  }

  // Otherwise, return all of the data
  return {
    ...routeInfo.data,
    ...routeInfo.sharedData,
  }
}

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
