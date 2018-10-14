'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var config = _ref.config,
      stage = _ref.stage,
      isNode = _ref.isNode;

  var cssLoader = [{
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      minimize: stage === 'prod',
      sourceMap: false
    }
  }, {
    loader: 'postcss-loader',
    options: {
      // Necessary for external CSS imports to work
      // https://github.com/facebookincubator/create-react-app/issues/2677
      sourceMap: true,
      ident: 'postcss',
      plugins: function plugins() {
        return [_postcssFlexbugsFixes2.default, (0, _autoprefixer2.default)({
          browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9'],
          flexbox: 'no-2009'
        })];
      }
    }
  }];

  if (stage === 'dev') {
    cssLoader = ['style-loader'].concat(cssLoader);
  } else if (!isNode) {
    cssLoader = (config.extractCssChunks ? _extractCssChunksWebpackPlugin2.default : _extractTextWebpackPlugin2.default).extract({
      fallback: {
        loader: 'style-loader',
        options: {
          sourceMap: false,
          hmr: false
        }
      },
      use: cssLoader
    });
  }

  return {
    test: /\.css$/,
    loader: cssLoader
  };
};

var _autoprefixer = require('autoprefixer');

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _extractCssChunksWebpackPlugin = require('extract-css-chunks-webpack-plugin');

var _extractCssChunksWebpackPlugin2 = _interopRequireDefault(_extractCssChunksWebpackPlugin);

var _postcssFlexbugsFixes = require('postcss-flexbugs-fixes');

var _postcssFlexbugsFixes2 = _interopRequireDefault(_postcssFlexbugsFixes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }