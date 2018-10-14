'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeBodyWithMeta = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var REGEX_FOR_SCRIPT = /<(\/)?(script)/gi;

var generateRouteInformation = function generateRouteInformation(embeddedRouteInfo) {
  return {
    __html: '\n    window.__routeInfo = ' + JSON.stringify(embeddedRouteInfo).replace(REGEX_FOR_SCRIPT, '<"+"$1$2') + ';'
  };
};

// Not only do we pass react-helmet attributes and the app.js here, but
// we also need to  hard code site props and route props into the page to
// prevent flashing when react mounts onto the HTML.
var makeBodyWithMeta = function makeBodyWithMeta(_ref) {
  var head = _ref.head,
      route = _ref.route,
      embeddedRouteInfo = _ref.embeddedRouteInfo,
      _ref$clientScripts = _ref.clientScripts,
      clientScripts = _ref$clientScripts === undefined ? [] : _ref$clientScripts,
      ClientCssHash = _ref.ClientCssHash,
      config = _ref.config;
  return function (_ref2) {
    var children = _ref2.children,
        rest = _objectWithoutProperties(_ref2, ['children']);

    return _react2.default.createElement(
      'body',
      _extends({}, head.bodyProps, rest),
      children,
      _react2.default.createElement(ClientCssHash, null),
      !route.redirect && _react2.default.createElement('script', {
        type: 'text/javascript',
        dangerouslySetInnerHTML: generateRouteInformation(embeddedRouteInfo)
      }),
      !route.redirect && clientScripts.map(function (script) {
        return _react2.default.createElement('script', { key: script, defer: true, type: 'text/javascript', src: '' + config.publicPath + script });
      })
    );
  };
};
exports.makeBodyWithMeta = makeBodyWithMeta;