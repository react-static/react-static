/* eslint-disable import/no-dynamic-require */

import nodePath from 'path'
import chokidar from 'chokidar'

import { glob, debounce } from '../utils'
import { pathJoin } from '../utils/shared'

let watcher
const REGEX_TO_CUT_TO_ROOT = /(\..+?)\/.*/g
const REGEX_TO_REMOVE_TRAILING_SLASH = /^\/{0,}/g
const REGEX_TO_REMOVE_LEADING_SLASH = /\/{0,}$/g

export const cutPathToRoot = (string = '') => string.replace(REGEX_TO_CUT_TO_ROOT, '$1')

export const trimLeadingAndTrailingSlashes = (string = '') =>
  string.replace(REGEX_TO_REMOVE_TRAILING_SLASH, '').replace(REGEX_TO_REMOVE_LEADING_SLASH, '')

const consoleWarningForRouteWithoutNoIndex = route =>
  route.noIndex &&
  console.warn(`=> Warning: Route ${route.path} is using 'noIndex'. Did you mean 'noindex'?`)

export const normalizeRoute = (route, parent = {}, config = {}) => {
  const { children, ...routeWithOutChildren } = route
  const { path: parentPath = '/' } = parent
  const { tree: keepRouteChildren = false } = config

  if (!route.path) {
    throw new Error(`No path defined for route: ${JSON.stringify(route)}`)
  }

  const originalRoutePath = pathJoin(route.path)
  const routePath = pathJoin(parentPath, route.path)

  consoleWarningForRouteWithoutNoIndex(route)

  const normalizedRoute = {
    ...(keepRouteChildren ? route : routeWithOutChildren),
    path: routePath,
    originalPath: originalRoutePath,
    noindex: route.noindex || parent.noindex || route.noIndex,
    hasGetProps: !!route.getData,
  }

  return normalizedRoute
}

// We recursively loop through the routes and their children and
// return an array of normalised routes.
// Original routes array [{ path: 'path', children: { path: 'to' } }]
// These can be returned as flat routes eg. [{ path: 'path' }, { path: 'path/to' }]
// Or they can be returned nested routes eg. [{ path: 'path', children: { path: 'path/to' } }]
export const recurseNormalizeRoute = (routes = [], config, parent, existingRoutes = {}) => {
  const { tree: createNestedTreeStructure = false } = config

  return routes.reduce(
    ({ routes: prevRoutes = [], hasIndex, has404 }, route) => {
      let normalizedRoute = normalizeRoute(route, parent, config)
      // if structure is nested (tree === true) normalizedRoute will
      // have children otherwise we fall back to the original route children
      const { children = route.children, path } = normalizedRoute

      // we check an array of paths to see
      // if route path already existings
      const existingRoute = existingRoutes[path]

      if (existingRoute) {
        if (existingRoute.isPage) {
          Object.assign(existingRoute, {
            ...normalizedRoute,
            component: existingRoute.component,
          })
        } else if (!config.disableDuplicateRoutesWarning) {
          console.warn('More than one route in static.config.js is defined for path:', route.path)
        }
      }

      const {
        routes: normalizedRouteChildren,
        hasIndex: childrenHasIndex,
        has404: childrenHas404,
      } = recurseNormalizeRoute(children, config, normalizedRoute, existingRoutes)

      if (createNestedTreeStructure) {
        normalizedRoute = { ...normalizedRoute, children: normalizedRouteChildren }
      }

      // we push paths into an array that
      // we use to check if a route existings
      existingRoutes[path] = normalizedRoute

      return {
        routes: [
          ...prevRoutes,
          // if route exists we don't include the route
          ...(existingRoute ? [] : [normalizedRoute]),
          // if structure is not nested (tree === false) we return an empty object
          // else we return an array of normalized children routes
          ...(createNestedTreeStructure ? [] : normalizedRouteChildren),
        ],
        hasIndex: hasIndex || normalizedRoute.path === '/' || childrenHasIndex,
        has404: has404 || normalizedRoute.path === '404' || childrenHas404,
      }
    },
    {
      routes: [],
      hasIndex: false,
      has404: false,
    }
  )
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

  const hasWatcher = !!watcher
  if (opts.dev && !hasWatcher) {
    watcher = chokidar
      .watch(config.paths.PAGES, {
        ignoreInitial: true,
      })
      .on(
        'all',
        debounce(async (type, file) => {
          const filename = file.split('/').reverse()[0]
          if (filename.startsWith('.')) {
            return
          }
          const pages = await glob(pagesGlob)
          const routes = handle(pages)
          cb(routes)
        }),
        50
      )
  }
  if (!hasWatcher) {
    const pages = await glob(pagesGlob)
    const routes = handle(pages)
    return cb(routes)
  }
}

// At least ensure the index page is defined for export
const getRoutes = async ({ config, opts }, cb = d => d) =>
  // We use the callback pattern here, because getRoutesFromPages is technically a subscription
  getRoutesFromPages({ config, opts }, async pageRoutes => {
    const routes = await config.getRoutes(opts)
    const { routes: allRoutes, hasIndex, has404 } = recurseNormalizeRoute(
      [...pageRoutes, ...routes],
      config
    )
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
    return cb(allRoutes)
  })

export default getRoutes
