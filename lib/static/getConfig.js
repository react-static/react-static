'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
//


exports.default = getConfig;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _shared = require('../utils/shared');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

//

var defaultEntry = 'index.js';
var path404 = '404';

// Retrieves the static.config.js from the current project directory
function getConfig(customConfig) {
  var _this = this;

  /* eslint-disable import/no-dynamic-require */
  var config = void 0;
  if (typeof customConfig === 'string') {
    config = require(_path2.default.resolve(customConfig)).default;
  } else if (customConfig) {
    config = customConfig;
  } else {
    config = require(_path2.default.resolve(_path2.default.join(process.cwd(), 'static.config.js'))).default;
  }

  // path defaults
  config.paths = _extends({
    root: _path2.default.resolve(process.cwd()),
    src: 'src',
    dist: 'dist',
    devDist: 'tmp/dev-server',
    public: 'public'
  }, config.paths || {});

  // Use the root to resolve all other relative paths
  var resolvePath = function resolvePath(relativePath) {
    return _path2.default.resolve(config.paths.root, relativePath);
  };

  // Resolve all paths
  var distPath = process.env.REACT_STATIC_ENV === 'development' ? resolvePath(config.paths.devDist || config.paths.dist) : resolvePath(config.paths.dist);
  var paths = {
    ROOT: config.paths.root,
    LOCAL_NODE_MODULES: _path2.default.resolve(__dirname, '../../node_modules'),
    SRC: resolvePath(config.paths.src),
    DIST: distPath,
    PUBLIC: resolvePath(config.paths.public),
    NODE_MODULES: resolvePath('node_modules'),
    PACKAGE: resolvePath('package.json'),
    HTML_TEMPLATE: _path2.default.join(distPath, 'index.html'),
    STATIC_DATA: _path2.default.join(distPath, 'staticData')

    // Cut siteRoot to the suffix, no trailing slashes
  };var siteRoot = config.siteRoot ? config.siteRoot.replace(/(\..+?)\/.*/g, '$1') : '';

  // Cut siteRoot to the suffix, no trailing slashes
  var stagingSiteRoot = config.stagingSiteRoot ? config.stagingSiteRoot.replace(/(\..+?)\/.*/g, '$1') : '';

  // Trim basePath of leading and trailing slashes
  var basePath = config.basePath ? config.basePath.replace(/\/{0,}$/g, '').replace(/^\/{0,}/g, '') : '';

  // Trim stagingBasePath of leading and trailing slashes
  var stagingBasePath = config.stagingBasePath ? config.stagingBasePath.replace(/\/{0,}$/g, '').replace(/^\/{0,}/g, '') : '';

  // Trim basePath of leading and trailing slashes
  var devBasePath = config.devBasePath ? config.devBasePath.replace(/\/{0,}$/g, '').replace(/^\/{0,}/g, '') : '';

  var getRoutes = config.getRoutes ? function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var _config;

      var routes,
          _args = arguments;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (_config = config).getRoutes.apply(_config, _args);

            case 2:
              routes = _context.sent;
              return _context.abrupt('return', normalizeRoutes(routes));

            case 4:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function () {
      return _ref.apply(this, arguments);
    };
  }() : _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt('return',
            // At least ensure the index page is defined for export
            normalizeRoutes([{
              path: '/'
            }]));

          case 1:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, _this);
  }));

  var finalConfig = _extends({
    // Defaults
    entry: _path2.default.join(paths.SRC, defaultEntry),
    getSiteData: function getSiteData() {
      return {};
    },
    renderToHtml: function renderToHtml(render, Comp) {
      return render(_react2.default.createElement(Comp, null));
    },
    prefetchRate: 10,
    outputFileRate: 10
  }, config, {
    // Materialized Overrides
    paths: paths,
    siteRoot: siteRoot || '',
    stagingSiteRoot: stagingSiteRoot || '',
    basePath: basePath || '',
    stagingBasePath: stagingBasePath || '',
    devBasePath: devBasePath || '',
    extractCssChunks: config.extractCssChunks || false,
    inlineCss: config.inlineCss || false,
    getRoutes: getRoutes

    // Set env variables to be used client side
  });process.env.REACT_STATIC_PREFETCH_RATE = finalConfig.prefetchRate;

  return finalConfig;
}

// Normalize routes with parents, full paths, context, etc.
function normalizeRoutes(routes) {
  var flatRoutes = [];

  var recurse = function recurse(route) {
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { path: '/' };

    var routePath = route.is404 ? path404 : (0, _shared.pathJoin)(parent.path, route.path);

    if (typeof route.noIndex !== 'undefined') {
      console.log('=> Warning: Route ' + route.path + ' is using \'noIndex\'. Did you mean \'noindex\'?');
      route.noindex = route.noIndex;
    }

    var normalizedRoute = _extends({}, route, {
      path: routePath,
      noindex: typeof route.noindex === 'undefined' ? parent.noindex : route.noindex,
      hasGetProps: !!route.getData
    });

    if (!normalizedRoute.path) {
      throw new Error('No path defined for route:', normalizedRoute);
    }

    if (route.children) {
      route.children.forEach(function (d) {
        return recurse(d, normalizedRoute);
      });
    }

    delete normalizedRoute.children;

    flatRoutes.push(normalizedRoute);
  };

  routes.forEach(function (d) {
    return recurse(d);
  });

  flatRoutes.forEach(function (route) {
    var found = flatRoutes.filter(function (d) {
      return d.path === route.path;
    });
    if (found.length > 1) {
      console.warn('More than one route is defined for path:', route.path);
    }
  });

  if (!flatRoutes.find(function (d) {
    return d.is404;
  })) {
    flatRoutes.push({
      is404: true,
      path: path404
    });
  }

  return flatRoutes;
}
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(defaultEntry, 'defaultEntry', 'src/static/getConfig.js');
  reactHotLoader.register(path404, 'path404', 'src/static/getConfig.js');
  reactHotLoader.register(getConfig, 'getConfig', 'src/static/getConfig.js');
  reactHotLoader.register(normalizeRoutes, 'normalizeRoutes', 'src/static/getConfig.js');
  leaveModule(module);
})();

;