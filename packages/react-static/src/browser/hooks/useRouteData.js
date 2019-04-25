import { useState, useEffect } from 'react'
import {
  prefetch,
  routeInfoByPath,
  routeErrorByPath,
  onReloadClientData,
} from '..'
import { useRoutePath } from './useRoutePath'
import { getFullRouteData } from '../utils'

const useRouteData = () => {
  const routePath = useRoutePath()
  // eslint-disable-next-line
  const [_, setCount] = useState(0)

  useEffect(() =>
    onReloadClientData(() => {
      setCount(old => old + 1)
    })
  )

  const routeError = routeErrorByPath[routePath]
  const routeInfo = routeError
    ? routeInfoByPath['404']
    : routeInfoByPath[routePath]

  // If there was an error reported for this path, throw an error
  // unless there is data for the 404 page
  if (routeError && (!routeInfo || !routeInfo.data)) {
    throw new Error(
      `React-Static: useRouteData() could not find any data for this route: ${routePath}. If this is a dynamic route, please remove any calls to useRouteData() from this route's components`
    )
  }

  const targetRouteInfoPath = routeInfo ? routeInfo.path : routePath

  // If we need to load data, suspend while it's requested
  if (shouldLoadData(routeInfo)) {
    throw Promise.all([
      new Promise(resolve =>
        setTimeout(resolve, process.env.REACT_STATIC_MIN_LOAD_TIME)
      ),
      prefetch(targetRouteInfoPath, { priority: true }),
    ])
  }

  // Otherwise, return all of the data
  return getFullRouteData(routeInfo)
}

export default useRouteData

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
