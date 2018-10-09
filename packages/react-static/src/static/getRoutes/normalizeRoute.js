import { pathJoin } from '../../utils'

export default function normalizeRoute(route, parent = {}) {
  const { path: parentPath = '/' } = parent

  if (!route.path) {
    if (route.is404) {
      throw new Error(
        `route.is404 has been deprecated. Use \`path: '404'\` instead! Route: ${JSON.stringify(
          route
        )}`
      )
    }
    throw new Error(`No path defined for route: ${JSON.stringify(route)}`)
  }

  const originalRoutePath = pathJoin(route.path)
  const routePath = pathJoin(parentPath, route.path)

  if (typeof route.noIndex !== 'undefined') {
    console.warn(
      `=> Warning: Route ${
        route.path
      } is using 'noIndex'. Did you mean 'noindex'?`
    )
  }

  const normalizedRoute = {
    ...route,
    path: routePath,
    originalPath: originalRoutePath,
    noindex:
      typeof route.noindex !== 'undefined' ? route.noindex : parent.noindex,
    hasGetProps: !!route.getData,
  }

  return normalizedRoute
}
