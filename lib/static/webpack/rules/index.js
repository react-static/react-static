'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStagedRules = undefined;

var _jsLoader = require('./jsLoader');

var _jsLoader2 = _interopRequireDefault(_jsLoader);

var _cssLoader = require('./cssLoader');

var _cssLoader2 = _interopRequireDefault(_cssLoader);

var _fileLoader = require('./fileLoader');

var _fileLoader2 = _interopRequireDefault(_fileLoader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getStagedRules = exports.getStagedRules = function getStagedRules(args) {
  return {
    jsLoader: (0, _jsLoader2.default)(args),
    cssLoader: (0, _cssLoader2.default)(args),
    fileLoader: (0, _fileLoader2.default)(args)
  };
};

exports.default = function (args) {
  return [{
    oneOf: [(0, _jsLoader2.default)(args), (0, _cssLoader2.default)(args), (0, _fileLoader2.default)(args)]
  }];
};