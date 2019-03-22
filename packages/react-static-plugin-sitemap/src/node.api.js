import buildXML from './buildXML'

export default (options = {}) => ({
  // Allow subroutes to inherit sitemap.noindex
  normalizeRoute: ({ route, parent }) => {
    const sitemap = route.sitemap || {}
    const parentSitemap = parent.sitemap || {}
    const noindex =
      (typeof sitemap.noindex !== 'undefined'
        ? sitemap.noindex
        : parentSitemap.noindex) || false

    return {
      ...route,
      sitemap: {
        ...sitemap,
        noindex,
      },
    }
  },
  afterExport: state => {
    if (!state.config.siteRoot) {
      throw new Error(
        "=> Error:react-static-plugin-sitemap - No 'siteRoot' is defined in 'static.config.js'. This is required to generate a sitemap.xml."
      )
    }
    return buildXML(state, options)
  },
})
