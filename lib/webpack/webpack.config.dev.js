'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _htmlWebpackPlugin = require('html-webpack-plugin');

var _htmlWebpackPlugin2 = _interopRequireDefault(_htmlWebpackPlugin);

var _scriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

var _scriptExtHtmlWebpackPlugin2 = _interopRequireDefault(_scriptExtHtmlWebpackPlugin);

var _caseSensitivePathsWebpackPlugin = require('case-sensitive-paths-webpack-plugin');

var _caseSensitivePathsWebpackPlugin2 = _interopRequireDefault(_caseSensitivePathsWebpackPlugin);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _rules = require('./rules');

var _rules2 = _interopRequireDefault(_rules);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(_ref) {
  var config = _ref.config;
  var _config$paths = config.paths,
      ROOT = _config$paths.ROOT,
      DIST = _config$paths.DIST,
      NODE_MODULES = _config$paths.NODE_MODULES,
      SRC = _config$paths.SRC,
      HTML_TEMPLATE = _config$paths.HTML_TEMPLATE;

  return {
    context: _path2.default.resolve(__dirname, '../node_modules'),
    entry: [require.resolve('react-hot-loader/patch'), require.resolve('react-dev-utils/webpackHotDevClient'),
    // `${require.resolve('webpack-dev-server/client')}?/`,

    require.resolve('webpack/hot/only-dev-server'), _path2.default.resolve(ROOT, config.entry)],
    output: {
      filename: 'app.[hash:8].js',
      path: DIST,
      publicPath: '/'
    },
    module: {
      rules: (0, _rules2.default)({ config: config, stage: 'dev' })
    },
    resolve: {
      modules: [_path2.default.resolve(__dirname, '../node_modules'), NODE_MODULES, SRC, DIST],
      extensions: ['.js', '.json', '.jsx']
    },
    plugins: [new _webpack2.default.EnvironmentPlugin(_extends({}, process.env, {
      NODE_ENV: 'development'
    })), new _htmlWebpackPlugin2.default({
      inject: true,
      template: '!!raw-loader!' + HTML_TEMPLATE
    }), new _scriptExtHtmlWebpackPlugin2.default({
      defaultAttribute: 'async'
    }), new _webpack2.default.HotModuleReplacementPlugin(), new _webpack2.default.NoEmitOnErrorsPlugin(), new _webpack2.default.NamedModulesPlugin(), new _caseSensitivePathsWebpackPlugin2.default()],
    devtool: 'eval-source-map'
  };
};

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(_default, 'default', 'src/webpack/webpack.config.dev.js');
}();

;