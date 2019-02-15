import React, { useContext } from 'react'
import { getRoutePath } from '../utils'

export const routePathContext = React.createContext()

export const useRoutePath = routePath => {
  const routePathContextValue = useContext(routePathContext)

  // If we are in a routePathContext, use it always
  if (routePathContextValue) {
    return routePathContextValue
  }

  // Clean the path
  return getRoutePath(routePath)
}
