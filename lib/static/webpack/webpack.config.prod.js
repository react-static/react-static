'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _caseSensitivePathsWebpackPlugin = require('case-sensitive-paths-webpack-plugin');

var _caseSensitivePathsWebpackPlugin2 = _interopRequireDefault(_caseSensitivePathsWebpackPlugin);

var _webpackBundleAnalyzer = require('webpack-bundle-analyzer');

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _extractCssChunksWebpackPlugin = require('extract-css-chunks-webpack-plugin');

var _extractCssChunksWebpackPlugin2 = _interopRequireDefault(_extractCssChunksWebpackPlugin);

var _webpackNodeExternals = require('webpack-node-externals');

var _webpackNodeExternals2 = _interopRequireDefault(_webpackNodeExternals);

var _rules = require('./rules');

var _rules2 = _interopRequireDefault(_rules);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();
// import SWPrecacheWebpackPlugin from 'sw-precache-webpack-plugin'
// import WebpackPwaManifest from 'webpack-pwa-manifest'
//


var _default = function _default(_ref) {
  var config = _ref.config,
      isNode = _ref.isNode;
  var _config$paths = config.paths,
      ROOT = _config$paths.ROOT,
      DIST = _config$paths.DIST,
      NODE_MODULES = _config$paths.NODE_MODULES,
      SRC = _config$paths.SRC;


  config.publicPath = process.env.REACT_STATIC_STAGING ? config.stagingSiteRoot + '/' + (config.stagingBasePath ? config.stagingBasePath + '/' : '') : config.siteRoot + '/' + (config.basePath ? config.basePath + '/' : '');

  process.env.REACT_STATIC_PUBLIC_PATH = config.publicPath;
  process.env.REACT_STATIC_BASEPATH = process.env.REACT_STATIC_STAGING ? config.stagingBasePath : config.basePath;

  return {
    context: _path2.default.resolve(__dirname, '../../../node_modules'),
    entry: _path2.default.resolve(ROOT, config.entry),
    output: {
      filename: isNode ? 'static.[chunkHash:8].js' : '[name].[chunkHash:8].js',
      chunkFilename: 'templates/[name].[chunkHash:8].js',
      path: DIST,
      publicPath: config.publicPath || '/',
      libraryTarget: isNode ? 'umd' : undefined
    },
    target: isNode ? 'node' : undefined,
    externals: isNode ? [(0, _webpackNodeExternals2.default)({
      whitelist: ['react-universal-component', 'webpack-flush-chunks', 'react-static-routes']
    })] : [],
    module: {
      rules: (0, _rules2.default)({ config: config, stage: 'prod' })
    },
    resolve: {
      alias: config.preact ? {
        react: 'preact-compat',
        'react-dom': 'preact-compat'
      } : {},
      modules: [_path2.default.resolve(__dirname, '../../../node_modules'), 'node_modules', NODE_MODULES, SRC, DIST],
      extensions: ['.js', '.json', '.jsx']
    },
    plugins: [new _webpack2.default.EnvironmentPlugin(process.env), config.extractCssChunks ? new _extractCssChunksWebpackPlugin2.default() : new _extractTextWebpackPlugin2.default({
      filename: function filename(getPath) {
        process.env.extractedCSSpath = getPath('styles.[hash:8].css');
        return process.env.extractedCSSpath;
      },
      allChunks: true
    }), new _caseSensitivePathsWebpackPlugin2.default(), !isNode && new _webpack2.default.optimize.CommonsChunkPlugin({
      name: 'bootstrap', // Named bootstrap to support the webpack-flush-chunks plugin
      minChunks: Infinity
    }), isNode && new _webpack2.default.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }), !isNode && !process.env.REACT_STATIC_DEBUG && new _webpack2.default.optimize.UglifyJsPlugin(),
    // !isNode &&
    //   new SWPrecacheWebpackPlugin({
    //     cacheId: config.siteName || 'my-site-name',
    //     dontCacheBustUrlsMatching: /\.\w{8}\./,
    //     filename: 'service-worker.js',
    //     minify: true,
    //     navigateFallback: '/index.html',
    //     staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
    //   }),
    // !isNode &&
    //   new WebpackPwaManifest({
    //     name: config.pwa.name || 'My React Static App',
    //     short_name: config.pwa.shortName || 'My React Static App',
    //     description: config.pwa.description || 'An app I built with React Static!',
    //     background_color: config.pwa.backgroundColor || '#01579b',
    //     theme_color: config.pwa.themeColor || '#01579b',
    //     'theme-color': config.pwa.themeColor || '#01579b',
    //     start_url: config.pwa.startUrl || '/',
    //     icons: [],
    //     icons: [
    //       {
    //         src: path.resolve('src/images/icon.png'),
    //         sizes: [96, 128, 192, 256, 384, 512],
    //         destination: path.join('assets', 'icons'),
    //       },
    //     ],
    //   }),
    config.bundleAnalyzer && !isNode && new _webpackBundleAnalyzer.BundleAnalyzerPlugin()].filter(function (d) {
      return d;
    }),

    devtool: 'source-map'
  };
};

exports.default = _default;
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(_default, 'default', 'src/static/webpack/webpack.config.prod.js');
  leaveModule(module);
})();

;