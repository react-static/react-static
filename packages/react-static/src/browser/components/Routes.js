import React, { useState } from 'react'
//
import {
  templatesByPath,
  templateErrorByPath,
  routeErrorByPath,
  routeInfoByPath,
  sharedDataByHash,
  registerTemplateForPath,
  prefetch,
  plugins,
} from '../'
import { makeHookReducer } from '../utils'
import { useStaticInfo } from '../hooks/useStaticInfo'
import { routePathContext, useRoutePath } from '../hooks/useRoutePath'

const RoutesHook = makeHookReducer(plugins, 'Routes', { sync: true })

let RoutesWrapper = ({ children }) => children
RoutesWrapper = RoutesHook(RoutesWrapper)

export const Routes = ({ routePath }) => {
  // Let the user specify a manual routePath.
  // This is useful for animations where multiple routes
  // might be rendered simultaneously

  const staticInfo = useStaticInfo()

  // If in production, make sure the staticInfo is ingested into the
  // cache
  useState(() => {
    // useState's initializer will only fire once per component instance,
    // and it will fire during the first render (unlike an effect, which
    // only fires after the first render). Think of it like a constructor call.
    if (process.env.REACT_STATIC_ENV === 'production' && staticInfo) {
      const { path, sharedData, sharedHashesByProp, template } = staticInfo

      // Hydrate routeInfoByPath with the embedded routeInfo
      routeInfoByPath[path] = staticInfo

      // Hydrate sharedDataByHash with the embedded routeInfo
      Object.keys(sharedHashesByProp).forEach(propKey => {
        sharedDataByHash[sharedHashesByProp[propKey]] = sharedData[propKey]
      })

      // In SRR and production, synchronously register the template for the
      // initial path
      registerTemplateForPath(path, template)
    }
  })

  // If SSR, force the routePath to be the statically exported one
  if (typeof document === 'undefined') {
    routePath = staticInfo.path
  } else if (!routePath) {
    // If a routePath is still not defined in the browser,
    // use the window location as the defualt
    routePath = decodeURIComponent(window.location.href)
  }

  routePath = useRoutePath(routePath)

  // Try and get the component
  let Comp = templatesByPath[routePath]

  // Detect a 404
  let is404 = routePath === '404'

  // Detect a failed template
  if (templateErrorByPath[routePath]) {
    is404 = true
    Comp = templatesByPath['404']
    // Mark the route as errored
    routeErrorByPath[routePath] = true
    templateErrorByPath[routePath] = true
  }

  if (!Comp) {
    if (is404) {
      throw new Error(
        'Neither the page template or 404 template could be found. This means something is terribly wrong. Please, file an issue!'
      )
    }
    // Suspend while we fetch the resource
    throw prefetch(routePath, { priority: true })
  }

  return (
    // Once a routePath goes into the Routes component,
    // useRoutePath must ALWAYS return the routePath used
    // in its parent, so we pass it down as context
    <routePathContext.Provider value={routePath}>
      <RoutesWrapper is404={is404}>
        <Comp is404={is404} />
      </RoutesWrapper>
    </routePathContext.Provider>
  )
}
