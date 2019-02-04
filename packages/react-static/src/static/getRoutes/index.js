import path from 'path'
import { makeHookReducer } from '../../utils'

import getRoutesFromPages from './getRoutesFromPages'
import normalizeAllRoutes from './normalizeAllRoutes'

export default function getRoutes({ config, opts }, subscription = d => d) {
  // We use the callback pattern here, because getRoutesFromPages supports a subscription
  return getRoutesFromPages({ config, opts }, async pageRoutes => {
    let routes = await config.getRoutes(opts)

    const afterGetRoutes = makeHookReducer(config.plugins, 'afterGetRoutes')
    routes = await afterGetRoutes(routes, { config })

    const allRoutes = [...pageRoutes, ...routes]
    const {
      routes: allNormalizedRoutes,
      hasIndex,
      has404,
    } = normalizeAllRoutes(allRoutes, config, opts)
    // If no Index page was found, throw an error. This is required
    if (!hasIndex && !opts.incremental) {
      throw new Error(
        'Could not find a route for the "index" page of your site! This is required. Please create a page or specify a route and template for this page.'
      )
    }
    // If no 404 page was found, add one. This is required.
    if (!has404 && !opts.incremental) {
      allNormalizedRoutes.unshift({
        path: '404',
        component: path.relative(
          config.paths.ROOT,
          path.resolve(__dirname, '../../browser/components/Default404')
        ),
      })
    }
    return subscription(allNormalizedRoutes)
  })
}
