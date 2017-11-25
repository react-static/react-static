'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _default = function _default(_ref) {
  var config = _ref.config;

  return {
    test: /\.(js|jsx)$/,
    exclude: config.paths.NODE_MODULES,
    use: [{
      loader: 'babel-loader'
    }]
  };
};

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(_default, 'default', 'src/webpack/rules/jsLoader.js');
}();

;