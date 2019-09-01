import path from 'path'

export default {
  siteRoot: '/',
  basePath: '',
  assetsPath: '',
  prefetchRate: 5,
  inlineCss: false,
  outputFileRate: 100,
  extractCssChunks: false,
  entry: 'index.js',
  paths: {
    ROOT: path.resolve('./root/'),
    TEMP: path.resolve('./root/tmp'),
    SRC: path.resolve('./root/src'),
    DIST: path.resolve('./root/dist'),
    ASSETS: path.resolve('./root/dist'),
    PUBLIC: path.resolve('./root/public'),
    PACKAGE: path.resolve('./root/package.json'),
    NODE_MODULES: path.resolve('./root/node_modules'),
    STATIC_DATA: path.resolve('./root/dist/staticData'),
  },
  terser: {
    terserOptions: {},
  },
}
