'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
//


var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _htmlWebpackPlugin = require('html-webpack-plugin');

var _htmlWebpackPlugin2 = _interopRequireDefault(_htmlWebpackPlugin);

var _scriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

var _scriptExtHtmlWebpackPlugin2 = _interopRequireDefault(_scriptExtHtmlWebpackPlugin);

var _caseSensitivePathsWebpackPlugin = require('case-sensitive-paths-webpack-plugin');

var _caseSensitivePathsWebpackPlugin2 = _interopRequireDefault(_caseSensitivePathsWebpackPlugin);

var _webpackBundleAnalyzer = require('webpack-bundle-analyzer');

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _webpackNodeExternals = require('webpack-node-externals');

var _webpackNodeExternals2 = _interopRequireDefault(_webpackNodeExternals);

var _rules = require('./rules');

var _rules2 = _interopRequireDefault(_rules);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(_ref) {
  var config = _ref.config,
      isNode = _ref.isNode;
  var _config$paths = config.paths,
      ROOT = _config$paths.ROOT,
      DIST = _config$paths.DIST,
      NODE_MODULES = _config$paths.NODE_MODULES,
      SRC = _config$paths.SRC,
      HTML_TEMPLATE = _config$paths.HTML_TEMPLATE;

  return {
    context: _path2.default.resolve(__dirname, '../node_modules'),
    entry: _path2.default.resolve(ROOT, config.entry),
    output: {
      filename: isNode ? 'app.static.[hash:8].js' : 'app.[hash:8].js',
      path: DIST,
      publicPath: '/',
      libraryTarget: isNode ? 'umd' : undefined
    },
    target: isNode ? 'node' : undefined,
    externals: isNode ? [(0, _webpackNodeExternals2.default)()] : [],
    module: {
      rules: (0, _rules2.default)({ config: config, stage: 'prod' })
    },
    resolve: {
      modules: [_path2.default.resolve(__dirname, '../node_modules'), NODE_MODULES, SRC, DIST],
      extensions: ['.js', '.json', '.jsx']
    },
    plugins: [new _webpack2.default.EnvironmentPlugin(_extends({}, process.env, {
      NODE_ENV: 'production'
    })), new _extractTextWebpackPlugin2.default({
      filename: function filename(getPath) {
        process.env.extractedCSSpath = getPath('styles.[hash:8].css');
        return process.env.extractedCSSpath;
      },
      allChunks: true
    }), new _htmlWebpackPlugin2.default({
      inject: true,
      filename: HTML_TEMPLATE
      // We dont use a template here because we are only concerned with the
      // output files, given that the index.html will also be overwritten by
      // the static export in the end.
    }), new _scriptExtHtmlWebpackPlugin2.default({
      defaultAttribute: 'async'
    }), new _caseSensitivePathsWebpackPlugin2.default(), !isNode ? new _webpack2.default.optimize.UglifyJsPlugin() : null, config.bundleAnalyzer ? new _webpackBundleAnalyzer.BundleAnalyzerPlugin() : null].filter(function (d) {
      return d;
    }),

    devtool: 'source-map'
  };
};

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(_default, 'default', 'src/webpack/webpack.config.prod.js');
}();

;