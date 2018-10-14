"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeHtmlWithMeta = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

// Instead of using the default components, we need to hard code meta
// from react-helmet into the components
var makeHtmlWithMeta = function makeHtmlWithMeta(_ref) {
  var head = _ref.head;
  return function (_ref2) {
    var children = _ref2.children,
        rest = _objectWithoutProperties(_ref2, ["children"]);

    return _react2.default.createElement(
      "html",
      _extends({ lang: "en" }, head.htmlProps, rest),
      children
    );
  };
};
exports.makeHtmlWithMeta = makeHtmlWithMeta;