import fetchSiteData from './fetchSiteData'
import fetchRoutes from './fetchRoutes'
import buildHTML from './buildHTML'

// Exporting route HTML and JSON happens here. It's a big one.
export default (async function exportRoutes({ config, clientStats }) {
  // we modify config in fetchSiteData
  const siteData = await fetchSiteData(config)
  // we modify config in fetchRoutes
  await fetchRoutes(config)

  await buildHTML({
    config,
    siteData,
    clientStats,
  })
})
