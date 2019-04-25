import React from 'react'
import useSiteData from '../hooks/useSiteData'

export function SiteData({ children }) {
  return children(useSiteData())
}

export function withSiteData(Comp) {
  return function componentWithSiteData(props) {
    const routeData = useSiteData()
    return <Comp {...props} {...routeData} />
  }
}
