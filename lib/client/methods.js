'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onLoading = exports.setLoading = exports.prefetch = exports.needsPrefetch = exports.prefetchTemplate = exports.prefetchData = exports.getRouteInfo = exports.reloadRouteData = exports.propsByHash = exports.routeInfoByPath = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var prefetchData = exports.prefetchData = function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee4(path) {
    var _this = this;

    var _ref10 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        priority = _ref10.priority;

    var routeInfo, allProps;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return getRouteInfo(path, { priority: priority });

          case 2:
            routeInfo = _context4.sent;

            if (routeInfo) {
              _context4.next = 5;
              break;
            }

            return _context4.abrupt('return');

          case 5:
            if (!routeInfo.allProps) {
              _context4.next = 7;
              break;
            }

            return _context4.abrupt('return', routeInfo.allProps);

          case 7:

            // Request and build the props one by one
            allProps = _extends({}, routeInfo.localProps || {});

            // Request the template and loop over the routeInfo.sharedPropsHashes, requesting each prop

            _context4.next = 10;
            return Promise.all(Object.keys(routeInfo.sharedPropsHashes).map(function () {
              var _ref11 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3(key) {
                var hash, _ref12, prop, _ref13, _prop;

                return _regenerator2.default.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        hash = routeInfo.sharedPropsHashes[key];

                        // Check the propsByHash first

                        if (propsByHash[hash]) {
                          _context3.next = 24;
                          break;
                        }

                        _context3.prev = 2;

                        if (!priority) {
                          _context3.next = 11;
                          break;
                        }

                        _context3.next = 6;
                        return _axios2.default.get(process.env.REACT_STATIC_PUBLIC_PATH + 'staticData/' + hash + '.json');

                      case 6:
                        _ref12 = _context3.sent;
                        prop = _ref12.data;

                        propsByHash[hash] = prop;
                        _context3.next = 17;
                        break;

                      case 11:
                        // Non priority, share inflight requests and use pool
                        if (!inflightPropHashes[hash]) {
                          inflightPropHashes[hash] = requestPool.add(function () {
                            return _axios2.default.get(process.env.REACT_STATIC_PUBLIC_PATH + 'staticData/' + hash + '.json');
                          });
                        }
                        _context3.next = 14;
                        return inflightPropHashes[hash];

                      case 14:
                        _ref13 = _context3.sent;
                        _prop = _ref13.data;

                        // Place it in the cache
                        propsByHash[hash] = _prop;

                      case 17:
                        _context3.next = 23;
                        break;

                      case 19:
                        _context3.prev = 19;
                        _context3.t0 = _context3['catch'](2);

                        console.log('Error: There was an error retrieving a prop for this route! hashID:', hash);
                        console.error(_context3.t0);

                      case 23:
                        if (!priority) {
                          delete inflightPropHashes[hash];
                        }

                      case 24:

                        // Otherwise, just set it as the key
                        allProps[key] = propsByHash[hash];

                      case 25:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                }, _callee3, _this, [[2, 19]]);
              }));

              return function (_x5) {
                return _ref11.apply(this, arguments);
              };
            }()));

          case 10:

            // Cache the entire props for the route
            routeInfo.allProps = allProps;

            // Return the props
            return _context4.abrupt('return', routeInfo.allProps);

          case 12:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function prefetchData(_x3) {
    return _ref9.apply(this, arguments);
  };
}();

var prefetchTemplate = exports.prefetchTemplate = function () {
  var _ref14 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee5(path) {
    var _ref15 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        priority = _ref15.priority;

    var routeInfo, pathTemplate;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            // Clean the path
            path = (0, _shared.cleanPath)(path);
            // Get route info so we can check if path has any data
            _context5.next = 3;
            return getRouteInfo(path);

          case 3:
            routeInfo = _context5.sent;


            if (routeInfo) {
              registerTemplateIDForPath(path, routeInfo.templateID);
            }

            // Preload the template if available
            pathTemplate = getComponentForPath(path);

            if (!(pathTemplate && pathTemplate.preload)) {
              _context5.next = 16;
              break;
            }

            if (!priority) {
              _context5.next = 12;
              break;
            }

            _context5.next = 10;
            return pathTemplate.preload();

          case 10:
            _context5.next = 14;
            break;

          case 12:
            _context5.next = 14;
            return requestPool.add(function () {
              return pathTemplate.preload();
            });

          case 14:
            if (routeInfo) {
              routeInfo.templateLoaded = true;
            }
            return _context5.abrupt('return', pathTemplate);

          case 16:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function prefetchTemplate(_x6) {
    return _ref14.apply(this, arguments);
  };
}();

var needsPrefetch = exports.needsPrefetch = function () {
  var _ref16 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee6(path) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var routeInfo;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            // Clean the path
            path = (0, _shared.cleanPath)(path);

            if (path) {
              _context6.next = 3;
              break;
            }

            return _context6.abrupt('return', false);

          case 3:
            _context6.next = 5;
            return getRouteInfo(path, options);

          case 5:
            routeInfo = _context6.sent;

            if (routeInfo) {
              _context6.next = 8;
              break;
            }

            return _context6.abrupt('return', true);

          case 8:
            if (!(!routeInfo.allProps || !routeInfo.templateLoaded)) {
              _context6.next = 10;
              break;
            }

            return _context6.abrupt('return', true);

          case 10:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function needsPrefetch(_x8) {
    return _ref16.apply(this, arguments);
  };
}();

var prefetch = exports.prefetch = function () {
  var _ref17 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee7(path) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var type, data, _ref18, _ref19;

    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            // Clean the path
            path = (0, _shared.cleanPath)(path);

            type = options.type;


            if (options.priority) {
              requestPool.stop();
            }

            data = void 0;

            if (!(type === 'data')) {
              _context7.next = 10;
              break;
            }

            _context7.next = 7;
            return prefetchData(path, options);

          case 7:
            data = _context7.sent;
            _context7.next = 20;
            break;

          case 10:
            if (!(type === 'template')) {
              _context7.next = 15;
              break;
            }

            _context7.next = 13;
            return prefetchTemplate(path, options);

          case 13:
            _context7.next = 20;
            break;

          case 15:
            _context7.next = 17;
            return Promise.all([prefetchData(path, options), prefetchTemplate(path, options)]);

          case 17:
            _ref18 = _context7.sent;
            _ref19 = _slicedToArray(_ref18, 1);
            data = _ref19[0];

          case 20:

            if (options.priority) {
              requestPool.start();
            }

            return _context7.abrupt('return', data);

          case 22:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function prefetch(_x10) {
    return _ref17.apply(this, arguments);
  };
}();

exports.getComponentForPath = getComponentForPath;
exports.registerTemplateIDForPath = registerTemplateIDForPath;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _shared = require('../utils/shared');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /* eslint-disable import/no-mutable-exports */

var routeInfoByPath = exports.routeInfoByPath = {};
var propsByHash = exports.propsByHash = {};
var erroredPaths = {};
var inflightRouteInfo = {};
var inflightPropHashes = {};
var loading = 0;
var loadingSubscribers = [];
var disableRouteInfoWarning = process.env.REACT_STATIC_DISABLE_ROUTE_INFO_WARNING === 'true';

var requestPool = (0, _shared.createPool)({
  concurrency: Number(process.env.REACT_STATIC_PREFETCH_RATE) || 3
});

var reloadRouteData = exports.reloadRouteData = function reloadRouteData() {
  // Delete all cached data
  [routeInfoByPath, propsByHash, erroredPaths, inflightRouteInfo, inflightPropHashes].forEach(function (part) {
    Object.keys(part).forEach(function (key) {
      delete part[key];
    });
  });
  // Force each RouteData component to reload
  global.reloadAll();
};

if (process.env.REACT_STATIC_ENV === 'development') {
  var io = require('socket.io-client');
  var run = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var _ref2, port, socket;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return _axios2.default.get('/__react-static__/getMessagePort');

            case 3:
              _ref2 = _context.sent;
              port = _ref2.data.port;
              socket = io('http://localhost:' + port);

              socket.on('connect', function () {
                console.log('React-Static data hot-loader websocket connected. Listening for data changes...');
              });
              socket.on('message', function (_ref3) {
                var type = _ref3.type;

                if (type === 'reloadRoutes') {
                  reloadRouteData();
                }
              });
              _context.next = 14;
              break;

            case 10:
              _context.prev = 10;
              _context.t0 = _context['catch'](0);

              console.log('React-Static data hot-loader websocket encountered the following error:');
              console.error(_context.t0);

            case 14:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined, [[0, 10]]);
    }));

    return function run() {
      return _ref.apply(this, arguments);
    };
  }();
  run();
}

var getRouteInfo = exports.getRouteInfo = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2(path) {
    var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        priority = _ref5.priority;

    var originalPath, routeInfo, _ref6, data, routeInfoRoot, cacheBuster, getPath, _ref7, _data, _ref8, _data2;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!(typeof document === 'undefined')) {
              _context2.next = 2;
              break;
            }

            return _context2.abrupt('return');

          case 2:
            originalPath = path;

            path = (0, _shared.cleanPath)(path);
            // Check the cache first

            if (!routeInfoByPath[path]) {
              _context2.next = 6;
              break;
            }

            return _context2.abrupt('return', routeInfoByPath[path]);

          case 6:
            if (!erroredPaths[path]) {
              _context2.next = 8;
              break;
            }

            return _context2.abrupt('return');

          case 8:
            routeInfo = void 0;
            _context2.prev = 9;

            if (!(process.env.REACT_STATIC_ENV === 'development')) {
              _context2.next = 19;
              break;
            }

            // In dev, request from the webpack dev server
            if (!inflightRouteInfo[path]) {
              inflightRouteInfo[path] = _axios2.default.get('/__react-static__/routeInfo/' + (path === '/' ? '' : path));
            }
            _context2.next = 14;
            return inflightRouteInfo[path];

          case 14:
            _ref6 = _context2.sent;
            data = _ref6.data;

            routeInfo = data;
            _context2.next = 36;
            break;

          case 19:
            routeInfoRoot = (process.env.REACT_STATIC_DISABLE_ROUTE_PREFIXING === 'true' ? process.env.REACT_STATIC_SITE_ROOT : process.env.REACT_STATIC_PUBLIC_PATH) || '/';
            cacheBuster = process.env.REACT_STATIC_CACHE_BUST ? '?' + process.env.REACT_STATIC_CACHE_BUST : '';
            getPath = '' + routeInfoRoot + (0, _shared.pathJoin)(path, 'routeInfo.json') + cacheBuster;

            if (!priority) {
              _context2.next = 30;
              break;
            }

            _context2.next = 25;
            return _axios2.default.get(getPath);

          case 25:
            _ref7 = _context2.sent;
            _data = _ref7.data;

            routeInfo = _data;
            _context2.next = 36;
            break;

          case 30:
            if (!inflightRouteInfo[path]) {
              inflightRouteInfo[path] = requestPool.add(function () {
                return _axios2.default.get(getPath);
              });
            }
            _context2.next = 33;
            return inflightRouteInfo[path];

          case 33:
            _ref8 = _context2.sent;
            _data2 = _ref8.data;

            routeInfo = _data2;

          case 36:
            _context2.next = 44;
            break;

          case 38:
            _context2.prev = 38;
            _context2.t0 = _context2['catch'](9);

            erroredPaths[path] = true;

            if (!(process.env.REACT_STATIC_ENV === 'production' || disableRouteInfoWarning)) {
              _context2.next = 43;
              break;
            }

            return _context2.abrupt('return');

          case 43:
            console.warn('Could not load routeInfo for path: ' + originalPath + '. If this is a static route, make sure any link to this page is valid! If this is not a static route, you can disregard this warning.');

          case 44:
            if (!priority) {
              delete inflightRouteInfo[path];
            }
            routeInfoByPath[path] = routeInfo;
            return _context2.abrupt('return', routeInfoByPath[path]);

          case 47:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[9, 38]]);
  }));

  return function getRouteInfo(_x) {
    return _ref4.apply(this, arguments);
  };
}();

var setLoading = exports.setLoading = function setLoading(d) {
  if (loading !== d) {
    loading = d;
    loadingSubscribers.forEach(function (s) {
      return s();
    });
  }
};

var onLoading = exports.onLoading = function onLoading(cb) {
  var ccb = function ccb() {
    return cb(loading);
  };
  loadingSubscribers.push(ccb);
  return function () {
    loadingSubscribers = loadingSubscribers.filter(function (d) {
      return d !== ccb;
    });
  };
};

function getComponentForPath(path) {
  path = (0, _shared.cleanPath)(path);
  return global.reactStaticGetComponentForPath && global.reactStaticGetComponentForPath(path);
}

function registerTemplateIDForPath(path, templateID) {
  path = (0, _shared.cleanPath)(path);
  return global.reactStaticGetComponentForPath && global.reactStaticRegisterTemplateIDForPath(path, templateID);
}