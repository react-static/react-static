"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Body = exports.Head = exports.Html = exports.DefaultDocument = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DefaultDocument = exports.DefaultDocument = function (_Component) {
  _inherits(DefaultDocument, _Component);

  function DefaultDocument() {
    _classCallCheck(this, DefaultDocument);

    return _possibleConstructorReturn(this, (DefaultDocument.__proto__ || Object.getPrototypeOf(DefaultDocument)).apply(this, arguments));
  }

  _createClass(DefaultDocument, [{
    key: "render",
    value: function render() {
      var _props = this.props,
          Html = _props.Html,
          Head = _props.Head,
          Body = _props.Body,
          children = _props.children;

      return _react2.default.createElement(
        Html,
        { lang: "en-US" },
        _react2.default.createElement(
          Head,
          null,
          _react2.default.createElement("meta", { charSet: "UTF-8" }),
          _react2.default.createElement("meta", { name: "viewport", content: "width=device-width, initial-scale=1" })
        ),
        _react2.default.createElement(
          Body,
          null,
          children
        )
      );
    }
  }]);

  return DefaultDocument;
}(_react.Component);

var Html = function Html(_ref) {
  var children = _ref.children,
      rest = _objectWithoutProperties(_ref, ["children"]);

  return _react2.default.createElement(
    "html",
    _extends({ lang: "en" }, rest),
    children
  );
};
exports.Html = Html;
var Head = function Head(_ref2) {
  var children = _ref2.children,
      rest = _objectWithoutProperties(_ref2, ["children"]);

  return _react2.default.createElement(
    "head",
    rest,
    children
  );
};
exports.Head = Head;
var Body = function Body(_ref3) {
  var children = _ref3.children,
      rest = _objectWithoutProperties(_ref3, ["children"]);

  return _react2.default.createElement(
    "body",
    rest,
    children
  );
};
exports.Body = Body;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(DefaultDocument, "DefaultDocument", "src/RootComponents.js");

  __REACT_HOT_LOADER__.register(Html, "Html", "src/RootComponents.js");

  __REACT_HOT_LOADER__.register(Head, "Head", "src/RootComponents.js");

  __REACT_HOT_LOADER__.register(Body, "Body", "src/RootComponents.js");
}();

;