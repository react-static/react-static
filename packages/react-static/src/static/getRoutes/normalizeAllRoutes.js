import normalizeRoute from './normalizeRoute'

// We recursively loop through the routes and their children and
// return an array of normalised routes.
// Original routes array [{ path: 'path', children: { path: 'to' } }]
// These can be returned as flat routes eg. [{ path: 'path' }, { path: 'path/to' }]
// Or they can be returned nested routes eg. [{ path: 'path', children: { path: 'path/to' } }]
export default function normalizeAllRoutes(routes = [], config, opts = {}) {
  const existingRoutes = {}
  let hasIndex
  let has404

  const recurseRoute = (route, parent) => {
    // if structure is nested (tree === true) normalizedRoute will
    // have children otherwise we fall back to the original route children
    // Normalize the route
    let normalizedRoute = normalizeRoute(route, parent)

    // we check an array of paths to see
    // if route path already existings
    const existingRoute = existingRoutes[normalizedRoute.path]

    if (normalizedRoute.children) {
      normalizedRoute.children = normalizedRoute.children
        .map(childRoute => recurseRoute(childRoute, normalizedRoute))
        .filter(Boolean)
    }

    let isPageExtension
    // If the route exists and is a page route, we need to decorate the
    // page route with this routes information
    if (existingRoute) {
      if (existingRoute.isPage) {
        isPageExtension = true
        Object.assign(existingRoute, {
          ...normalizedRoute,
          component: existingRoute.component,
        })
        normalizedRoute = existingRoute
      } else if (!config.disableDuplicateRoutesWarning) {
        // Otherwise, we shouldn't have duplicate routes
        console.warn(
          'More than one route in static.config.js is defined for path:',
          normalizedRoute.path
        )
      }
    }

    // Keep track of the route existence
    existingRoutes[normalizedRoute.path] = normalizedRoute

    // Keep track of index and 404 routes existence
    if (normalizedRoute.path === '/') {
      hasIndex = true
    }
    if (normalizedRoute.path === '404') {
      has404 = true
    }

    if (isPageExtension) {
      return false
    }

    return normalizedRoute
  }

  let normalizedRoutes = routes
    .map(route => recurseRoute(route))
    .filter(Boolean)

  if (!config.tree) {
    const flatRoutes = []
    const recurseRoute = route => {
      if (
        !opts.incremental ||
        (opts.incremental && (route.remove || route.fromConfig))
      ) {
        flatRoutes.push(route)
      }
      if (route.children) {
        route.children.forEach(recurseRoute)
      }
      route.children = undefined
    }
    normalizedRoutes.forEach(recurseRoute)
    normalizedRoutes = flatRoutes
  }

  return {
    routes: normalizedRoutes,
    hasIndex,
    has404,
  }
}
