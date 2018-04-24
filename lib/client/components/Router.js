'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _createBrowserHistory = require('history/createBrowserHistory');

var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

var _createMemoryHistory = require('history/createMemoryHistory');

var _createMemoryHistory2 = _interopRequireDefault(_createMemoryHistory);

var _createHashHistory = require('history/createHashHistory');

var _createHashHistory2 = _interopRequireDefault(_createHashHistory);

var _reactRouterDom = require('react-router-dom');

var _shared = require('../../utils/shared');

var _methods = require('../methods');

var _RouterScroller = require('./RouterScroller');

var _RouterScroller2 = _interopRequireDefault(_RouterScroller);

var _DevSpinner = require('./DevSpinner');

var _DevSpinner2 = _interopRequireDefault(_DevSpinner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
//


var Router = function (_React$Component) {
  _inherits(Router, _React$Component);

  function Router(props, context) {
    _classCallCheck(this, Router);

    // In SRR and production, synchronously register the templateID for the
    // initial path
    var _this = _possibleConstructorReturn(this, (Router.__proto__ || Object.getPrototypeOf(Router)).call(this));

    _initialiseProps.call(_this);

    var routeInfo = context.routeInfo;

    var path = (0, _shared.cleanPath)(context.staticURL);

    if (typeof document !== 'undefined') {
      routeInfo = window.__routeInfo;
      var href = window.location.href;

      path = (0, _shared.cleanPath)(href);
    }

    if (routeInfo) {
      (0, _methods.registerTemplateIDForPath)(path, routeInfo.templateID);
    }
    return _this;
  }

  _createClass(Router, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.bootstrapRouteInfo();
    }
  }, {
    key: 'componentDidCatch',
    value: function componentDidCatch(error, errorInfo) {
      // Catch errors in any child components and re-renders with an error message
      this.setState({
        error: error,
        errorInfo: errorInfo
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          history = _props.history,
          type = _props.type,
          children = _props.children,
          autoScrollToTop = _props.autoScrollToTop,
          autoScrollToHash = _props.autoScrollToHash,
          scrollToTopDuration = _props.scrollToTopDuration,
          scrollToHashDuration = _props.scrollToHashDuration,
          scrollToHashOffset = _props.scrollToHashOffset,
          rest = _objectWithoutProperties(_props, ['history', 'type', 'children', 'autoScrollToTop', 'autoScrollToHash', 'scrollToTopDuration', 'scrollToHashDuration', 'scrollToHashOffset']);

      var staticURL = this.context.staticURL;

      var context = staticURL ? {} : undefined;

      var _state = this.state,
          ready = _state.ready,
          error = _state.error,
          errorInfo = _state.errorInfo;


      var ResolvedRouter = void 0;
      var resolvedHistory = void 0;

      if (error) {
        // Fallback UI if an error occurs
        return _react2.default.createElement(
          'div',
          {
            style: {
              margin: '1rem',
              padding: '1rem',
              background: 'rgba(0,0,0,0.05)'
            }
          },
          _react2.default.createElement(
            'h2',
            null,
            'Oh-no! Something\u2019s gone wrong!'
          ),
          _react2.default.createElement(
            'pre',
            { style: { whiteSpace: 'normal', color: 'red' } },
            _react2.default.createElement(
              'code',
              null,
              error && error.toString()
            )
          ),
          _react2.default.createElement(
            'h3',
            null,
            'This error occurred here:'
          ),
          _react2.default.createElement(
            'pre',
            { style: { color: 'red', overflow: 'auto' } },
            _react2.default.createElement(
              'code',
              null,
              errorInfo.componentStack
            )
          ),
          _react2.default.createElement(
            'p',
            null,
            'For more information, please see the console.'
          )
        );
      }

      // If statically rendering, use the static router
      if (staticURL) {
        ResolvedRouter = _reactRouterDom.StaticRouter;
        resolvedHistory = undefined;
      } else {
        ResolvedRouter = _reactRouterDom.Router;
        resolvedHistory = history || global.__reactStaticRouterHistory;
        if (!resolvedHistory) {
          if (type === 'memory') {
            resolvedHistory = (0, _createMemoryHistory2.default)();
          } else if (type === 'hash') {
            resolvedHistory = (0, _createHashHistory2.default)();
          } else {
            resolvedHistory = (0, _createBrowserHistory2.default)({
              basename: process.env.REACT_STATIC_BASEPATH
            });
          }
        }
        global.__reactStaticRouterHistory = resolvedHistory;
        this.patchHistoryNavigation(resolvedHistory);
      }

      if (process.env.REACT_STATIC_ENV === 'development' && !ready) {
        return _react2.default.createElement(_DevSpinner2.default, null);
      }

      return _react2.default.createElement(
        ResolvedRouter,
        _extends({
          history: resolvedHistory,
          location: staticURL,
          context: context,
          basename: process.env.REACT_STATIC_BASEPATH
        }, rest),
        _react2.default.createElement(
          _RouterScroller2.default,
          {
            autoScrollToTop: autoScrollToTop,
            autoScrollToHash: autoScrollToHash,
            scrollToTopDuration: scrollToTopDuration,
            scrollToHashDuration: scrollToHashDuration,
            scrollToHashOffset: scrollToHashOffset
          },
          children
        )
      );
    }
  }, {
    key: '__reactstandin__regenerateByEval',
    value: function __reactstandin__regenerateByEval(key, code) {
      this[key] = eval(code);
    }
  }]);

  return Router;
}(_react2.default.Component);

Router.defaultProps = {
  type: 'browser',
  autoScrollToTop: true,
  autoScrollToHash: true,
  scrollToTopDuration: 0,
  scrollToHashDuration: 800,
  scrollToHashOffset: 0
};
Router.contextTypes = {
  staticURL: _propTypes2.default.string,
  routeInfo: _propTypes2.default.object
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.state = {
    ready: false,
    error: null,
    errorInfo: null
  };

  this.bootstrapRouteInfo = function () {
    return _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var href, path, allProps, routeInfo;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(typeof window !== 'undefined')) {
                _context.next = 13;
                break;
              }

              // Get the entry path from location
              href = decodeURIComponent(window.location.href);
              path = (0, _shared.cleanPath)(href);

              // Injest and cache the embedded routeInfo in the page if possible

              if (window.__routeInfo && window.__routeInfo.path === path) {
                allProps = window.__routeInfo.allProps;

                Object.keys(window.__routeInfo.sharedPropsHashes).forEach(function (propKey) {
                  _methods.propsByHash[window.__routeInfo.sharedPropsHashes[propKey]] = allProps[propKey];
                });
              }

              // In dev mode, request the templateID and ready the router

              if (!(process.env.REACT_STATIC_ENV === 'development')) {
                _context.next = 13;
                break;
              }

              _context.prev = 5;
              _context.next = 8;
              return (0, _methods.getRouteInfo)(path);

            case 8:
              routeInfo = _context.sent;

              if (routeInfo) {
                (0, _methods.registerTemplateIDForPath)(path, routeInfo.templateID);
              }

            case 10:
              _context.prev = 10;

              _this2.setState({ ready: true });
              return _context.finish(10);

            case 13:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this2, [[5,, 10, 13]]);
    }))();
  };

  this.patchHistoryNavigation = function (resolvedHistory) {
    // Only patch navigation once
    if (_this2.patchedNavigation) {
      return;
    }
    // Here, we patch the push and replace methods on history so we can
    // intercept them.
    ['push', 'replace'].forEach(function (method) {
      // Hold on to the original method, we will need it.
      var originalMethod = resolvedHistory[method];
      // Replace it with our own patched version
      resolvedHistory[method] = function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          var path, shouldPrefetch;
          return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  // Clean the path first
                  path = (0, _shared.cleanPath)(typeof args[0] === 'string' ? args[0] : args[0].path);
                  // Determine as quickly as possible if we need to fetch data for this route

                  _context2.next = 3;
                  return (0, _methods.needsPrefetch)(path);

                case 3:
                  shouldPrefetch = _context2.sent;

                  if (!shouldPrefetch) {
                    _context2.next = 9;
                    break;
                  }

                  // Notify with a loading state
                  (0, _methods.setLoading)(true);
                  // Prefetch any data or templates needed with a high priority
                  _context2.next = 8;
                  return (0, _methods.prefetch)(path, {
                    priority: true
                  });

                case 8:
                  // Notify we're done loading
                  (0, _methods.setLoading)(false);

                case 9:

                  // Apply the original method and arguments as if nothing happened
                  originalMethod.apply(resolvedHistory, args);

                case 10:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, _this2);
        }));

        return function () {
          return _ref2.apply(this, arguments);
        };
      }();
    });

    // Only patch navigation once :)
    _this2.patchedNavigation = true;
  };
};

var _default = Router;
exports.default = _default;
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(Router, 'Router', 'src/client/components/Router.js');
  reactHotLoader.register(_default, 'default', 'src/client/components/Router.js');
  leaveModule(module);
})();

;