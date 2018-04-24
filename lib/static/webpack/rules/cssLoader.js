'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _autoprefixer = require('autoprefixer');

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _extractCssChunksWebpackPlugin = require('extract-css-chunks-webpack-plugin');

var _extractCssChunksWebpackPlugin2 = _interopRequireDefault(_extractCssChunksWebpackPlugin);

var _postcssFlexbugsFixes = require('postcss-flexbugs-fixes');

var _postcssFlexbugsFixes2 = _interopRequireDefault(_postcssFlexbugsFixes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

var _default = function _default(_ref) {
  var config = _ref.config,
      stage = _ref.stage;

  if (stage === 'dev') {
    return {
      test: /\.css$/,
      use: ['style-loader', {
        loader: 'css-loader',
        options: {
          sourceMap: true,
          importLoaders: 1
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
      }]
    };
  }
  return {
    test: /\.css$/,
    loader: (config.extractCssChunks ? _extractCssChunksWebpackPlugin2.default : _extractTextWebpackPlugin2.default).extract({
      fallback: {
        loader: 'style-loader',
        options: {
          sourceMap: false,
          hmr: false
        }
      },
      use: [{
        loader: 'css-loader',
        options: {
          importLoaders: 1,
          minimize: true,
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
      }]
    })
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

  reactHotLoader.register(_default, 'default', 'src/static/webpack/rules/cssLoader.js');
  leaveModule(module);
})();

;