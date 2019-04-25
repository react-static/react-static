import React from 'react'
import useRouteData from '../hooks/useRouteData'

export function RouteData({ children }) {
  return children(useRouteData())
}

export function withRouteData(Comp) {
  return function componentWithRouteData(props) {
    const routeData = useRouteData()
    return <Comp {...props} {...routeData} />
  }
}
