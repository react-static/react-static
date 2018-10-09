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
    } = normalizeAllRoutes(allRoutes, config)
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
    return subscription(allNormalizedRoutes)
  })
}
