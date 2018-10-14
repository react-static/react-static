'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _static = require('../static');

var _getConfig = require('../static/getConfig');

var _getConfig2 = _interopRequireDefault(_getConfig);

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
            if (config && (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object' && !config.generated) {
              config = (0, _getConfig2.default)(config);
            }

            if (config.routes) {
              _context.next = 12;
              break;
            }

            if (!silent) console.log('=> Building Routes...');
            if (!silent) console.time(_chalk2.default.green('=> [\u2713] Routes Built'));
            _context.next = 11;
            return (0, _static.prepareRoutes)(config, { dev: false });

          case 11:
            if (!silent) console.timeEnd(_chalk2.default.green('=> [\u2713] Routes Built'));

          case 12:

            if (debug) {
              console.log('DEBUG - Resolved static.config.js:');
              console.log(config);
            }

            _context.next = 15;
            return _fsExtra2.default.readJson(config.paths.DIST + '/client-stats.json');

          case 15:
            clientStats = _context.sent;

            if (clientStats) {
              _context.next = 18;
              break;
            }

            throw new Error('No Client Stats Found');

          case 18:
            _context.prev = 18;
            _context.next = 21;
            return (0, _static.exportRoutes)({
              config: config,
              clientStats: clientStats
            });

          case 21:
            _context.next = 29;
            break;

          case 23:
            _context.prev = 23;
            _context.t0 = _context['catch'](18);
            PrettyError = require('pretty-error');

            console.log(); // new line
            console.log(new PrettyError().render(_context.t0));
            process.exit(1);

          case 29:
            _context.next = 31;
            return (0, _static.buildXMLandRSS)({ config: config });

          case 31:
            if (!config.onBuild) {
              _context.next = 34;
              break;
            }

            _context.next = 34;
            return config.onBuild({ config: config });

          case 34:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[18, 23]]);
  }));

  return function () {
    return _ref.apply(this, arguments);
  };
}();