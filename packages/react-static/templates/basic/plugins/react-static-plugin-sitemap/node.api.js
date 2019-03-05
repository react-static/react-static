import buildXML from './buildXML'

export default () => ({
  afterExport: ({ config }) => {
    if (!config.siteRoot) {
      throw new Error(
        "=> Error:react-static-plugin-sitemap - No 'siteRoot' is defined in 'static.config.js'. This is required to generate a sitemap.xml."
      )
    }
    return buildXML(config)
  },
})
