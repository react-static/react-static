export const pathJoin = (...paths) => `${paths.join('/')}/`.replace(/\/{2,}/g, '/')

// Normalize routes with parents, full paths, context, etc.
export const normalizeRoutes = routes => {
  const flatRoutes = []

  const recurse = (route, parent = { path: '/' }) => {
    const path = pathJoin(parent.path, route.path, '/')

    const normalizedRoute = {
      ...route,
      parent,
      path,
      noIndex: typeof route.noIndex === 'undefined' ? parent.noIndex : route.noIndex,
    }

    flatRoutes.push(normalizedRoute)

    if (route.children) {
      route.children.forEach(d => recurse(d, normalizedRoute))
    }
  }
  routes.forEach(d => recurse(d))
  flatRoutes.forEach(route => {
    const found = flatRoutes.find(d => d.path === route.path)
    if (found !== route) {
      console.warn('More than one route is defined for path:', route.path)
    }
  })
  return flatRoutes
}
