import React, { useState, useMemo, useEffect } from 'react'
//
import {
  templatesByPath,
  templateErrorByPath,
  routeInfoByPath,
  sharedDataByHash,
  registerTemplateForPath,
  prefetch,
  plugins,
  onReloadTemplates,
} from ".."
import { useStaticInfo } from '../hooks/useStaticInfo'
import { routePathContext, useRoutePath } from '../hooks/useRoutePath'

const RoutesInner = ({ routePath }) => {
  // Let the user specify a manual routePath.
  // This is useful for animations where multiple routes
  // might be rendered simultaneously

  const staticInfo = useStaticInfo()
  // eslint-disable-next-line
  const [_, setCount] = useState(0)

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

  useEffect(() =>
    onReloadTemplates(() => {
      setCount(old => old + 1)
    })
  )

  // If SSR, force the routePath to be the statically exported one
  if (typeof document === 'undefined') {
    routePath = staticInfo.path
  } else if (!routePath) {
    // If a routePath is still not defined in the browser,
    // use the window location as the defualt
    routePath = decodeURIComponent(window.location.href)
  }

  routePath = useRoutePath(routePath)

  // Try and get the template
  let Comp = templatesByPath[routePath]

  // Detect a 404
  let is404 = routePath === '404'

  // Detect a failed template
  if (templateErrorByPath[routePath]) {
    is404 = true
    Comp = templatesByPath['404']
  }

  if (!Comp) {
    if (is404) {
      throw new Error(
        'Neither the page template or 404 template could be found. This means something is terribly wrong. Please, file an issue!'
      )
    }
    // Suspend while we fetch the resource
    throw Promise.all([
      new Promise(resolve => setTimeout(resolve, 500)),
      prefetch(routePath, { priority: true }),
    ])
  }

  return (
    <routePathContext.Provider value={routePath}>
      <Comp is404={is404} />
    </routePathContext.Provider>
  )
}

const Routes = ({ routePath }) => {
  // Once a routePath goes into the Routes component,
  // useRoutePath must ALWAYS return the routePath used
  // in its parent, so we pass it down as context

  // Get the Routes hook
  const CompWrapper = useMemo(
    () => plugins.Routes(props => <RoutesInner {...props} />),
    [plugins]
  )

  return <CompWrapper routePath={routePath} />
}

export default Routes
