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

var _RootComponents = require('../RootComponents');

var _webpack = require('../webpack');

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
//


//

var _default = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(cliArguments) {
    var config, siteProps, Component;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            // Get the config
            config = (0, _utils.getConfig)();

            // Clean the dist folder

            _context.next = 4;
            return _fsExtra2.default.remove(config.paths.DIST);

          case 4:
            _context.next = 6;
            return config.getSiteProps({ dev: true, cliArguments: cliArguments });

          case 6:
            siteProps = _context.sent;


            // Resolve the base HTML template
            Component = config.Document || _RootComponents.DefaultDocument;

            // Render an index.html placeholder

            _context.next = 10;
            return (0, _utils.createIndexFilePlaceholder)({
              config: config,
              Component: Component,
              siteProps: siteProps
            });

          case 10:

            // Copy the public directory over
            console.log('');
            console.log('=> Copying public directory...');
            console.time(_chalk2.default.green('=> [\u2713] Public directory copied'));
            (0, _utils.copyPublicFolder)(config);
            console.timeEnd(_chalk2.default.green('=> [\u2713] Public directory copied'));

            // Build the dynamic routes file (react-static-routes)
            console.log('=> Building Routes...');
            console.time(_chalk2.default.green('=> [\u2713] Routes Built'));
            _context.next = 19;
            return config.getRoutes({ dev: true });

          case 19:
            config.routes = _context.sent;
            _context.next = 22;
            return (0, _static.prepareRoutes)(config);

          case 22:
            console.timeEnd(_chalk2.default.green('=> [\u2713] Routes Built'));

            // Build the JS bundle
            _context.next = 25;
            return (0, _webpack.startDevServer)({ config: config });

          case 25:
            _context.next = 31;
            break;

          case 27:
            _context.prev = 27;
            _context.t0 = _context['catch'](0);

            console.log(_context.t0);
            process.exit(1);

          case 31:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 27]]);
  }));

  return function _default(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(_default, 'default', 'src/commands/start.js');
}();

;