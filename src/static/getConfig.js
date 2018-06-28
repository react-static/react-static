/* eslint-disable import/no-dynamic-require */

import React from 'react'
import nodePath from 'path'
import chokidar from 'chokidar'

import { glob } from '../utils'
import { pathJoin } from '../utils/shared'
import { reloadRoutes } from './webpack'
import getDirname from '../utils/getDirname'

const REGEX_TO_CUT_TO_ROOT = /(\..+?)\/.*/g
const REGEX_TO_REMOVE_TRAILING_SLASH = /^\/{0,}/g
const REGEX_TO_REMOVE_LEADING_SLASH = /\/{0,}$/g

const DEFAULT_NAME_FOR_STATIC_CONFIG_FILE = 'static.config.js'
// the default static.config.js location
const DEFAULT_PATH_FOR_STATIC_CONFIG = nodePath.resolve(
  nodePath.join(process.cwd(), DEFAULT_NAME_FOR_STATIC_CONFIG_FILE)
)
const DEFAULT_ROUTES = [{ path: '/' }]
const DEFAULT_ENTRY = 'index.js'

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

export const getRoutesFromPages = async config => {
  // Make a glob extension to get all pages with the set extensions from the pages directory
  const globExtensions = config.extensions.map(ext => `${ext.slice(1)}`).join(',')
  const pagesGlob = `${config.paths.PAGES}/**/*.{${globExtensions}}`
  // Get the pages
  const pages = await glob(pagesGlob)

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

// At least ensure the index page is defined for export
export const getRoutesForConfig = (
  config,
  originalGetRoutes = async () => DEFAULT_ROUTES
) => async opts => {
  const pageRoutes = await getRoutesFromPages(config)
  const routes = await originalGetRoutes(opts)
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
  return allRoutes
}

export const buildConfigation = (config = {}) => {
  // path defaults
  config.paths = {
    root: nodePath.resolve(process.cwd()),
    src: 'src',
    dist: 'dist',
    devDist: 'tmp/dev-server',
    public: 'public',
    pages: 'src/pages', // TODO: document
    nodeModules: 'node_modules',
    ...(config.paths || {}),
  }

  // Use the root to resolve all other relative paths
  const resolvePath = relativePath => nodePath.resolve(config.paths.root, relativePath)

  // Resolve all paths
  const distPath =
    process.env.REACT_STATIC_ENV === 'development'
      ? resolvePath(config.paths.devDist || config.paths.dist)
      : resolvePath(config.paths.dist)

  const paths = {
    ROOT: config.paths.root,
    LOCAL_NODE_MODULES: nodePath.resolve(getDirname(), '../../node_modules'),
    SRC: resolvePath(config.paths.src),
    PAGES: resolvePath(config.paths.pages),
    DIST: distPath,
    PUBLIC: resolvePath(config.paths.public),
    NODE_MODULES: resolvePath(config.paths.nodeModules),
    EXCLUDE_MODULES: config.paths.excludeResolvedModules || resolvePath(config.paths.nodeModules),
    PACKAGE: resolvePath('package.json'),
    HTML_TEMPLATE: nodePath.join(distPath, 'index.html'),
    STATIC_DATA: nodePath.join(distPath, 'staticData'),
  }

  // Defaults
  const finalConfig = {
    // Defaults
    entry: nodePath.join(paths.SRC, DEFAULT_ENTRY),
    getSiteData: () => ({}),
    renderToHtml: (render, Comp) => render(<Comp />),
    prefetchRate: 3,
    disableRouteInfoWarning: false,
    disableRoutePrefixing: false,
    outputFileRate: 10,
    extensions: ['.js', '.jsx'], // TODO: document
    // Config Overrides
    ...config,
    // Materialized Overrides
    paths,
    siteRoot: cutPathToRoot(config.siteRoot, '$1'),
    stagingSiteRoot: cutPathToRoot(config.stagingSiteRoot, '$1'),
    basePath: trimLeadingAndTrailingSlashes(config.basePath),
    stagingBasePath: trimLeadingAndTrailingSlashes(config.stagingBasePath),
    devBasePath: trimLeadingAndTrailingSlashes(config.devBasePath),
    extractCssChunks: config.extractCssChunks || false,
    inlineCss: config.inlineCss || false,
    generated: true,
  }

  // Send through the original getRoutes
  finalConfig.getRoutes = getRoutesForConfig(finalConfig, finalConfig.getRoutes)

  // Set env variables to be used client side
  process.env.REACT_STATIC_PREFETCH_RATE = finalConfig.prefetchRate
  process.env.REACT_STATIC_DISABLE_ROUTE_INFO_WARNING = finalConfig.disableRouteInfoWarning
  process.env.REACT_STATIC_DISABLE_ROUTE_PREFIXING = finalConfig.disableRoutePrefixing

  return finalConfig
}

const buildConfigFromPath = configPath => {
  const filename = nodePath.resolve(configPath)
  delete require.cache[filename]
  try {
    const config = require(configPath).default
    return buildConfigation(config)
  } catch (err) {
    console.error(err)
    return {}
  }
}

const fromFile = (configPath = DEFAULT_PATH_FOR_STATIC_CONFIG, watch) => {
  const config = buildConfigFromPath(configPath)

  if (watch) {
    chokidar.watch(configPath).on('all', () => {
      Object.assign(config, buildConfigFromPath(configPath))
      reloadRoutes()
    })
  }

  return config
}

// Retrieves the static.config.js from the current project directory
export default function getConfig (customConfig, { watch } = {}) {
  if (typeof customConfig === 'object') {
    // return a custom config obj
    return buildConfigation(customConfig)
  }

  // return a custom config file location
  // defaults to constant paath for static config
  return fromFile(customConfig, watch)
}
