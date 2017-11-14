'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _default = function _default() {
  return {
    loader: 'url-loader',
    test: /\.(png|woff|woff2|eot|ttf|svg)$/,
    query: {
      limit: 10000,
      name: 'static/[name].[hash:8].[ext]'
    }
  };
};

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(_default, 'default', 'src/webpack/rules/fontsLoader.js');
}();

;