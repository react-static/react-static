import buildXML from './buildXML'

export default (options = {}) => ({
  // Allow subroutes to inherit sitemap.noindex
  normalizeRoute: route => {
    const sitemap = route.sitemap || {}
    const parentSitemap = route.parent.sitemap || {}
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
      console.log(
        "Warning: react-static-plugin-sitemap - No 'siteRoot' is defined in 'static.config.js'. This is required to generate a sitemap.xml."
      )
      return
    }
    return buildXML(state, options)
  },
})
