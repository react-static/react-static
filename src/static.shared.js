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

export function throttle (func, wait, options) {
  let context
  let args
  let result
  let timeout = null
  let previous = 0
  if (!options) options = {}
  const later = () => {
    previous = options.leading === false ? 0 : Date.now()
    timeout = null
    result = func.apply(context, args)
    if (!timeout) {
      args = null
      context = args
    }
  }
  return (...args) => {
    const now = Date.now()
    if (!previous && options.leading === false) previous = now
    const remaining = wait - (now - previous)
    context = this
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      result = func.apply(context, args)
      if (!timeout) {
        args = null
        context = args
      }
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining)
    }
    return result
  }
}
