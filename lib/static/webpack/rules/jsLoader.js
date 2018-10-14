'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var config = _ref.config,
      stage = _ref.stage;

  return {
    test: /\.(js|jsx)$/,
    exclude: config.paths.EXCLUDE_MODULES,
    use: [{
      loader: 'babel-loader',
      options: {
        cacheDirectory: stage !== 'prod'
      }
    }]
  };
};