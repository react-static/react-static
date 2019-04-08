export default {
  siteRoot: '',
  basePath: '',
  prefetchRate: 5,
  inlineCss: false,
  outputFileRate: 100,
  extractCssChunks: false,
  entry: 'index.js',
  paths: {
    ROOT: './root/',
    SRC: './root/src',
    PUBLIC: './root/public',
    PACKAGE: './root/package.json',
    DIST: './root/tmp/dev-server',
    ASSETS: './root/tmp/dev-server',
    STATIC_DATA: './root/tmp/dev-server/staticData',
    NODE_MODULES: './root/node_modules',
  },
  terser: {
    terserOptions: {},
  },
}
