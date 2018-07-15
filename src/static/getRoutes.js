/* eslint-disable import/no-dynamic-require */

import nodePath from 'path'
import chokidar from 'chokidar'

import { glob, debounce } from '../utils'
import { pathJoin } from '../utils/shared'

let watcher
let routesCache

const countRoutes = (routes, count = 0) => {
  routes.forEach(route => {
    count += 1
    if (routes.children) {
      countRoutes(route.children, count)
    }
  })
  return count
}

export const normalizeRoute = (route, parent = {}) => {
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
    console.warn(`=> Warning: Route ${route.path} is using 'noIndex'. Did you mean 'noindex'?`)
  }

  const normalizedRoute = {
    ...route,
    path: routePath,
    originalPath: originalRoutePath,
    noindex: typeof route.noindex !== 'undefined' ? route.noindex : parent.noindex,
    hasGetProps: !!route.getData,
  }

  return normalizedRoute
}

// We recursively loop through the routes and their children and
// return an array of normalised routes.
// Original routes array [{ path: 'path', children: { path: 'to' } }]
// These can be returned as flat routes eg. [{ path: 'path' }, { path: 'path/to' }]
// Or they can be returned nested routes eg. [{ path: 'path', children: { path: 'path/to' } }]
export const normalizeAllRoutes = (routes = [], config) => {
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
      normalizedRoute.children = normalizedRoute.children.map(childRoute =>
        recurseRoute(childRoute, normalizedRoute)
      )
    }

    // If the route exists and is a page route, we need to decorate the
    // page route with this routes information
    if (existingRoute) {
      if (existingRoute.isPage) {
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

    return normalizedRoute
  }

  let normalizedRoutes = routes.map(route => recurseRoute(route))

  if (!config.tree) {
    const flatRoutes = []
    const recurseRoute = route => {
      flatRoutes.push(route)
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

export const getRoutesFromPages = async ({ config, opts = {} }, cb) => {
  // Make a glob extension to get all pages with the set extensions from the pages directory
  const globExtensions = config.extensions.map(ext => `${ext.slice(1)}`).join(',')
  const pagesGlob = `${config.paths.PAGES}/**/*.{${globExtensions}}`
  // Get the pages

  const handle = pages => {
    // Turn each page into a route
    const routes = pages.map(page => {
      // Get the component path relative to ROOT
      const component = nodePath.relative(config.paths.ROOT, page)
      // Make sure the path is relative to the root of the site
      let path = page.replace(`${config.paths.PAGES}`, '').replace(/\..*/, '')
      // Turn `/index` paths into roots`
      path = path.replace(/\/index$/, '/')
      // Return the route
      return {
        path,
        component,
        isPage: true, // tag it with isPage, so we know its origin
      }
    })
    return routes
  }

  if (opts.dev && !watcher) {
    watcher = chokidar
      .watch(config.paths.PAGES, {
        ignoreInitial: true,
      })
      .on(
        'all',
        debounce(async (type, file) => {
          if (!['add', 'unlink'].includes(type)) {
            return
          }
          const filename = file.split('/').reverse()[0]
          if (filename.startsWith('.')) {
            return
          }
          const pages = await glob(pagesGlob)
          const routes = handle(pages)
          routesCache = routes
          cb(routes)
        }),
        50
      )
  }
  if (routesCache) {
    return cb(routesCache)
  }
  const pages = await glob(pagesGlob)
  const routes = handle(pages)
  return cb(routes)
}

// At least ensure the index page is defined for export
const getRoutes = async ({ config, opts }, cb = d => d) =>
  // We use the callback pattern here, because getRoutesFromPages is technically a subscription
  getRoutesFromPages({ config, opts }, async pageRoutes => {
    const routes = await config.getRoutes(opts)
    const allRoutes = [...pageRoutes, ...routes]
    const { routes: allNormalizedRoutes, hasIndex, has404 } = normalizeAllRoutes(allRoutes, config)
    // If no Index page was found, throw an error. This is required
    if (!hasIndex) {
      throw new Error(
        'Could not find a route for the "index" page of your site! This is required. Please create a page or specify a route and template for this page.'
      )
    }
    // If no 404 page was found, throw an error. This is required
    if (!has404) {
      throw new Error(
        'Could not find a route for the "404" page of your site! This is required. Please create a page or specify a route and template for this page.'
      )
    }
    return cb(allNormalizedRoutes)
  })

export default getRoutes
