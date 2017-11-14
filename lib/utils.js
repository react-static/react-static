'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createIndexFilePlaceholder = exports.getConfig = exports.findAvailablePort = exports.ChalkColor = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* eslint-disable import/no-dynamic-require, react/no-danger */


//

var createIndexFilePlaceholder = exports.createIndexFilePlaceholder = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3(_ref4) {
    var config = _ref4.config,
        Component = _ref4.Component,
        siteProps = _ref4.siteProps;
    var html;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            // Render the base document component to string with siteprops
            html = '<!DOCTYPE html>' + (0, _server.renderToString)(_react2.default.createElement(
              Component,
              { renderMeta: {}, Html: _RootComponents.Html, Head: _RootComponents.Head, Body: _RootComponents.Body, siteProps: siteProps },
              _react2.default.createElement('div', { id: 'root' })
            ));

            // Write the Document to index.html

            _context3.next = 3;
            return _fsExtra2.default.outputFile(config.paths.HTML_TEMPLATE, html);

          case 3:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function createIndexFilePlaceholder(_x2) {
    return _ref3.apply(this, arguments);
  };
}();

exports.normalizeRoutes = normalizeRoutes;
exports.copyPublicFolder = copyPublicFolder;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _openport = require('openport');

var _openport2 = _interopRequireDefault(_openport);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _shared = require('./shared');

var _RootComponents = require('./RootComponents');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var defaultEntry = './src/index';

var ChalkColor = exports.ChalkColor = {
  yarn: '#2c8ebb',
  npm: '#cb3837'
};

var findAvailablePort = exports.findAvailablePort = function findAvailablePort(start) {
  return new Promise(function (resolve, reject) {
    return _openport2.default.find({
      startingPort: start,
      endingPort: start + 1000
    }, function (err, port) {
      if (err) {
        return reject(err);
      }
      resolve(port);
    });
  });
};

// Retrieves the static.config.js from the current project directory
var getConfig = exports.getConfig = function getConfig() {
  var config = require(_path2.default.resolve(_path2.default.join(process.cwd(), 'static.config.js'))).default;

  // path defaults
  config.paths = _extends({
    src: 'src',
    dist: 'dist',
    public: 'public'
  }, config.paths || {});

  // Resolve the root of the project
  var ROOT = _path2.default.resolve(process.cwd());

  // Use the root to resolve all other relative paths
  var resolvePath = function resolvePath(relativePath) {
    return _path2.default.resolve(_path2.default.join(ROOT, relativePath));
  };

  // Resolve all paths
  var paths = {
    ROOT: ROOT,
    LOCAL_NODE_MODULES: _path2.default.resolve(__dirname, '../node_modules'),
    SRC: resolvePath(config.paths.src),
    DIST: resolvePath(config.paths.dist),
    PUBLIC: resolvePath(config.paths.public),
    NODE_MODULES: resolvePath('node_modules'),
    PACKAGE: resolvePath('package.json'),
    HTML_TEMPLATE: _path2.default.join(resolvePath(config.paths.dist), 'index.html')
  };

  var siteRoot = config.siteRoot ? config.siteRoot.replace(/\/{0,}$/g, '') : null;

  var getRoutes = config.getRoutes ? function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var routes,
          _args = arguments;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return config.getRoutes.apply(config, _args);

            case 2:
              routes = _context.sent;
              return _context.abrupt('return', normalizeRoutes(routes));

            case 4:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
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
    }, _callee2, undefined);
  }));

  return _extends({
    // Defaults
    entry: defaultEntry,
    getSiteProps: function getSiteProps() {
      return {};
    },
    renderToHtml: function renderToHtml(render, Comp) {
      return render(_react2.default.createElement(Comp, null));
    }
  }, config, {
    // Materialized Overrides
    paths: paths,
    siteRoot: siteRoot,
    getRoutes: getRoutes
  });
};

var path404 = '/404';

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
      hasGetProps: !!route.getProps
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

function copyPublicFolder(config) {
  _fsExtra2.default.ensureDirSync(config.paths.PUBLIC);

  _fsExtra2.default.copySync(config.paths.PUBLIC, config.paths.DIST, {
    dereference: true,
    filter: function filter(file) {
      return file !== config.paths.INDEX;
    }
  });
}

;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(defaultEntry, 'defaultEntry', 'src/utils.js');

  __REACT_HOT_LOADER__.register(ChalkColor, 'ChalkColor', 'src/utils.js');

  __REACT_HOT_LOADER__.register(findAvailablePort, 'findAvailablePort', 'src/utils.js');

  __REACT_HOT_LOADER__.register(getConfig, 'getConfig', 'src/utils.js');

  __REACT_HOT_LOADER__.register(path404, 'path404', 'src/utils.js');

  __REACT_HOT_LOADER__.register(normalizeRoutes, 'normalizeRoutes', 'src/utils.js');

  __REACT_HOT_LOADER__.register(copyPublicFolder, 'copyPublicFolder', 'src/utils.js');

  __REACT_HOT_LOADER__.register(createIndexFilePlaceholder, 'createIndexFilePlaceholder', 'src/utils.js');
}();

;