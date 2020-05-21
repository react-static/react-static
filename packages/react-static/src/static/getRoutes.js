import path from 'path'
import chalk from 'chalk'
//
import {
  pathJoin,
  getRoutePath,
  time,
  timeEnd,
  PATH_404,
  is404Path,
} from '../utils'
import plugins from './plugins'

export const rebuildRoutes = () => {
  rebuildRoutes.current()
}

rebuildRoutes.current = () => {
  throw new Error('Routes cannot be rebuilt yet!')
}

export default async function getRoutes(state, callback = d => d) {
  rebuildRoutes.current = async () => {
    const { silent, incremental } = state

    if (!silent) console.log('Building Routes...')
    if (!silent) time(chalk.green('[\u2713] Routes Built'))

    state = await plugins.beforePrepareRoutes(state)

    const pluginRoutes = await plugins.getRoutes([], state)
    const userRoutes = await state.config.getRoutes(state)

    const routes = [...pluginRoutes, ...userRoutes]

    // Flatten and normalize all of the routes
    const {
      routes: allNormalizedRoutes,
      hasIndex,
      has404,
    } = normalizeAllRoutes(routes, state)

    // If no Index page was found, throw an error. This is required
    if (!hasIndex && !incremental) {
      console.error('No index found!')
      throw new Error(
        'Could not find a route for the "index" page of your site! This is ' +
          'required. Please create a page or specify a route and template ' +
          'for this page.'
      )
    }

    console.log({ has404 })

    // If no 404 page was found, add one. This is required.
    if (!has404 && !incremental) {
      console.warn('Creating default 404 because none was found...')

      allNormalizedRoutes.unshift({
        path: PATH_404,
        template: path.resolve(
          __dirname,
          path.join('..', 'browser', 'components', 'Default404')
        ),
      })
    }

    if (!silent) timeEnd(chalk.green('[\u2713] Routes Built'))

    state = {
      ...state,
      routes: allNormalizedRoutes,
    }

    return callback(await plugins.afterPrepareRoutes(state))
  }

  return rebuildRoutes.current()
}

// We recursively loop through the routes and their children and
// return an array of normalised routes.
// Original routes array [{ path: 'path', children: { path: 'to' } }]
// These can be returned as flat routes eg. [{ path: 'path' }, { path: 'path/to' }]
// Or they can be returned nested routes eg. [{ path: 'path', children: { path: 'path/to' } }]
export function normalizeAllRoutes(routes, state) {
  const routesByPath = {}
  let hasIndex
  let has404

  // This hook is set up beore the loop, since it could have expensive
  // overhead diving into plugins every time
  const pluginNormalizeRoute = plugins.normalizeRoute(state)

  const recurseRoute = (route, parent) => {
    // Normalize the route
    let normalizedRoute = normalizeRoute(route, parent, pluginNormalizeRoute)

    // we check an array of paths to see
    // if route path already existings
    const existingRoute = routesByPath[normalizedRoute.path]

    // If the route has children, we do a depth-first recurse
    if (normalizedRoute.children) {
      normalizedRoute.children.forEach(childRoute =>
        recurseRoute(childRoute, normalizedRoute)
      )
    }

    // If the route exists
    if (existingRoute) {
      // If it is meant to replace any routes before it
      if (!normalizedRoute.replace) {
        // If not replacing, we need to merge the two
        // routes together
        Object.assign(existingRoute, normalizedRoute)
        // Then make sure we're pointing to the exising route
        normalizedRoute = existingRoute
      }
    }

    delete normalizedRoute.children

    // Register the route by path
    routesByPath[normalizedRoute.path] = normalizedRoute

    // Keep track of index and 404 routes existence
    if (normalizedRoute.path === '/') {
      hasIndex = true
    }

    if (is404Path(normalizedRoute.path)) {
      has404 = true
    }

    if (normalizedRoute.path.indexOf('\\') !== -1) {
      throw new Error(
        'Plugins must return a normalized path for the `path` key of a route,' +
          ' which is a path with / and not \\.'
      )
    }
  }

  routes.forEach(route => recurseRoute(route))

  const normalizedRoutes = Object.values(routesByPath)

  return {
    routes: normalizedRoutes,
    hasIndex,
    has404,
  }
}

export function normalizeRoute(route, parent = {}, pluginNormalizeRoute) {
  const { path: parentPath = '/' } = parent

  if (!route.path) {
    throw new Error(`No path defined for route: ${JSON.stringify(route)}`)
  }

  const routePath = pathJoin(parentPath, route.path)

  if (typeof route.noIndex !== 'undefined') {
    console.warn(
      `Warning: Route ${route.path} is using 'noIndex'. Did you mean 'noindex'?`
    )
  }

  route.path = getRoutePath(routePath)

  route.parent = parent
  route = pluginNormalizeRoute(route)
  delete route.parent

  return route
}
