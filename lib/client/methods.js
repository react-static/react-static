'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onLoading = exports.setLoading = exports.prefetch = exports.needsPrefetch = exports.prefetchTemplate = exports.prefetchData = exports.getRouteInfo = exports.propsByHash = exports.routeInfoByPath = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var prefetchData = exports.prefetchData = function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee4(path) {
    var _this = this;

    var _ref6 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        priority = _ref6.priority;

    var routeInfo, allProps;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return getRouteInfo(path);

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
              var _ref7 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3(key) {
                var hash, _ref8, prop;

                return _regenerator2.default.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        hash = routeInfo.sharedPropsHashes[key];

                        // Check the propsByHash first

                        if (propsByHash[hash]) {
                          _context3.next = 16;
                          break;
                        }

                        _context3.prev = 2;

                        if (!inflightPropHashes[hash]) {
                          if (priority) {
                            inflightPropHashes[hash] = _axios2.default.get(process.env.REACT_STATIC_PUBLIC_PATH + 'staticData/' + hash + '.json');
                          } else {
                            inflightPropHashes[hash] = prefetchPool.add(function () {
                              return _axios2.default.get(process.env.REACT_STATIC_PUBLIC_PATH + 'staticData/' + hash + '.json');
                            });
                          }
                        }
                        _context3.next = 6;
                        return inflightPropHashes[hash];

                      case 6:
                        _ref8 = _context3.sent;
                        prop = _ref8.data;


                        // Place it in the cache
                        propsByHash[hash] = prop;
                        _context3.next = 15;
                        break;

                      case 11:
                        _context3.prev = 11;
                        _context3.t0 = _context3['catch'](2);

                        console.error('Error: There was an error retrieving a prop for this route! hashID:', hash);
                        console.error(_context3.t0);

                      case 15:
                        delete inflightPropHashes[hash];

                      case 16:

                        // Otherwise, just set it as the key
                        allProps[key] = propsByHash[hash];

                      case 17:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                }, _callee3, _this, [[2, 11]]);
              }));

              return function (_x4) {
                return _ref7.apply(this, arguments);
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

  return function prefetchData(_x2) {
    return _ref5.apply(this, arguments);
  };
}();

var prefetchTemplate = exports.prefetchTemplate = function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee5(path) {
    var _ref10 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        priority = _ref10.priority;

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
            return prefetchPool.add(function () {
              return pathTemplate.preload();
            });

          case 14:
            routeInfo.templateLoaded = true;
            return _context5.abrupt('return', pathTemplate);

          case 16:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function prefetchTemplate(_x5) {
    return _ref9.apply(this, arguments);
  };
}();

var needsPrefetch = exports.needsPrefetch = function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee6(path) {
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
            return getRouteInfo(path);

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

  return function needsPrefetch(_x7) {
    return _ref11.apply(this, arguments);
  };
}();

var prefetch = exports.prefetch = function () {
  var _ref12 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee7(path) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var type, _ref13, _ref14, data;

    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            // Clean the path
            path = (0, _shared.cleanPath)(path);

            type = options.type;

            if (!(type === 'data')) {
              _context7.next = 6;
              break;
            }

            return _context7.abrupt('return', prefetchData(path, options));

          case 6:
            if (!(type === 'template')) {
              _context7.next = 10;
              break;
            }

            _context7.next = 9;
            return prefetchTemplate(path, options);

          case 9:
            return _context7.abrupt('return');

          case 10:
            _context7.next = 12;
            return Promise.all([prefetchData(path), prefetchTemplate(path)]);

          case 12:
            _ref13 = _context7.sent;
            _ref14 = _slicedToArray(_ref13, 1);
            data = _ref14[0];
            return _context7.abrupt('return', data);

          case 16:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function prefetch(_x8) {
    return _ref12.apply(this, arguments);
  };
}();

exports.getComponentForPath = getComponentForPath;
exports.registerTemplateIDForPath = registerTemplateIDForPath;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _shared = require('../utils/shared');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var routeInfoByPath = exports.routeInfoByPath = {};
var propsByHash = exports.propsByHash = {};
var erroredPaths = {};
var inflightRouteInfo = {};
var inflightPropHashes = {};
var loading = false;
var loadingSubscribers = [];

var prefetchPool = (0, _shared.createPool)({
  concurrency: Number(process.env.REACT_STATIC_PREFETCH_RATE) || 10
});

var getRouteInfo = exports.getRouteInfo = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2(path) {
    var originalPath, routeInfo;
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
            // If there is no inflight request for the info, let it fly.
            if (!inflightRouteInfo[path]) {
              inflightRouteInfo[path] = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var _ref3, _data, _ref4, data;

                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.prev = 0;

                        if (!(process.env.REACT_STATIC_ENV === 'development')) {
                          _context.next = 7;
                          break;
                        }

                        _context.next = 4;
                        return _axios2.default.get('/__react-static__/routeInfo/' + (path === '/' ? '' : path));

                      case 4:
                        _ref3 = _context.sent;
                        _data = _ref3.data;
                        return _context.abrupt('return', _data);

                      case 7:
                        _context.next = 9;
                        return _axios2.default.get('' + process.env.REACT_STATIC_PUBLIC_PATH + (0, _shared.pathJoin)(path, 'routeInfo.json?' + process.env.REACT_STATIC_CACHE_BUST));

                      case 9:
                        _ref4 = _context.sent;
                        data = _ref4.data;
                        return _context.abrupt('return', data);

                      case 14:
                        _context.prev = 14;
                        _context.t0 = _context['catch'](0);

                        erroredPaths[path] = true;
                        console.warn('Could not load routeInfo for path: ' + originalPath + '. If this is a static route, make sure any link to this page is valid! If this is not a static route, you can desregard this warning.');

                      case 18:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, undefined, [[0, 14]]);
              }))();
            }
            _context2.next = 11;
            return inflightRouteInfo[path];

          case 11:
            routeInfo = _context2.sent;

            delete inflightRouteInfo[path];
            routeInfoByPath[path] = routeInfo;
            return _context2.abrupt('return', routeInfoByPath[path]);

          case 15:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function getRouteInfo(_x) {
    return _ref.apply(this, arguments);
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
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(routeInfoByPath, 'routeInfoByPath', 'src/client/methods.js');
  reactHotLoader.register(propsByHash, 'propsByHash', 'src/client/methods.js');
  reactHotLoader.register(erroredPaths, 'erroredPaths', 'src/client/methods.js');
  reactHotLoader.register(inflightRouteInfo, 'inflightRouteInfo', 'src/client/methods.js');
  reactHotLoader.register(inflightPropHashes, 'inflightPropHashes', 'src/client/methods.js');
  reactHotLoader.register(loading, 'loading', 'src/client/methods.js');
  reactHotLoader.register(loadingSubscribers, 'loadingSubscribers', 'src/client/methods.js');
  reactHotLoader.register(prefetchPool, 'prefetchPool', 'src/client/methods.js');
  reactHotLoader.register(getRouteInfo, 'getRouteInfo', 'src/client/methods.js');
  reactHotLoader.register(prefetchData, 'prefetchData', 'src/client/methods.js');
  reactHotLoader.register(prefetchTemplate, 'prefetchTemplate', 'src/client/methods.js');
  reactHotLoader.register(needsPrefetch, 'needsPrefetch', 'src/client/methods.js');
  reactHotLoader.register(prefetch, 'prefetch', 'src/client/methods.js');
  reactHotLoader.register(setLoading, 'setLoading', 'src/client/methods.js');
  reactHotLoader.register(onLoading, 'onLoading', 'src/client/methods.js');
  reactHotLoader.register(getComponentForPath, 'getComponentForPath', 'src/client/methods.js');
  reactHotLoader.register(registerTemplateIDForPath, 'registerTemplateIDForPath', 'src/client/methods.js');
  leaveModule(module);
})();

;