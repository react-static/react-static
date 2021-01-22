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
  routeErrorByPath,
} from '..'
import { getCurrentRoutePath, is404Path, PATH_404 } from '../utils'
import { useStaticInfo } from '../hooks/useStaticInfo'
import { routePathContext, useRoutePath } from '../hooks/useRoutePath'

/**
 *
 * @param {string} path
 * @returns {React.ComponentType<{}> | false}
 */
function getTemplateForPath(path) {
  let is404 = is404Path(path)
  let Comp = templatesByPath[path] || false

  if (!Comp && templateErrorByPath[path]) {
    is404 = true
    Comp = templatesByPath[PATH_404] || false
  }

  return { is404, Comp }
}

/**
 *
 *
 * @param {string} path
 * @returns {React.ReactNode | false}
 */
function getComponentForPath(path) {
  const { Comp, is404 } = getTemplateForPath(path)
  if (is404 && !Comp) {
    return false
  }

  return React.createElement(Comp, { is404 })
}

const RoutesInner = ({ routePath, render: renderFn }) => {
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

      // For a 404 route we will register the current route as invalid
      if (is404Path(path)) {
        const currentPath = getCurrentRoutePath()
        // As long as we didn't navigate to the 404.html page directly
        if (is404Path(currentPath)) {
          routeErrorByPath[currentPath] = true
          templateErrorByPath[currentPath] = true
        }
      }
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
    // use the window location as the default
    routePath = decodeURIComponent(window.location.href)
  }

  routePath = useRoutePath(routePath)

  // Try and get the template
  const { Comp, is404 } = getTemplateForPath(routePath)

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
      {renderFn ? (
        renderFn({ routePath, getComponentForPath })
      ) : (
        <Comp is404={is404} />
      )}
    </routePathContext.Provider>
  )
}

const Routes = ({ ...originalProps }) => {
  // Once a routePath goes into the Routes component,
  // useRoutePath must ALWAYS return the routePath used
  // in its parent, so we pass it down as context

  // Get the Routes hook
  const CompWrapper = useMemo(
    () => plugins.Routes(props => <RoutesInner {...props} />),
    [plugins]
  )

  // Pass all props so that plugins can use it
  return <CompWrapper {...originalProps} />
}

export default Routes
