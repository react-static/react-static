'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildConfigation = exports.makeGetRoutes = exports.normalizeRoutes = exports.consoleWarningForMutlipleRoutesWithTheSamePath = exports.createNormalizedRoute = exports.throwErrorIfRouteIsMissingPath = exports.trimLeadingAndTrailingSlashes = exports.cutPathToRoot = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = getConfig;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

var _shared = require('../utils/shared');

var _webpack = require('./webpack');

var _getDirname = require('../utils/getDirname');

var _getDirname2 = _interopRequireDefault(_getDirname);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } /* eslint-disable import/no-dynamic-require */

var REGEX_TO_CUT_TO_ROOT = /(\..+?)\/.*/g;
var REGEX_TO_REMOVE_TRAILING_SLASH = /^\/{0,}/g;
var REGEX_TO_REMOVE_LEADING_SLASH = /\/{0,}$/g;

var DEFAULT_NAME_FOR_STATIC_CONFIG_FILE = 'static.config.js';
// the default static.config.js location
var DEFAULT_PATH_FOR_STATIC_CONFIG = _path2.default.resolve(_path2.default.join(process.cwd(), DEFAULT_NAME_FOR_STATIC_CONFIG_FILE));
var DEFAULT_ROUTES = [{ path: '/' }];
var DEFAULT_ENTRY = 'index.js';
var PATH_404 = '404';

var cutPathToRoot = exports.cutPathToRoot = function cutPathToRoot() {
  var string = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return string.replace(REGEX_TO_CUT_TO_ROOT, '$1');
};

var trimLeadingAndTrailingSlashes = exports.trimLeadingAndTrailingSlashes = function trimLeadingAndTrailingSlashes() {
  var string = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return string.replace(REGEX_TO_REMOVE_TRAILING_SLASH, '').replace(REGEX_TO_REMOVE_LEADING_SLASH, '');
};

var throwErrorIfRouteIsMissingPath = exports.throwErrorIfRouteIsMissingPath = function throwErrorIfRouteIsMissingPath(route) {
  var path = route.path,
      _route$is = route.is404,
      is404 = _route$is === undefined ? false : _route$is;


  if (!is404 && !path) {
    throw new Error('No path defined for route: ' + JSON.stringify(route));
  }
};

var consoleWarningForRouteWithoutNoIndex = function consoleWarningForRouteWithoutNoIndex(route) {
  return route.noIndex && console.warn('=> Warning: Route ' + route.path + ' is using \'noIndex\'. Did you mean \'noindex\'?');
};

var createNormalizedRoute = function createNormalizedRoute(route) {
  var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var children = route.children,
      routeWithOutChildren = _objectWithoutProperties(route, ['children']);

  var _parent$path = parent.path,
      parentPath = _parent$path === undefined ? '/' : _parent$path;
  var _config$tree = config.tree,
      keepRouteChildren = _config$tree === undefined ? false : _config$tree;
  var _route$is2 = route.is404,
      is404 = _route$is2 === undefined ? false : _route$is2;


  throwErrorIfRouteIsMissingPath(route);

  var originalRoutePath = is404 ? PATH_404 : (0, _shared.pathJoin)(route.path);
  var routePath = is404 ? PATH_404 : (0, _shared.pathJoin)(parentPath, route.path);

  consoleWarningForRouteWithoutNoIndex(route);

  var normalizedRoute = _extends({}, keepRouteChildren ? route : routeWithOutChildren, {
    path: routePath,
    originalPath: originalRoutePath,
    noindex: route.noindex || parent.noindex || route.noIndex,
    hasGetProps: !!route.getData
  });

  return normalizedRoute;
};

exports.createNormalizedRoute = createNormalizedRoute;
var consoleWarningForMutlipleRoutesWithTheSamePath = exports.consoleWarningForMutlipleRoutesWithTheSamePath = function consoleWarningForMutlipleRoutesWithTheSamePath(routes) {
  routes.forEach(function (route) {
    var found = routes.filter(function (r) {
      return r.path === route.path;
    });
    if (found.length > 1) {
      console.warn('More than one route is defined for path:', route.path);
    }
  });
};

// We recursively loop through the routes and their children and
// return an array of normalised routes.
// Original routes array [{ path: 'path', children: { path: 'to' } }]
// These can be returned as flat routes eg. [{ path: 'path' }, { path: 'path/to' }]
// Or they can be returned nested routes eg. [{ path: 'path', children: { path: 'path/to' } }]
var recurseCreateNormalizedRoute = function recurseCreateNormalizedRoute() {
  var routes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var parent = arguments[1];
  var config = arguments[2];
  var existingRoutes = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var _config$tree2 = config.tree,
      createNestedTreeStructure = _config$tree2 === undefined ? false : _config$tree2;


  return routes.reduce(function () {
    var memo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var route = arguments[1];

    var normalizedRoute = createNormalizedRoute(route, parent, config);
    // if structure is nested (tree === true) normalizedRoute will
    // have children otherwise we fall back to the original route children
    var _normalizedRoute$chil = normalizedRoute.children,
        children = _normalizedRoute$chil === undefined ? route.children : _normalizedRoute$chil,
        path = normalizedRoute.path;

    // we check an array of paths to see
    // if route path already existings

    var routeExists = existingRoutes.includes(path);

    // we push paths into an array that
    // we use to check if a route existings
    existingRoutes.push(path);

    var normalizedRouteChildren = recurseCreateNormalizedRoute(children, normalizedRoute, config, existingRoutes);

    return [].concat(_toConsumableArray(memo), _toConsumableArray(routeExists ? [] : [_extends({}, normalizedRoute, createNestedTreeStructure ? { children: normalizedRouteChildren } : {})]), _toConsumableArray(createNestedTreeStructure ? [] : normalizedRouteChildren));
  }, []);
};

// Normalize routes with parents, full paths, context, etc.
var normalizeRoutes = exports.normalizeRoutes = function normalizeRoutes(routes) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var disableDuplicateRoutesWarning = config.disableDuplicateRoutesWarning,
      _config$force = config.force404,
      force404 = _config$force === undefined ? true : _config$force;

  var normalizedRoutes = recurseCreateNormalizedRoute(routes, {}, config);

  if (!disableDuplicateRoutesWarning) {
    consoleWarningForMutlipleRoutesWithTheSamePath(normalizedRoutes);
  }

  if (force404 && !normalizedRoutes.find(function (r) {
    return r.is404;
  })) {
    normalizedRoutes.push(createNormalizedRoute({
      is404: true,
      path: PATH_404
    }));
  }

  return normalizedRoutes;
};

// At least ensure the index page is defined for export
var makeGetRoutes = exports.makeGetRoutes = function makeGetRoutes(config) {
  return function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
      var _config$getRoutes,
          getRoutes,
          routes,
          _args2 = arguments;

      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _config$getRoutes = config.getRoutes, getRoutes = _config$getRoutes === undefined ? _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        return _context.abrupt('return', DEFAULT_ROUTES);

                      case 1:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, undefined);
              })) : _config$getRoutes;
              _context2.next = 3;
              return getRoutes.apply(undefined, _args2);

            case 3:
              routes = _context2.sent;
              return _context2.abrupt('return', normalizeRoutes(routes, config));

            case 5:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function () {
      return _ref.apply(this, arguments);
    };
  }();
};

var buildConfigation = exports.buildConfigation = function buildConfigation() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  // path defaults
  config.paths = _extends({
    root: _path2.default.resolve(process.cwd()),
    src: 'src',
    dist: 'dist',
    devDist: 'tmp/dev-server',
    public: 'public',
    nodeModules: 'node_modules'
  }, config.paths || {});

  // Use the root to resolve all other relative paths
  var resolvePath = function resolvePath(relativePath) {
    return _path2.default.resolve(config.paths.root, relativePath);
  };

  // Resolve all paths
  var distPath = process.env.REACT_STATIC_ENV === 'development' ? resolvePath(config.paths.devDist || config.paths.dist) : resolvePath(config.paths.dist);

  var paths = {
    ROOT: config.paths.root,
    LOCAL_NODE_MODULES: _path2.default.resolve((0, _getDirname2.default)(), '../../node_modules'),
    SRC: resolvePath(config.paths.src),
    DIST: distPath,
    PUBLIC: resolvePath(config.paths.public),
    NODE_MODULES: resolvePath(config.paths.nodeModules),
    EXCLUDE_MODULES: config.paths.excludeResolvedModules || resolvePath(config.paths.nodeModules),
    PACKAGE: resolvePath('package.json'),
    HTML_TEMPLATE: _path2.default.join(distPath, 'index.html'),
    STATIC_DATA: _path2.default.join(distPath, 'staticData')

    // Defaults
  };var finalConfig = _extends({
    // Defaults
    entry: _path2.default.join(paths.SRC, DEFAULT_ENTRY),
    getSiteData: function getSiteData() {
      return {};
    },
    renderToHtml: function renderToHtml(render, Comp) {
      return render(_react2.default.createElement(Comp, null));
    },
    prefetchRate: 3,
    disableRouteInfoWarning: false,
    disableRoutePrefixing: false,
    outputFileRate: 10
  }, config, {
    // Materialized Overrides
    paths: paths,
    siteRoot: cutPathToRoot(config.siteRoot, '$1'),
    stagingSiteRoot: cutPathToRoot(config.stagingSiteRoot, '$1'),
    basePath: trimLeadingAndTrailingSlashes(config.basePath),
    stagingBasePath: trimLeadingAndTrailingSlashes(config.stagingBasePath),
    devBasePath: trimLeadingAndTrailingSlashes(config.devBasePath),
    extractCssChunks: config.extractCssChunks || false,
    generateSourceMaps: config.generateSourceMaps || true,
    inlineCss: config.inlineCss || false,
    getRoutes: makeGetRoutes(config),
    generated: true

    // Set env variables to be used client side
  });process.env.REACT_STATIC_PREFETCH_RATE = finalConfig.prefetchRate;
  process.env.REACT_STATIC_DISABLE_ROUTE_INFO_WARNING = finalConfig.disableRouteInfoWarning;
  process.env.REACT_STATIC_DISABLE_ROUTE_PREFIXING = finalConfig.disableRoutePrefixing;

  return finalConfig;
};

var buildConfigFromPath = function buildConfigFromPath(configPath) {
  var filename = _path2.default.resolve(configPath);
  delete require.cache[filename];
  try {
    var config = require(configPath).default;
    return buildConfigation(config);
  } catch (err) {
    console.error(err);
    return {};
  }
};

var fromFile = function fromFile() {
  var configPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_PATH_FOR_STATIC_CONFIG;
  var watch = arguments[1];

  var config = buildConfigFromPath(configPath);

  if (watch) {
    _chokidar2.default.watch(configPath).on('all', function () {
      Object.assign(config, buildConfigFromPath(configPath));
      (0, _webpack.reloadRoutes)();
    });
  }

  return config;
};

// Retrieves the static.config.js from the current project directory
function getConfig(customConfig) {
  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      watch = _ref3.watch;

  if ((typeof customConfig === 'undefined' ? 'undefined' : _typeof(customConfig)) === 'object') {
    // return a custom config obj
    return buildConfigation(customConfig);
  }

  // return a custom config file location
  // defaults to constant paath for static config
  return fromFile(customConfig, watch);
}