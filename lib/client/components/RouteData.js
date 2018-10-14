'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp2;

exports.withRouteData = withRouteData;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRouterDom = require('react-router-dom');

var _methods = require('../methods');

var _shared = require('../../utils/shared');

var _DevSpinner = require('./DevSpinner');

var _DevSpinner2 = _interopRequireDefault(_DevSpinner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var warnedPaths = {};
var instances = [];

global.reloadAll = function () {
  instances.forEach(function (instance) {
    return instance.reloadRouteData();
  });
};

var RouteData = (0, _reactRouterDom.withRouter)((_temp2 = _class = function (_React$Component) {
  _inherits(RouteData, _React$Component);

  function RouteData() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, RouteData);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = RouteData.__proto__ || Object.getPrototypeOf(RouteData)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      loaded: false
    }, _this.reloadRouteData = function () {
      return _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _this.loadRouteData();

              case 2:
                _this.forceUpdate();

              case 3:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this2);
      }))();
    }, _this.loadRouteData = function () {
      return _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        var _this$props, is404, pathname, path;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _this$props = _this.props, is404 = _this$props.is404, pathname = _this$props.location.pathname;
                path = (0, _shared.cleanPath)(is404 ? '404' : pathname);
                _context2.prev = 2;
                _context2.next = 5;
                return (0, _methods.prefetch)(path);

              case 5:
                return _context2.abrupt('return', new Promise(function (resolve) {
                  _this.setState({ loaded: true }, resolve);
                }));

              case 8:
                _context2.prev = 8;
                _context2.t0 = _context2['catch'](2);
                return _context2.abrupt('return', new Promise(function (resolve) {
                  _this.setState({ loaded: true }, resolve);
                }));

              case 11:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, _this2, [[2, 8]]);
      }))();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(RouteData, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      if (process.env.REACT_STATIC_ENV === 'development') {
        this.loadRouteData();
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      instances.push(this);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (process.env.REACT_STATIC_ENV === 'development') {
        if (this.props.location.pathname !== nextProps.location.pathname) {
          this.setState({ loaded: false }, this.loadRouteData);
        }
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var _this3 = this;

      instances = instances.filter(function (d) {
        return d !== _this3;
      });
      this.unmounting = true;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          component = _props.component,
          render = _props.render,
          children = _props.children,
          pathname = _props.location.pathname,
          rest = _objectWithoutProperties(_props, ['component', 'render', 'children', 'location']);

      var loaded = this.state.loaded;


      var path = (0, _shared.cleanPath)(rest.is404 ? '404' : pathname);

      var allProps = void 0;

      // Attempt to get routeInfo from window (first-load on client)
      if (typeof window !== 'undefined' && window.__routeInfo && (window.__routeInfo.path === path || window.__routeInfo.path === '404')) {
        loaded = true; // Since these are synchronous, override loading to true
        allProps = window.__routeInfo.allProps;
      }

      // Attempt to get routeInfo from context (SSR)
      if (!allProps && this.context.routeInfo && this.context.routeInfo.allProps) {
        loaded = true; // Override loaded to true
        allProps = this.context.routeInfo && this.context.routeInfo.allProps;
      } else if (_methods.routeInfoByPath[path]) {
        // Otherwise, get it from the routeInfoByPath (subsequent client side)
        loaded = true; // Override loaded to true
        allProps = _methods.routeInfoByPath[path].allProps;
      }

      if (!allProps && !rest.is404 && !warnedPaths[path]) {
        warnedPaths[path] = true;
        console.warn('RouteData or withRouteData couldn\'t find any props for path: ' + path + '. You are either missing a route.getData function or you are relying on RouteData/withRouteData where you don\'t need to.');
      }

      if (!loaded) {
        if (process.env.REACT_STATIC_ENV === 'development') {
          return _react2.default.createElement(_DevSpinner2.default, null);
        }
        return null;
      }

      var finalProps = _extends({}, rest, allProps);
      if (component) {
        return _react2.default.createElement(component, finalProps, children);
      }
      if (render) {
        return render(finalProps);
      }
      return children(finalProps);
    }
  }]);

  return RouteData;
}(_react2.default.Component), _class.contextTypes = {
  routeInfo: _propTypes2.default.object
}, _temp2));

exports.default = RouteData;
function withRouteData(Comp) {
  return function ConnectedRouteData(props) {
    return _react2.default.createElement(RouteData, _extends({ component: Comp }, props));
  };
}