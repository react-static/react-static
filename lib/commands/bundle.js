'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _static = require('../static');

var _webpack = require('../static/webpack');

var _getConfig = require('../static/getConfig');

var _getConfig2 = _interopRequireDefault(_getConfig);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
//


exports.default = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        config = _ref2.config,
        staging = _ref2.staging,
        debug = _ref2.debug,
        isCLI = _ref2.isCLI,
        _ref2$silent = _ref2.silent,
        silent = _ref2$silent === undefined ? !isCLI : _ref2$silent;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // ensure ENV variables are set
            if (typeof process.env.NODE_ENV === 'undefined' && !debug) {
              process.env.NODE_ENV = 'production';
            }
            process.env.REACT_STATIC_ENV = 'production';
            process.env.BABEL_ENV = 'production';

            if (staging) {
              process.env.REACT_STATIC_STAGING = true;
            }
            if (debug) {
              process.env.REACT_STATIC_DEBUG = true;
            }

            // Allow config location to be overriden
            config = (0, _getConfig2.default)(config);

            if (debug) {
              console.log('DEBUG - Resolved static.config.js:');
              console.log(config);
            }

            _context.next = 9;
            return _fsExtra2.default.remove(config.paths.DIST);

          case 9:

            if (!silent) console.log('');

            if (!config.siteRoot) {
              if (!silent) {
                console.log("=> Info: No 'siteRoot' is defined in 'static.config.js'. This is suggested for absolute url's and a sitemap.xml to be automatically generated.");
              }
              if (!silent) console.log('');
            }

            if (!silent) console.log('=> Copying public directory...');
            if (!silent) console.time(_chalk2.default.green('=> [\u2713] Public directory copied'));
            (0, _utils.copyPublicFolder)(config);
            if (!silent) console.timeEnd(_chalk2.default.green('=> [\u2713] Public directory copied'));

            // Build static pages and JSON
            if (!silent) console.log('=> Bundling App...');
            if (!silent) console.time(_chalk2.default.green('=> [\u2713] App Bundled'));
            _context.next = 19;
            return (0, _webpack.buildProductionBundles)({ config: config });

          case 19:
            if (!silent) console.timeEnd(_chalk2.default.green('=> [\u2713] App Bundled'));

            if (!config.bundleAnalyzer) {
              _context.next = 23;
              break;
            }

            _context.next = 23;
            return new Promise(function () {});

          case 23:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function build() {
    return _ref.apply(this, arguments);
  }

  return build;
}();