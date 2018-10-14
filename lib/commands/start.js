'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _static = require('../static');

var _RootComponents = require('../static/RootComponents');

var _webpack = require('../static/webpack');

var _getConfig = require('../static/getConfig');

var _getConfig2 = _interopRequireDefault(_getConfig);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
//


//

exports.default = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        config = _ref2.config,
        isCLI = _ref2.isCLI,
        debug = _ref2.debug,
        _ref2$silent = _ref2.silent,
        silent = _ref2$silent === undefined ? !isCLI : _ref2$silent;

    var siteData, Component;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // ensure ENV variables are set
            if (typeof process.env.NODE_ENV === 'undefined') {
              process.env.NODE_ENV = 'development';
            }
            process.env.REACT_STATIC_ENV = 'development';
            process.env.BABEL_ENV = 'development';

            config = (0, _getConfig2.default)(config, { watch: true });
            // Allow config location to be overriden

            if (debug) {
              console.log('DEBUG - Resolved static.config.js:');
              console.log(config);
            }

            // Clean the dist folder
            _context.next = 7;
            return _fsExtra2.default.remove(config.paths.DIST);

          case 7:
            _context.next = 9;
            return config.getSiteData({ dev: true });

          case 9:
            siteData = _context.sent;


            // Resolve the base HTML template
            Component = config.Document || _RootComponents.DefaultDocument;

            // Render an index.html placeholder

            _context.next = 13;
            return (0, _utils.createIndexFilePlaceholder)({
              config: config,
              Component: Component,
              siteData: siteData
            });

          case 13:

            // Build the dynamic routes file (react-static-routes)
            if (!silent) console.log('=> Building Routes...');
            console.time(_chalk2.default.green('=> [\u2713] Routes Built'));
            _context.next = 17;
            return (0, _static.prepareRoutes)(config, { dev: true });

          case 17:
            console.timeEnd(_chalk2.default.green('=> [\u2713] Routes Built'));

            // Build the JS bundle
            _context.next = 20;
            return (0, _webpack.startDevServer)({ config: config });

          case 20:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function start() {
    return _ref.apply(this, arguments);
  }

  return start;
}();