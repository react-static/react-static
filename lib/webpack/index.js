'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildProductionBundles = exports.startDevServer = exports.buildCompiler = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var buildCompiler = exports.buildCompiler = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref3) {
    var config = _ref3.config,
        stage = _ref3.stage;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', (0, _webpack2.default)(webpackConfig({ config: config, stage: stage })));

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function buildCompiler(_x) {
    return _ref2.apply(this, arguments);
  };
}();

// Starts the development server


var startDevServer = exports.startDevServer = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee5(_ref5) {
    var _this = this;

    var config = _ref5.config;
    var devCompiler, first, intendedPort, port, host, devServerConfig, timefix, devServer;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return buildCompiler({ config: config, stage: 'dev' });

          case 2:
            devCompiler = _context5.sent;
            first = true;

            // Default to localhost:3000, or use a custom combo if defined in static.config.js
            // or environment variables

            intendedPort = config.devServer && config.devServer.port || process.env.PORT || 3000;
            _context5.next = 7;
            return (0, _utils.findAvailablePort)(Number(intendedPort));

          case 7:
            port = _context5.sent;

            if (intendedPort !== port) {
              console.time(_chalk2.default.red('=> Warning! Port ' + intendedPort + ' is not available. Using port ' + _chalk2.default.green(intendedPort) + ' instead!'));
            }
            host = config.devServer && config.devServer.host || process.env.HOST || 'http://localhost';
            devServerConfig = _extends({
              hot: true,
              disableHostCheck: true,
              contentBase: config.paths.DIST,
              publicPath: '/',
              historyApiFallback: true,
              compress: false,
              quiet: true,
              watchOptions: {
                ignored: /node_modules/
              }
            }, config.devServer, {
              before: function before(app) {
                app.get('/__react-static__/siteProps', function () {
                  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res, next) {
                    var siteProps;
                    return _regenerator2.default.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _context2.prev = 0;
                            _context2.next = 3;
                            return config.getSiteProps({ dev: true });

                          case 3:
                            siteProps = _context2.sent;

                            res.json(siteProps);
                            _context2.next = 11;
                            break;

                          case 7:
                            _context2.prev = 7;
                            _context2.t0 = _context2['catch'](0);

                            res.status(500);
                            next(_context2.t0);

                          case 11:
                          case 'end':
                            return _context2.stop();
                        }
                      }
                    }, _callee2, _this, [[0, 7]]);
                  }));

                  return function (_x3, _x4, _x5) {
                    return _ref6.apply(this, arguments);
                  };
                }());

                app.get('/__react-static__/getRoutes', function () {
                  var _ref7 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res, next) {
                    var routes;
                    return _regenerator2.default.wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            _context4.prev = 0;
                            _context4.next = 3;
                            return config.getRoutes({ dev: true });

                          case 3:
                            routes = _context4.sent;


                            // Once all of the routes have been resolved, listen on individual
                            // route endpoints
                            routes.forEach(function (route) {
                              app.get('/__react-static__/route' + route.path, function () {
                                var _ref8 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res, next) {
                                  var initialProps;
                                  return _regenerator2.default.wrap(function _callee3$(_context3) {
                                    while (1) {
                                      switch (_context3.prev = _context3.next) {
                                        case 0:
                                          _context3.prev = 0;
                                          _context3.next = 3;
                                          return route.getProps({ dev: true });

                                        case 3:
                                          initialProps = _context3.sent;

                                          res.json(initialProps);
                                          _context3.next = 11;
                                          break;

                                        case 7:
                                          _context3.prev = 7;
                                          _context3.t0 = _context3['catch'](0);

                                          res.status(500);
                                          next(_context3.t0);

                                        case 11:
                                        case 'end':
                                          return _context3.stop();
                                      }
                                    }
                                  }, _callee3, _this, [[0, 7]]);
                                }));

                                return function (_x9, _x10, _x11) {
                                  return _ref8.apply(this, arguments);
                                };
                              }());
                            });

                            res.json(routes.filter(function (d) {
                              return d.hasGetProps;
                            }).map(function (d) {
                              return d.path;
                            }));
                            _context4.next = 12;
                            break;

                          case 8:
                            _context4.prev = 8;
                            _context4.t0 = _context4['catch'](0);

                            res.status(500);
                            next(_context4.t0);

                          case 12:
                          case 'end':
                            return _context4.stop();
                        }
                      }
                    }, _callee4, _this, [[0, 8]]);
                  }));

                  return function (_x6, _x7, _x8) {
                    return _ref7.apply(this, arguments);
                  };
                }());

                if (config.devServer && config.devServer.before) {
                  config.devServer.before(app);
                }
              },
              port: port,
              host: host

              /**
               * Corbin Matschull (cgmx) - basedjux@gmail.com
               * Nov 6, 2017
               *
               * HOTFIX FOR ISSUE #124
               * This fix is from: https://github.com/nozzle/react-static/issues/124#issuecomment-342008635
               *
               * This implements a watcher when webpack runs to assign the timefix to {startTime}-
               * -and run the callback.
               *
               * After the devCompiler finishes it removes the timefix by-
               * subtracting {timefix} from {startTime}
               *
               * TODO: Wait for webpack-dev-server to implement a true fix for this.
               */

              // Move startTime from Modulo 10s
            });
            timefix = 11000;

            devCompiler.plugin('watch-run', function (watching, callback) {
              watching.startTime += timefix;
              callback();
            });

            devCompiler.plugin('invalid', function () {
              console.time(_chalk2.default.green('=> [\u2713] Build Complete'));
              console.log('=> Rebuilding...');
            });

            devCompiler.plugin('done', function (stats) {
              var messages = (0, _formatWebpackMessages2.default)(stats.toJson({}, true));
              var isSuccessful = !messages.errors.length && !messages.warnings.length;

              if (isSuccessful) {
                console.timeEnd(_chalk2.default.green('=> [\u2713] Build Complete'));
              }

              if (first) {
                first = false;
                console.log(_chalk2.default.green('=> [\u2713] App serving at'), host + ':' + port);
                stats.startTime -= timefix;
                if (config.onStart) {
                  config.onStart({ devServerConfig: devServerConfig });
                }
              }

              if (messages.errors.length) {
                console.log(_chalk2.default.red('Failed to rebuild.'));
                messages.errors.forEach(function (message) {
                  console.log(message);
                  console.log();
                });
                return;
              }

              if (messages.warnings.length) {
                console.log(_chalk2.default.yellow('Built complete with warnings.'));
                console.log();
                messages.warnings.forEach(function (message) {
                  console.log(message);
                  console.log();
                });
              }
            });

            console.log('=> Building App Bundle...');
            console.time(_chalk2.default.green('=> [\u2713] Build Complete'));

            devServer = new _webpackDevServer2.default(devCompiler, devServerConfig);
            return _context5.abrupt('return', new Promise(function (resolve, reject) {
              devServer.listen(port, function (err) {
                if (err) {
                  return reject(err);
                }
                resolve();
              });
            }));

          case 19:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function startDevServer(_x2) {
    return _ref4.apply(this, arguments);
  };
}();

var buildProductionBundles = exports.buildProductionBundles = function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee6(_ref10) {
    var config = _ref10.config;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            return _context6.abrupt('return', new Promise(function (resolve, reject) {
              (0, _webpack2.default)([webpackConfig({ config: config, stage: 'prod' }), webpackConfig({ config: config, stage: 'node' })]).run(function (err, stats) {
                if (err) {
                  console.log(_chalk2.default.red(err.stack || err));
                  if (err.details) {
                    console.log(_chalk2.default.red(err.details));
                  }
                  return reject(err);
                }

                stats.toJson('verbose');

                var buildErrors = stats.hasErrors();
                var buildWarnings = stats.hasWarnings();

                if (buildErrors || buildWarnings) {
                  console.log(stats.toString({
                    context: config.context,
                    performance: false,
                    hash: false,
                    timings: true,
                    entrypoints: false,
                    chunkOrigins: false,
                    chunkModules: false,
                    colors: true
                  }));
                  if (buildErrors) {
                    console.log(_chalk2.default.red.bold('\n              => There were ERRORS during the ' + stage + ' build stage! :(\n              => Fix them and try again!\n            '));
                  } else if (buildWarnings) {
                    console.log(_chalk2.default.yellow.bold('\n              => There were WARNINGS during the ' + stage + ' build stage!\n            '));
                  }
                }

                var clientStats = stats.toJson().children[0];

                resolve(clientStats);
              });
            }));

          case 1:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function buildProductionBundles(_x12) {
    return _ref9.apply(this, arguments);
  };
}();

exports.webpackConfig = webpackConfig;

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');

var _formatWebpackMessages2 = _interopRequireDefault(_formatWebpackMessages);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _webpackDevServer = require('webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

var _rules = require('./rules');

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /* eslint-disable import/no-dynamic-require, react/no-danger */

// import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware'
//


// Builds a compiler using a stage preset, then allows extension via
// webpackConfigurator
function webpackConfig(_ref) {
  var config = _ref.config,
      stage = _ref.stage;

  var webpackConfig = void 0;
  if (stage === 'dev') {
    webpackConfig = require('./webpack.config.dev').default({ config: config });
  } else if (stage === 'prod') {
    webpackConfig = require('./webpack.config.prod').default({
      config: config
    });
  } else if (stage === 'node') {
    webpackConfig = require('./webpack.config.prod').default({
      config: config,
      isNode: true
    });
  } else {
    throw new Error('A stage is required when building a compiler.');
  }

  var defaultLoaders = (0, _rules.getStagedRules)({ config: config, stage: stage });

  if (config.webpack) {
    var transformers = config.webpack;
    if (!Array.isArray(config.webpack)) {
      transformers = [config.webpack];
    }

    transformers.forEach(function (transformer) {
      var modifiedConfig = transformer(webpackConfig, {
        stage: stage,
        defaultLoaders: defaultLoaders
      });
      if (modifiedConfig) {
        webpackConfig = modifiedConfig;
      }
    });
  }
  config.publicPath = webpackConfig.output.publicPath;
  return webpackConfig;
}

;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(webpackConfig, 'webpackConfig', 'src/webpack/index.js');

  __REACT_HOT_LOADER__.register(buildCompiler, 'buildCompiler', 'src/webpack/index.js');

  __REACT_HOT_LOADER__.register(startDevServer, 'startDevServer', 'src/webpack/index.js');

  __REACT_HOT_LOADER__.register(buildProductionBundles, 'buildProductionBundles', 'src/webpack/index.js');
}();

;