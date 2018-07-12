export default {
  basePath: '',
  devBasePath: '',
  entry: './root/src/index.js',
  extractCssChunks: false,
  inlineCss: false,
  outputFileRate: 100,
  paths: {
    DIST: './root/dist',
    HTML_TEMPLATE: './root/dist/index.html',
    LOCAL_NODE_MODULES: './dirname/../../node_modules',
    NODE_MODULES: './root/node_modules',
    PACKAGE: './root/package.json',
    PUBLIC: './root/public',
    ROOT: './root/',
    SRC: './root/src',
    STATIC_DATA: './root/dist/staticData',
  },
  prefetchRate: 3,
  siteRoot: '',
  stagingBasePath: '',
  stagingSiteRoot: '',
}
