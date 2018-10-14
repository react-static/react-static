'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSiteRoot = exports.generateXML = exports.makeGenerateRouteXML = exports.getPermaLink = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _shared = require('../utils/shared');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var REGEX_TO_GET_LAST_SLASH = /\/{1,}$/gm;

var getPermaLink = exports.getPermaLink = function getPermaLink(_ref) {
  var path = _ref.path,
      prefixPath = _ref.prefixPath;

  var permalink = '' + prefixPath + (0, _shared.pathJoin)(path);
  return (permalink + '/').replace(REGEX_TO_GET_LAST_SLASH, '/');
};

var makeGenerateRouteXML = exports.makeGenerateRouteXML = function makeGenerateRouteXML(_ref2) {
  var prefixPath = _ref2.prefixPath;
  return function (route) {
    var path = route.path,
        lastModified = route.lastModified,
        _route$priority = route.priority,
        priority = _route$priority === undefined ? 0.5 : _route$priority;

    return ['<url>', '<loc>' + getPermaLink({ path: path, prefixPath: prefixPath }).replace(/[<>&'"]/g, function (c) {
      switch (c) {
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '&':
          return '&amp;';
        case '\'':
          return '&apos;';
        case '"':
          return '&quot;';
        default:
          throw new Error('XML encoding failed');
      }
    }) + '</loc>', lastModified ? '<lastmod>' + lastModified + '</lastmod>' : '', '<priority>' + priority + '</priority>', '</url>'].join('');
  };
};

var generateXML = exports.generateXML = function generateXML(_ref3) {
  var routes = _ref3.routes,
      prefixPath = _ref3.prefixPath;
  return '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + routes.filter(function (r) {
    return !r.is404;
  }).filter(function (r) {
    return !r.noindex;
  }).map(makeGenerateRouteXML({ prefixPath: prefixPath })).join('') + '</urlset>';
};

var getSiteRoot = exports.getSiteRoot = function getSiteRoot(_ref4) {
  var stagingSiteRoot = _ref4.stagingSiteRoot,
      siteRoot = _ref4.siteRoot;
  return process.env.REACT_STATIC_STAGING === 'true' ? stagingSiteRoot : siteRoot;
};

exports.default = function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref6) {
    var config = _ref6.config;

    var routes, publicPath, _config$paths, paths, disableRoutePrefixing, DIST, siteRoot, prefixPath, xml;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            routes = config.routes, publicPath = config.publicPath, _config$paths = config.paths, paths = _config$paths === undefined ? {} : _config$paths, disableRoutePrefixing = config.disableRoutePrefixing;
            DIST = paths.DIST;
            siteRoot = getSiteRoot(config);
            prefixPath = disableRoutePrefixing ? siteRoot : publicPath;

            if (siteRoot) {
              _context.next = 6;
              break;
            }

            return _context.abrupt('return');

          case 6:
            xml = generateXML({ routes: routes, prefixPath: prefixPath });
            _context.next = 9;
            return _fsExtra2.default.writeFile(_path2.default.join(DIST, 'sitemap.xml'), xml);

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x) {
    return _ref5.apply(this, arguments);
  };
}();