import path from 'path'

export default {
  siteRoot: '',
  basePath: '',
  prefetchRate: 5,
  inlineCss: false,
  outputFileRate: 100,
  extractCssChunks: false,
  entry: 'index.js',
  paths: {
    ROOT: path.resolve('./root/'),
    SRC: path.resolve('./root/src'),
    PUBLIC: path.resolve('./root/public'),
    PACKAGE: path.resolve('./root/package.json'),
    DIST: path.resolve('./root/tmp/dev-server'),
    ASSETS: path.resolve('./root/tmp/dev-server'),
    STATIC_DATA: path.resolve('./root/tmp/dev-server/staticData'),
    NODE_MODULES: path.resolve('./root/node_modules'),
  },
  terser: {
    terserOptions: {},
  },
}
