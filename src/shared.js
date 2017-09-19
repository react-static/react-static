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
      query: {},
    }

    flatRoutes.push(normalizedRoute)

    if (route.queries) {
      route.queries.forEach(query => {
        flatRoutes.push({
          ...normalizedRoute,
          path: `${normalizedRoute.path}?${query.param}${query.value && `=${query.value}`}`,
          query: {
            [query.param]: query.value || true,
          },
        })
      })
    }

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
