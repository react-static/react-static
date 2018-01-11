'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Router = exports.PrefetchWhenSeen = exports.Prefetch = exports.prefetch = exports.Head = exports.NavLink = exports.Link = exports.withRouter = exports.matchPath = exports.Switch = exports.Route = exports.Redirect = exports.Prompt = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var shouldPrefetch = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3(path) {
    var routes;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            path = cleanPath(path);
            // Get route info so we can check if path has any data
            _context3.next = 3;
            return getRouteInfo();

          case 3:
            routes = _context3.sent;
            return _context3.abrupt('return', routes[path] !== undefined);

          case 5:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function shouldPrefetch(_x) {
    return _ref3.apply(this, arguments);
  };
}();

var prefetch = exports.prefetch = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee5(path) {
    var _this = this;

    var routes, isStaticRoute, _ref5, _initialProps, propsMap, initialProps;

    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            path = cleanPath(path);

            if (path) {
              _context5.next = 3;
              break;
            }

            return _context5.abrupt('return');

          case 3:
            if (!pathProps[path]) {
              _context5.next = 5;
              break;
            }

            return _context5.abrupt('return', pathProps[path]);

          case 5:
            _context5.next = 7;
            return getRouteInfo();

          case 7:
            routes = _context5.sent;

            if (!(process.env.REACT_STATIC_ENV === 'development')) {
              _context5.next = 30;
              break;
            }

            isStaticRoute = routes.indexOf(path) > -1;

            // Not a static route? Bail out.

            if (isStaticRoute) {
              _context5.next = 12;
              break;
            }

            return _context5.abrupt('return');

          case 12:
            if (!(window.__routeData && window.__routeData.path === path)) {
              _context5.next = 15;
              break;
            }

            pathProps[path] = window.__routeData;
            return _context5.abrupt('return', pathProps[path]);

          case 15:
            _context5.prev = 15;

            if (!inflight[path]) {
              inflight[path] = _axios2.default.get('/__react-static__/route' + path);
            }
            _context5.next = 19;
            return inflight[path];

          case 19:
            _ref5 = _context5.sent;
            _initialProps = _ref5.data;


            // Place it in the cache
            pathProps[path] = {
              initialProps: _initialProps
            };
            _context5.next = 28;
            break;

          case 24:
            _context5.prev = 24;
            _context5.t0 = _context5['catch'](15);

            console.error('Error: There was an error retrieving props for this route! path:', path);
            throw _context5.t0;

          case 28:
            delete inflight[path];
            return _context5.abrupt('return', pathProps[path]);

          case 30:

            // for production, we'll need the full route
            propsMap = routes[path];

            // Not a static route? Bail out.

            if (propsMap) {
              _context5.next = 33;
              break;
            }

            return _context5.abrupt('return');

          case 33:

            // Request and build the props one by one
            initialProps = {};

            // Loop over the propsMap, and request each prop

            _context5.next = 36;
            return Promise.all(Object.keys(propsMap).map(function () {
              var _ref6 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee4(key) {
                var hash, _ref7, prop;

                return _regenerator2.default.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        hash = propsMap[key];

                        // Check the propsByHash first

                        if (propsByHash[hash]) {
                          _context4.next = 16;
                          break;
                        }

                        _context4.prev = 2;

                        if (!inflight[hash]) {
                          inflight[hash] = _axios2.default.get('/staticData/' + hash + '.json');
                        }
                        _context4.next = 6;
                        return inflight[hash];

                      case 6:
                        _ref7 = _context4.sent;
                        prop = _ref7.data;


                        // Place it in the cache
                        propsByHash[hash] = prop;
                        _context4.next = 15;
                        break;

                      case 11:
                        _context4.prev = 11;
                        _context4.t0 = _context4['catch'](2);

                        console.error('Error: There was an error retrieving a prop for this route! hashID:', hash);
                        console.error(_context4.t0);

                      case 15:
                        delete inflight[hash];

                      case 16:

                        // If this prop was the local prop, spread it on the entire prop object
                        if (key === '__local') {
                          initialProps = _extends({}, initialProps, propsByHash[hash]);
                        } else {
                          // Otherwise, just set it as the key
                          initialProps[key] = propsByHash[hash];
                        }

                      case 17:
                      case 'end':
                        return _context4.stop();
                    }
                  }
                }, _callee4, _this, [[2, 11]]);
              }));

              return function (_x3) {
                return _ref6.apply(this, arguments);
              };
            }()));

          case 36:

            // Cache the entire props for the route
            pathProps[path] = {
              initialProps: initialProps

              // Return the props
            };return _context5.abrupt('return', pathProps[path]);

          case 38:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this, [[15, 24]]);
  }));

  return function prefetch(_x2) {
    return _ref4.apply(this, arguments);
  };
}();

var _reactRouterDom = require('react-router-dom');

Object.defineProperty(exports, 'Prompt', {
  enumerable: true,
  get: function get() {
    return _reactRouterDom.Prompt;
  }
});
Object.defineProperty(exports, 'Redirect', {
  enumerable: true,
  get: function get() {
    return _reactRouterDom.Redirect;
  }
});
Object.defineProperty(exports, 'Route', {
  enumerable: true,
  get: function get() {
    return _reactRouterDom.Route;
  }
});
Object.defineProperty(exports, 'Switch', {
  enumerable: true,
  get: function get() {
    return _reactRouterDom.Switch;
  }
});
Object.defineProperty(exports, 'matchPath', {
  enumerable: true,
  get: function get() {
    return _reactRouterDom.matchPath;
  }
});
Object.defineProperty(exports, 'withRouter', {
  enumerable: true,
  get: function get() {
    return _reactRouterDom.withRouter;
  }
});

var _links = require('./links');

Object.defineProperty(exports, 'Link', {
  enumerable: true,
  get: function get() {
    return _links.Link;
  }
});
Object.defineProperty(exports, 'NavLink', {
  enumerable: true,
  get: function get() {
    return _links.NavLink;
  }
});
exports.getRouteProps = getRouteProps;
exports.getSiteProps = getSiteProps;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _createBrowserHistory = require('history/createBrowserHistory');

var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

var _createMemoryHistory = require('history/createMemoryHistory');

var _createMemoryHistory2 = _interopRequireDefault(_createMemoryHistory);

var _createHashHistory = require('history/createHashHistory');

var _createHashHistory2 = _interopRequireDefault(_createHashHistory);

var _reactHelmet = require('react-helmet');

var _shared = require('./shared');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
//


// Proxy Helmet as Head
exports.Head = _reactHelmet.Helmet;

//

var propsByHash = {};
var pathProps = {};
var inflight = {};

var sitePropsPromise = void 0;
var InitialLoading = void 0;

var routesPromise = void 0;

var getRouteInfo = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!(typeof document !== 'undefined')) {
              _context2.next = 3;
              break;
            }

            if (!routesPromise) {
              routesPromise = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var res;
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        res = void 0;

                        if (!(process.env.REACT_STATIC_ENV === 'development')) {
                          _context.next = 7;
                          break;
                        }

                        _context.next = 4;
                        return _axios2.default.get('/__react-static__/routeInfo');

                      case 4:
                        res = _context.sent;
                        _context.next = 10;
                        break;

                      case 7:
                        _context.next = 9;
                        return _axios2.default.get('/routeInfo.json');

                      case 9:
                        res = _context.sent;

                      case 10:
                        return _context.abrupt('return', res.data);

                      case 11:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, undefined);
              }))();
            }
            return _context2.abrupt('return', routesPromise);

          case 3:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function getRouteInfo() {
    return _ref.apply(this, arguments);
  };
}();

if (process.env.REACT_STATIC_ENV === 'development') {
  InitialLoading = function InitialLoading() {
    return _react2.default.createElement(
      'div',
      {
        className: 'react-static-loading',
        style: {
          display: 'block',
          width: '100%',
          textAlign: 'center',
          padding: '10px'
        }
      },
      _react2.default.createElement(
        'style',
        null,
        '\n        @keyframes react-static-loader {\n          0% {\n            transform: rotate(0deg)\n          }\n          100% {\n            transform: rotate(360deg)\n          }\n        }\n      '
      ),
      _react2.default.createElement(
        'svg',
        {
          style: {
            width: '50px',
            height: '50px'
          }
        },
        _react2.default.createElement('circle', {
          style: {
            transformOrigin: '50% 50% 0px',
            animation: 'react-static-loader 1s infinite',
            r: 20,
            stroke: 'rgba(0,0,0,0.4)',
            strokeWidth: 4,
            cx: 25,
            cy: 25,
            strokeDasharray: 10.4,
            strokeLinecap: 'round',
            fill: 'transparent'
          }
        })
      )
    );
  };
}

function cleanPath(path) {
  // Resolve the local path
  if (!path) {
    return;
  }
  // Only allow origin or absolute links
  var hasOrigin = path.startsWith(window.location.origin);
  var isAbsolute = path.startsWith('/');
  if (!hasOrigin && !isAbsolute) {
    return;
  }
  var end = path.indexOf('#');
  end = end === -1 ? undefined : end;
  return (0, _shared.pathJoin)(path.substring(hasOrigin ? window.location.origin.length : 0, end));
}

function isPrefetched(path) {
  path = cleanPath(path);
  if (!path) {
    return;
  }

  if (pathProps[path]) {
    return pathProps[path];
  }
}

function getRouteProps(Comp) {
  var _class, _temp2;

  return (0, _reactRouterDom.withRouter)((_temp2 = _class = function (_Component) {
    _inherits(GetRouteProps, _Component);

    function GetRouteProps() {
      var _ref8,
          _this4 = this;

      var _temp, _this2, _ret;

      _classCallCheck(this, GetRouteProps);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this2 = _possibleConstructorReturn(this, (_ref8 = GetRouteProps.__proto__ || Object.getPrototypeOf(GetRouteProps)).call.apply(_ref8, [this].concat(args))), _this2), _this2.state = {
        loaded: false
      }, _this2.loadRouteProps = function () {
        var _ref9 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
          var _this3;

          var _args6 = arguments;
          return _regenerator2.default.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  _context6.next = 2;
                  return (_this3 = _this2).__loadRouteProps__REACT_HOT_LOADER__.apply(_this3, _args6);

                case 2:
                  return _context6.abrupt('return', _context6.sent);

                case 3:
                case 'end':
                  return _context6.stop();
              }
            }
          }, _callee6, _this4);
        }));

        return function NAME() {
          return _ref9.apply(this, arguments);
        };
      }(), _temp), _possibleConstructorReturn(_this2, _ret);
    }

    _createClass(GetRouteProps, [{
      key: '__loadRouteProps__REACT_HOT_LOADER__',
      value: function () {
        var _ref10 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
          var _props$location, pathname, search, path;

          return _regenerator2.default.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  _props$location = _this5.props.location, pathname = _props$location.pathname, search = _props$location.search;
                  path = (0, _shared.pathJoin)('' + pathname + search);
                  _context7.next = 4;
                  return prefetch(path);

                case 4:
                  if (!_this5.unmounting) {
                    _context7.next = 6;
                    break;
                  }

                  return _context7.abrupt('return');

                case 6:
                  _this5.setState({
                    loaded: true
                  });

                case 7:
                case 'end':
                  return _context7.stop();
              }
            }
          }, _callee7, this);
        }));

        function __loadRouteProps__REACT_HOT_LOADER__() {
          return _ref10.apply(this, arguments);
        }

        return __loadRouteProps__REACT_HOT_LOADER__;
      }()
    }, {
      key: 'componentWillMount',
      value: function componentWillMount() {
        if (process.env.REACT_STATIC_ENV === 'development') {
          this.loadRouteProps();
        }
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        if (process.env.REACT_STATIC_ENV === 'development') {
          if (this.props.match.url !== nextProps.match.url) {
            this.setState({ loaded: false }, this.loadRouteProps);
          }
        }
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.unmounting = true;
      }
    }, {
      key: 'render',
      value: function render() {
        var _props$location2 = this.props.location,
            pathname = _props$location2.pathname,
            search = _props$location2.search;

        var path = (0, _shared.pathJoin)('' + pathname + search);

        var initialProps = void 0;

        if (typeof window !== 'undefined') {
          if (window.__routeData && window.__routeData.path === path) {
            initialProps = window.__routeData.initialProps;
          }
        }

        if (!initialProps && this.context.initialProps) {
          initialProps = this.context.initialProps;
        } else {
          initialProps = pathProps[path] ? pathProps[path].initialProps : initialProps;
        }

        if (!initialProps && this.state.loaded) {
          console.error('Warning: getRouteProps could not find any props for route: ' + path + '. Either you are missing a getProps function for this route in your static.config.js or you are using the getRouteProps HOC when you don\'t need to.');
        }

        if (!initialProps) {
          if (process.env.REACT_STATIC_ENV === 'development') {
            return _react2.default.createElement(InitialLoading, null);
          }
          return null;
        }

        return _react2.default.createElement(Comp, _extends({}, this.props, initialProps));
      }
    }]);

    return GetRouteProps;
  }(_react.Component), _class.contextTypes = {
    initialProps: _propTypes2.default.object
  }, _temp2));
}

function getSiteProps(Comp) {
  var _class2, _temp4;

  return _temp4 = _class2 = function (_Component2) {
    _inherits(GetSiteProps, _Component2);

    function GetSiteProps() {
      var _ref11;

      var _temp3, _this6, _ret2;

      _classCallCheck(this, GetSiteProps);

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return _ret2 = (_temp3 = (_this6 = _possibleConstructorReturn(this, (_ref11 = GetSiteProps.__proto__ || Object.getPrototypeOf(GetSiteProps)).call.apply(_ref11, [this].concat(args))), _this6), _this6.state = {
        siteProps: false
      }, _temp3), _possibleConstructorReturn(_this6, _ret2);
    }

    _createClass(GetSiteProps, [{
      key: 'componentWillMount',
      value: function () {
        var _ref12 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
          var _ref13, siteProps;

          return _regenerator2.default.wrap(function _callee9$(_context9) {
            while (1) {
              switch (_context9.prev = _context9.next) {
                case 0:
                  if (!(process.env.REACT_STATIC_ENV === 'development')) {
                    _context9.next = 8;
                    break;
                  }

                  _context9.next = 3;
                  return function () {
                    if (sitePropsPromise) {
                      return sitePropsPromise;
                    }
                    sitePropsPromise = _axios2.default.get('/__react-static__/siteProps');
                    return sitePropsPromise;
                  }();

                case 3:
                  _ref13 = _context9.sent;
                  siteProps = _ref13.data;

                  if (!this.unmounting) {
                    _context9.next = 7;
                    break;
                  }

                  return _context9.abrupt('return');

                case 7:
                  this.setState({
                    siteProps: siteProps
                  });

                case 8:
                case 'end':
                  return _context9.stop();
              }
            }
          }, _callee9, this);
        }));

        function componentWillMount() {
          return _ref12.apply(this, arguments);
        }

        return componentWillMount;
      }()
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.unmounting = true;
      }
    }, {
      key: 'render',
      value: function render() {
        var siteProps = void 0;
        if (typeof window !== 'undefined') {
          if (window.__routeData) {
            siteProps = window.__routeData.siteProps;
          }
        }

        if (!siteProps && this.context.siteProps) {
          siteProps = this.context.siteProps;
        }

        if (!siteProps && this.state.siteProps) {
          siteProps = this.state.siteProps;
        }

        if (!siteProps) {
          if (process.env.REACT_STATIC_ENV === 'development') {
            return _react2.default.createElement(InitialLoading, null);
          }
          return null;
        }

        return _react2.default.createElement(Comp, _extends({}, this.props, siteProps));
      }
    }]);

    return GetSiteProps;
  }(_react.Component), _class2.contextTypes = {
    siteProps: _propTypes2.default.object
  }, _temp4;
}

var Prefetch = exports.Prefetch = function (_Component3) {
  _inherits(Prefetch, _Component3);

  function Prefetch() {
    _classCallCheck(this, Prefetch);

    return _possibleConstructorReturn(this, (Prefetch.__proto__ || Object.getPrototypeOf(Prefetch)).apply(this, arguments));
  }

  _createClass(Prefetch, [{
    key: 'componentDidMount',
    value: function () {
      var _ref14 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
        var _props, path, onLoad, data;

        return _regenerator2.default.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _props = this.props, path = _props.path, onLoad = _props.onLoad;
                _context10.next = 3;
                return prefetch(path);

              case 3:
                data = _context10.sent;

                onLoad(data, path);

              case 5:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function componentDidMount() {
        return _ref14.apply(this, arguments);
      }

      return componentDidMount;
    }()
  }, {
    key: 'render',
    value: function render() {
      return this.props.children;
    }
  }]);

  return Prefetch;
}(_react.Component);

Prefetch.defaultProps = {
  children: null,
  path: null,
  onLoad: function onLoad() {}
};


var ioIsSupported = typeof window !== 'undefined' && 'IntersectionObserver' in window;
var handleIntersection = function handleIntersection(element, callback) {
  var io = new window.IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      // Edge doesn't support isIntersecting. intersectionRatio > 0 works as a fallback
      if (element === entry.target && (entry.isIntersecting || entry.intersectionRatio > 0)) {
        io.unobserve(element);
        io.disconnect();
        callback();
      }
    });
  });

  io.observe(element);
};

var PrefetchWhenSeen = exports.PrefetchWhenSeen = function (_Component4) {
  _inherits(PrefetchWhenSeen, _Component4);

  function PrefetchWhenSeen() {
    var _ref15;

    var _temp5, _this8, _ret3;

    _classCallCheck(this, PrefetchWhenSeen);

    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return _ret3 = (_temp5 = (_this8 = _possibleConstructorReturn(this, (_ref15 = PrefetchWhenSeen.__proto__ || Object.getPrototypeOf(PrefetchWhenSeen)).call.apply(_ref15, [this].concat(args))), _this8), _this8.runPrefetch = function () {
      var _this9;

      return (_this9 = _this8).__runPrefetch__REACT_HOT_LOADER__.apply(_this9, arguments);
    }, _this8.handleRef = function () {
      var _this10;

      return (_this10 = _this8).__handleRef__REACT_HOT_LOADER__.apply(_this10, arguments);
    }, _temp5), _possibleConstructorReturn(_this8, _ret3);
  }

  _createClass(PrefetchWhenSeen, [{
    key: '__handleRef__REACT_HOT_LOADER__',
    value: function __handleRef__REACT_HOT_LOADER__() {
      return this.__handleRef__REACT_HOT_LOADER__.apply(this, arguments);
    }
  }, {
    key: '__runPrefetch__REACT_HOT_LOADER__',
    value: function __runPrefetch__REACT_HOT_LOADER__() {
      return this.__runPrefetch__REACT_HOT_LOADER__.apply(this, arguments);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (!ioIsSupported) {
        this.runPrefetch();
      }
    }
  }, {
    key: '__runPrefetch__REACT_HOT_LOADER__',
    value: function __runPrefetch__REACT_HOT_LOADER__() {
      var _props2 = this.props,
          path = _props2.path,
          onLoad = _props2.onLoad;

      prefetch(path).then(function (data) {
        onLoad(data, path);
      });
    }
  }, {
    key: '__handleRef__REACT_HOT_LOADER__',
    value: function __handleRef__REACT_HOT_LOADER__(ref) {
      if (ioIsSupported && ref) {
        handleIntersection(ref, this.runPrefetch);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props,
          children = _props3.children,
          className = _props3.className;

      return _react2.default.createElement(
        'div',
        { className: className, ref: this.handleRef },
        children
      );
    }
  }]);

  return PrefetchWhenSeen;
}(_react.Component);

PrefetchWhenSeen.defaultProps = {
  children: null,
  path: null,
  className: null,
  onLoad: function onLoad() {}
};


var loading = false;
var subscribers = [];
var setLoading = function setLoading(d) {
  loading = d;
  subscribers.forEach(function (s) {
    return s();
  });
};

var Router = exports.Router = function (_Component5) {
  _inherits(Router, _Component5);

  function Router() {
    var _ref16;

    var _temp6, _this11, _ret4;

    _classCallCheck(this, Router);

    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return _ret4 = (_temp6 = (_this11 = _possibleConstructorReturn(this, (_ref16 = Router.__proto__ || Object.getPrototypeOf(Router)).call.apply(_ref16, [this].concat(args))), _this11), _this11.state = {
      error: null,
      errorInfo: null
    }, _temp6), _possibleConstructorReturn(_this11, _ret4);
  }

  _createClass(Router, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      getRouteInfo();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (typeof window !== 'undefined') {
        var _window$location = window.location,
            href = _window$location.href,
            origin = _window$location.origin;

        var _path = (0, _shared.pathJoin)(href.replace(origin, ''));
        if (window.__routeData && window.__routeData.path === _path) {
          var initialProps = window.__routeData.initialProps;
          Object.keys(initialProps).forEach(function (key) {
            propsByHash[window.__routeData.propsMap[key]] = initialProps[key];
          });
        }
      }
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
      var _this12 = this;

      var _props4 = this.props,
          history = _props4.history,
          type = _props4.type,
          rest = _objectWithoutProperties(_props4, ['history', 'type']);

      var staticURL = this.context.staticURL;

      var context = staticURL ? {} : undefined;

      var ResolvedRouter = void 0;
      var resolvedHistory = void 0;

      if (this.state.error) {
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
            'Oh-no! Something\'s gone wrong!'
          ),
          _react2.default.createElement(
            'pre',
            { style: { whiteSpace: 'normal', color: 'red' } },
            _react2.default.createElement(
              'code',
              null,
              this.state.error && this.state.error.toString()
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
              this.state.errorInfo.componentStack
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
            resolvedHistory = (0, _createBrowserHistory2.default)();
          }
        }
        global.__reactStaticRouterHistory = resolvedHistory;['push', 'replace'].forEach(function (method) {
          var originalMethod = resolvedHistory[method];
          resolvedHistory[method] = function () {
            var _ref17 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
              for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                args[_key5] = arguments[_key5];
              }

              var path;
              return _regenerator2.default.wrap(function _callee11$(_context11) {
                while (1) {
                  switch (_context11.prev = _context11.next) {
                    case 0:
                      path = typeof args[0] === 'string' ? args[0] : args[0].path + args[0].search;
                      _context11.next = 3;
                      return shouldPrefetch(path);

                    case 3:
                      _context11.t0 = _context11.sent;

                      if (!_context11.t0) {
                        _context11.next = 6;
                        break;
                      }

                      _context11.t0 = !isPrefetched(path);

                    case 6:
                      if (!_context11.t0) {
                        _context11.next = 11;
                        break;
                      }

                      setLoading(true);
                      _context11.next = 10;
                      return prefetch(path);

                    case 10:
                      setLoading(false);

                    case 11:
                      originalMethod.apply(resolvedHistory, args);

                    case 12:
                    case 'end':
                      return _context11.stop();
                  }
                }
              }, _callee11, _this12);
            }));

            return function () {
              return _ref17.apply(this, arguments);
            };
          }();
        });
      }

      return _react2.default.createElement(ResolvedRouter, _extends({ history: resolvedHistory, location: staticURL, context: context }, rest));
    }
  }]);

  return Router;
}(_react.Component);

Router.defaultProps = {
  type: 'browser'
};

Router.subscribe = function (cb) {
  var ccb = function ccb() {
    return cb(loading);
  };
  subscribers.push(ccb);
  return function () {
    subscribers = subscribers.filter(function (d) {
      return d !== ccb;
    });
  };
};

Router.contextTypes = {
  staticURL: _propTypes2.default.string
};
;

var _temp7 = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(propsByHash, 'propsByHash', 'src/index.js');

  __REACT_HOT_LOADER__.register(pathProps, 'pathProps', 'src/index.js');

  __REACT_HOT_LOADER__.register(inflight, 'inflight', 'src/index.js');

  __REACT_HOT_LOADER__.register(sitePropsPromise, 'sitePropsPromise', 'src/index.js');

  __REACT_HOT_LOADER__.register(InitialLoading, 'InitialLoading', 'src/index.js');

  __REACT_HOT_LOADER__.register(routesPromise, 'routesPromise', 'src/index.js');

  __REACT_HOT_LOADER__.register(getRouteInfo, 'getRouteInfo', 'src/index.js');

  __REACT_HOT_LOADER__.register(cleanPath, 'cleanPath', 'src/index.js');

  __REACT_HOT_LOADER__.register(isPrefetched, 'isPrefetched', 'src/index.js');

  __REACT_HOT_LOADER__.register(shouldPrefetch, 'shouldPrefetch', 'src/index.js');

  __REACT_HOT_LOADER__.register(prefetch, 'prefetch', 'src/index.js');

  __REACT_HOT_LOADER__.register(getRouteProps, 'getRouteProps', 'src/index.js');

  __REACT_HOT_LOADER__.register(getSiteProps, 'getSiteProps', 'src/index.js');

  __REACT_HOT_LOADER__.register(Prefetch, 'Prefetch', 'src/index.js');

  __REACT_HOT_LOADER__.register(ioIsSupported, 'ioIsSupported', 'src/index.js');

  __REACT_HOT_LOADER__.register(handleIntersection, 'handleIntersection', 'src/index.js');

  __REACT_HOT_LOADER__.register(PrefetchWhenSeen, 'PrefetchWhenSeen', 'src/index.js');

  __REACT_HOT_LOADER__.register(loading, 'loading', 'src/index.js');

  __REACT_HOT_LOADER__.register(subscribers, 'subscribers', 'src/index.js');

  __REACT_HOT_LOADER__.register(setLoading, 'setLoading', 'src/index.js');

  __REACT_HOT_LOADER__.register(Router, 'Router', 'src/index.js');
}();

;