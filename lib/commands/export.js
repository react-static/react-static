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

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
//


var _default = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        config = _ref2.config,
        staging = _ref2.staging,
        debug = _ref2.debug,
        isCLI = _ref2.isCLI,
        _ref2$silent = _ref2.silent,
        silent = _ref2$silent === undefined ? !isCLI : _ref2$silent;

    var clientStats, PrettyError;
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

            if (!silent) console.log('=> Building Routes...');
            if (!silent) console.time(_chalk2.default.green('=> [\u2713] Routes Built'));
            _context.next = 10;
            return (0, _static.prepareRoutes)(config, { dev: false });

          case 10:
            if (!silent) console.timeEnd(_chalk2.default.green('=> [\u2713] Routes Built'));

            if (debug) {
              console.log('DEBUG - Resolved static.config.js:');
              console.log(config);
            }

            _context.next = 14;
            return _fsExtra2.default.readJson(config.paths.DIST + '/client-stats.json');

          case 14:
            clientStats = _context.sent;

            if (clientStats) {
              _context.next = 17;
              break;
            }

            throw new Error("No Client Stats Found");

          case 17:
            _context.prev = 17;
            _context.next = 20;
            return (0, _static.exportRoutes)({
              config: config,
              clientStats: clientStats
            });

          case 20:
            _context.next = 28;
            break;

          case 22:
            _context.prev = 22;
            _context.t0 = _context['catch'](17);
            PrettyError = require('pretty-error');

            console.log(); // new line
            console.log(new PrettyError().render(_context.t0));
            process.exit(1);

          case 28:
            _context.next = 30;
            return (0, _static.buildXMLandRSS)({ config: config });

          case 30:
            if (!config.onBuild) {
              _context.next = 33;
              break;
            }

            _context.next = 33;
            return config.onBuild({ config: config });

          case 33:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[17, 22]]);
  }));

  return function _default() {
    return _ref.apply(this, arguments);
  };
}();

exports.default = _default;
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(_default, 'default', 'src/commands/export.js');
  leaveModule(module);
})();

;