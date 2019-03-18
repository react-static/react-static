import { useContext } from 'react'
import routePathContext from '../context/routePathContext'
import { getRoutePath } from '../utils'

export { routePathContext }

export const useRoutePath = routePath => {
  const routePathContextValue = useContext(routePathContext)

  // If we are in a routePathContext, use it always
  if (routePathContextValue) {
    return routePathContextValue
  }

  // Clean the path
  return getRoutePath(routePath)
}
