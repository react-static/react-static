export default {
  siteRoot: '',
  basePath: '',
  assetsPath: '',
  prefetchRate: 5,
  inlineCss: false,
  outputFileRate: 100,
  extractCssChunks: false,
  entry: 'index.js',
  paths: {
    ROOT: './root/',
    TEMP: './root/tmp',
    SRC: './root/src',
    DIST: './root/dist',
    ASSETS: './root/dist',
    PUBLIC: './root/public',
    PACKAGE: './root/package.json',
    NODE_MODULES: './root/node_modules',
    STATIC_DATA: './root/dist/staticData',
  },
  terser: {
    terserOptions: {},
  },
}
