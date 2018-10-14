'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _reactHelmet = require('react-helmet');

var _reactHelmet2 = _interopRequireDefault(_reactHelmet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//

var Redirect = function (_React$Component) {
  _inherits(Redirect, _React$Component);

  function Redirect() {
    _classCallCheck(this, Redirect);

    return _possibleConstructorReturn(this, (Redirect.__proto__ || Object.getPrototypeOf(Redirect)).apply(this, arguments));
  }

  _createClass(Redirect, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          to = _props.to,
          _props$delay = _props.delay,
          delay = _props$delay === undefined ? 0 : _props$delay,
          fromPath = _props.fromPath,
          rest = _objectWithoutProperties(_props, ['to', 'delay', 'fromPath']);

      if (typeof document === 'undefined') {
        var resolvedTo = (typeof to === 'undefined' ? 'undefined' : _typeof(to)) === 'object' ? to.pathname : to;
        if (!resolvedTo.includes('//')) {
          resolvedTo = '' + process.env.REACT_STATIC_PUBLIC_PATH + (resolvedTo === '/' ? '' : resolvedTo);
        }
        return (
          // ReactRouterRedirect
          _react2.default.createElement(
            _reactHelmet2.default,
            null,
            fromPath && _react2.default.createElement(
              'title',
              null,
              '' + process.env.REACT_STATIC_PUBLIC_PATH + (fromPath === '/' ? '' : fromPath)
            ),
            _react2.default.createElement('link', { rel: 'canonical', href: resolvedTo }),
            _react2.default.createElement('meta', { name: 'robots', content: 'noindex' }),
            _react2.default.createElement('meta', { httpEquiv: 'content-type', content: 'text/html; charset=utf-8' }),
            _react2.default.createElement('meta', { httpEquiv: 'refresh', content: delay + '; url=' + resolvedTo })
          )
        );
      }
      return _react2.default.createElement(_reactRouterDom.Redirect, _extends({ to: to }, rest));
    }
  }]);

  return Redirect;
}(_react2.default.Component);

exports.default = Redirect;