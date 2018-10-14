"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeHeadWithMeta = exports.InlineStyle = undefined;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var REGEX_FOR_STYLE_TAG = /<style>|<\/style>/gi;

var InlineStyle = exports.InlineStyle = function InlineStyle(_ref) {
  var clientCss = _ref.clientCss;
  return _react2.default.createElement("style", {
    key: "clientCss",
    type: "text/css",
    dangerouslySetInnerHTML: {
      __html: clientCss.toString().replace(REGEX_FOR_STYLE_TAG, '')
    }
  });
};

var makeHeadWithMeta = function makeHeadWithMeta(_ref2) {
  var head = _ref2.head,
      route = _ref2.route,
      clientScripts = _ref2.clientScripts,
      config = _ref2.config,
      clientStyleSheets = _ref2.clientStyleSheets,
      clientCss = _ref2.clientCss;
  return function (_ref3) {
    var children = _ref3.children,
        rest = _objectWithoutProperties(_ref3, ["children"]);

    var renderLinkCSS = !route.redirect && !config.inlineCss;
    var useHelmetTitle = head.title && head.title[0] && head.title[0].props.children !== '';
    var childrenArray = children;
    if (useHelmetTitle) {
      head.title[0] = _react2.default.cloneElement(head.title[0], { key: 'title' });
      childrenArray = _react2.default.Children.toArray(children).filter(function (child) {
        if (child.type === 'title') {
          // Filter out the title of the Document in static.config.js
          // if there is a helmet title on this route
          return false;
        }
        return true;
      });
    }

    return _react2.default.createElement(
      "head",
      rest,
      head.base,
      useHelmetTitle && head.title,
      head.meta,
      !route.redirect && clientScripts.map(function (script) {
        return _react2.default.createElement("link", {
          key: "clientScript_" + script,
          rel: "preload",
          as: "script",
          href: "" + config.publicPath + script
        });
      }),
      renderLinkCSS && clientStyleSheets.reduce(function (memo, styleSheet) {
        return [].concat(_toConsumableArray(memo), [_react2.default.createElement("link", {
          key: "clientStyleSheetPreload_" + styleSheet,
          rel: "preload",
          as: "style",
          href: "" + config.publicPath + styleSheet
        }), _react2.default.createElement("link", {
          key: "clientStyleSheet_" + styleSheet,
          rel: "stylesheet",
          href: "" + config.publicPath + styleSheet
        })]);
      }, []),
      head.link,
      head.noscript,
      head.script,
      config.inlineCss && _react2.default.createElement(InlineStyle, { clientCss: clientCss }),
      head.style,
      childrenArray
    );
  };
};
exports.makeHeadWithMeta = makeHeadWithMeta;