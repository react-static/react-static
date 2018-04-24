'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildXMLandRSS = exports.exportRoutes = exports.prepareRoutes = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var buildXMLandRSS = exports.buildXMLandRSS = function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee7(_ref12) {
    var config = _ref12.config;
    var xml, generateXML;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            generateXML = function generateXML(_ref13) {
              var routes = _ref13.routes;

              var xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
              routes.forEach(function (route) {
                if (route.noindex) {
                  return;
                }
                xml += '<url>';
                xml += '<loc>' + (route.permalink + '/').replace(/\/{1,}$/gm, '/') + '</loc>';
                xml += route.lastModified ? '<lastmod>' + route.lastModified + '</lastmod>' : '';
                xml += route.priority ? '<priority>' + route.priority + '</priority>' : '';
                xml += '</url>';
              });
              xml += '</urlset>';
              return xml;
            };

            if (config.siteRoot) {
              _context7.next = 3;
              break;
            }

            return _context7.abrupt('return');

          case 3:
            xml = generateXML({
              routes: config.routes.filter(function (d) {
                return !d.is404;
              }).map(function (route) {
                return _extends({
                  permalink: '' + config.publicPath + (0, _shared.pathJoin)(route.path),
                  lastModified: '',
                  priority: 0.5
                }, route);
              })
            });
            _context7.next = 6;
            return _fsExtra2.default.writeFile(_path2.default.join(config.paths.DIST, 'sitemap.xml'), xml);

          case 6:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function buildXMLandRSS(_x4) {
    return _ref11.apply(this, arguments);
  };
}();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _server = require('react-dom/server');

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _reactHelmet = require('react-helmet');

var _reactHelmet2 = _interopRequireDefault(_reactHelmet);

var _shorthash = require('shorthash');

var _shorthash2 = _interopRequireDefault(_shorthash);

var _reactUniversalComponent = require('react-universal-component');

var _webpackFlushChunks = require('webpack-flush-chunks');

var _webpackFlushChunks2 = _interopRequireDefault(_webpackFlushChunks);

var _progress = require('progress');

var _progress2 = _interopRequireDefault(_progress);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _jsesc = require('jsesc');

var _jsesc2 = _interopRequireDefault(_jsesc);

var _generateRoutes = require('./generateRoutes');

var _generateRoutes2 = _interopRequireDefault(_generateRoutes);

var _RootComponents = require('./RootComponents');

var _shared = require('../utils/shared');

var _Redirect = require('../client/components/Redirect');

var _Redirect2 = _interopRequireDefault(_Redirect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /* eslint-disable import/no-dynamic-require, react/no-danger */

//


var defaultOutputFileRate = 100;

var Bar = function Bar(len, label) {
  return new _progress2.default('=> ' + (label ? label + ' ' : '') + '[:bar] :current/:total :percent :rate/s :etas ', {
    total: len
  });
};

var prepareRoutes = exports.prepareRoutes = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(config, opts) {
    var templates;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return config.getRoutes(opts);

          case 2:
            config.routes = _context.sent;


            process.env.REACT_STATIC_ROUTES_PATH = _path2.default.join(config.paths.DIST, 'react-static-routes.js');

            // Dedupe all templates into an array
            templates = [];


            config.routes.forEach(function (route) {
              if (!route.component) {
                return;
              }
              // Check if the template has already been added
              var index = templates.indexOf(route.component);
              if (index === -1) {
                // If it's new, add it
                templates.push(route.component);
                // Assign the templateID
                route.templateID = templates.length - 1;
              } else {
                // Assign the existing templateID
                route.templateID = index;
              }
            });

            config.templates = templates;

            return _context.abrupt('return', (0, _generateRoutes2.default)({
              config: config
            }));

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function prepareRoutes(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

// Exporting route HTML and JSON happens here. It's a big one.
var exportRoutes = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee6(_ref3) {
    var config = _ref3.config,
        clientStats = _ref3.clientStats;
    var Comp, DocumentTemplate, siteData, seenProps, sharedProps, dataProgress, sharedPropsArr, jsonProgress, htmlProgress, basePath, hrefReplace, srcReplace;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            // Use the node version of the app created with webpack
            Comp = require(_glob2.default.sync(_path2.default.resolve(config.paths.DIST, 'static.*.js'))[0]).default;

            // Retrieve the document template

            DocumentTemplate = config.Document || _RootComponents.DefaultDocument;


            console.log('=> Fetching Site Data...');
            console.time(_chalk2.default.green('=> [\u2713] Site Data Downloaded'));
            // Get the site data
            _context6.next = 6;
            return config.getSiteData({ dev: false });

          case 6:
            siteData = _context6.sent;

            console.timeEnd(_chalk2.default.green('=> [\u2713] Site Data Downloaded'));

            // Set up some scaffolding for automatic data splitting
            seenProps = new Map();
            sharedProps = new Map();


            console.log('=> Fetching Route Data...');
            dataProgress = Bar(config.routes.length);

            console.time(_chalk2.default.green('=> [\u2713] Route Data Downloaded'));

            _context6.next = 15;
            return (0, _shared.poolAll)(config.routes.map(function (route) {
              return _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.t0 = !!route.getData;

                        if (!_context2.t0) {
                          _context2.next = 5;
                          break;
                        }

                        _context2.next = 4;
                        return route.getData({ route: route, dev: false });

                      case 4:
                        _context2.t0 = _context2.sent;

                      case 5:
                        route.allProps = _context2.t0;


                        // Default allProps (must be an object)
                        if (!route.allProps) {
                          route.allProps = {};
                        }

                        // TODO: check if route.allProps is indeed an object

                        // Loop through the props to find shared props between routes
                        // TODO: expose knobs to tweak these settings, perform them manually,
                        // or simply just turn them off.
                        Object.keys(route.allProps).map(function (k) {
                          return route.allProps[k];
                        }).forEach(function (prop) {
                          // Don't split small strings
                          if (typeof prop === 'string' && prop.length < 100) {
                            return;
                          }
                          // Don't split booleans or undefineds
                          if (['boolean', 'number', 'undefined'].includes(typeof prop === 'undefined' ? 'undefined' : _typeof(prop))) {
                            return;
                          }
                          // Should be an array or object at this point
                          // Have we seen this prop before?
                          if (seenProps.get(prop)) {
                            // Only cache each shared prop once
                            if (sharedProps.get(prop)) {
                              return;
                            }
                            // Cache the prop
                            var jsonString = JSON.stringify(prop);
                            sharedProps.set(prop, {
                              jsonString: jsonString,
                              hash: _shorthash2.default.unique(jsonString)
                            });
                          } else {
                            // Mark the prop as seen
                            seenProps.set(prop, true);
                          }
                        });
                        dataProgress.tick();

                      case 9:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, undefined);
              }));
            }), Number(config.outputFileRate) || defaultOutputFileRate);

          case 15:

            console.timeEnd(_chalk2.default.green('=> [\u2713] Route Data Downloaded'));

            console.log('=> Exporting Route Data...');
            console.time(_chalk2.default.green('=> [\u2713] Route Data Exported'));
            _context6.next = 20;
            return (0, _shared.poolAll)(config.routes.map(function (route) {
              return _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        // Loop through the props and build the prop maps
                        route.localProps = {};
                        route.sharedPropsHashes = {};
                        Object.keys(route.allProps).forEach(function (key) {
                          var value = route.allProps[key];
                          var cached = sharedProps.get(value);
                          if (cached) {
                            route.sharedPropsHashes[key] = cached.hash;
                          } else {
                            route.localProps[key] = value;
                          }
                        });

                      case 3:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                }, _callee3, undefined);
              }));
            }), Number(config.outputFileRate) || defaultOutputFileRate);

          case 20:
            console.timeEnd(_chalk2.default.green('=> [\u2713] Route Data Exported'));

            // Write all shared props to file
            sharedPropsArr = Array.from(sharedProps);

            if (!sharedPropsArr.length) {
              _context6.next = 29;
              break;
            }

            console.log('=> Exporting Shared Route Data...');
            jsonProgress = Bar(sharedPropsArr.length);

            console.time(_chalk2.default.green('=> [\u2713] Shared Route Data Exported'));

            _context6.next = 28;
            return (0, _shared.poolAll)(sharedPropsArr.map(function (cachedProp) {
              return _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return _fsExtra2.default.outputFile(_path2.default.join(config.paths.STATIC_DATA, cachedProp[1].hash + '.json'), cachedProp[1].jsonString || '{}');

                      case 2:
                        jsonProgress.tick();

                      case 3:
                      case 'end':
                        return _context4.stop();
                    }
                  }
                }, _callee4, undefined);
              }));
            }), Number(config.outputFileRate) || defaultOutputFileRate);

          case 28:
            console.timeEnd(_chalk2.default.green('=> [\u2713] Shared Route Data Exported'));

          case 29:

            console.log('=> Exporting HTML...');
            htmlProgress = Bar(config.routes.length);

            console.time(_chalk2.default.green('=> [\u2713] HTML Exported'));

            basePath = process.env.REACT_STATIC_STAGING ? config.stagingBasePath : config.basePath;
            hrefReplace = new RegExp('(href=["\'])\\/(' + (basePath ? basePath + '\\/' : '') + ')?([^\\/])', 'gm');
            srcReplace = new RegExp('(src=["\'])\\/(' + (basePath ? basePath + '\\/' : '') + ')?([^\\/])', 'gm');
            _context6.next = 37;
            return (0, _shared.poolAll)(config.routes.map(function (route) {
              return _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
                var sharedPropsHashes, templateID, localProps, allProps, routePath, routeInfo, embeddedRouteInfo, InitialPropsContext, renderMeta, chunkNames, head, clientScripts, clientStyleSheets, clientCss, ClientCssHash, FinalComp, renderToStringAndExtract, appHtml, HtmlWithMeta, HeadWithMeta, BodyWithMeta, DocumentHtml, html, routeInfoFileContent, htmlFilename, routeInfoFilename, res;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        sharedPropsHashes = route.sharedPropsHashes, templateID = route.templateID, localProps = route.localProps, allProps = route.allProps, routePath = route.path;

                        // This routeInfo will be saved to disk. It should only include the
                        // localProps and hashes to construct all of the props later.

                        routeInfo = {
                          path: routePath,
                          templateID: templateID,
                          sharedPropsHashes: sharedPropsHashes,
                          localProps: localProps

                          // This embeddedRouteInfo will be inlined into the HTML for this route.
                          // It should only include the full props, not the partials.
                        };
                        embeddedRouteInfo = _extends({}, routeInfo, {
                          localProps: null,
                          allProps: allProps,
                          siteData: siteData

                          // Inject allProps into static build
                        });

                        InitialPropsContext = function (_Component) {
                          _inherits(InitialPropsContext, _Component);

                          function InitialPropsContext() {
                            _classCallCheck(this, InitialPropsContext);

                            return _possibleConstructorReturn(this, (InitialPropsContext.__proto__ || Object.getPrototypeOf(InitialPropsContext)).apply(this, arguments));
                          }

                          _createClass(InitialPropsContext, [{
                            key: 'getChildContext',
                            value: function getChildContext() {
                              return {
                                routeInfo: embeddedRouteInfo,
                                staticURL: route.path
                              };
                            }
                          }, {
                            key: 'render',
                            value: function render() {
                              return this.props.children;
                            }
                          }, {
                            key: '__reactstandin__regenerateByEval',
                            value: function __reactstandin__regenerateByEval(key, code) {
                              this[key] = eval(code);
                            }
                          }]);

                          return InitialPropsContext;
                        }(_react.Component);

                        // Make a place to collect chunks, meta info and head tags


                        InitialPropsContext.childContextTypes = {
                          routeInfo: _propTypes2.default.object,
                          staticURL: _propTypes2.default.string
                        };
                        renderMeta = {};
                        chunkNames = [];
                        head = {};
                        clientScripts = [];
                        clientStyleSheets = [];
                        clientCss = {};
                        ClientCssHash = void 0;
                        FinalComp = void 0;


                        if (route.redirect) {
                          FinalComp = function FinalComp() {
                            return _react2.default.createElement(_Redirect2.default, { fromPath: route.path, to: route.redirect });
                          };
                        } else {
                          FinalComp = function FinalComp(props) {
                            return _react2.default.createElement(
                              _reactUniversalComponent.ReportChunks,
                              { report: function report(chunkName) {
                                  return chunkNames.push(chunkName);
                                } },
                              _react2.default.createElement(
                                InitialPropsContext,
                                null,
                                _react2.default.createElement(Comp, props)
                              )
                            );
                          };
                        }

                        renderToStringAndExtract = function renderToStringAndExtract(comp) {
                          // Rend the app to string!
                          var appHtml = (0, _server.renderToString)(comp);

                          var _flushChunks = (0, _webpackFlushChunks2.default)(clientStats, {
                            chunkNames: chunkNames,
                            outputPath: config.paths.DIST
                          }),
                              scripts = _flushChunks.scripts,
                              stylesheets = _flushChunks.stylesheets,
                              css = _flushChunks.css,
                              CssHash = _flushChunks.CssHash;

                          clientScripts = scripts;
                          clientStyleSheets = stylesheets;
                          clientCss = css;
                          ClientCssHash = CssHash;

                          // Extract head calls using Helmet synchronously right after renderToString
                          // to not introduce any race conditions in the meta data rendering
                          var helmet = _reactHelmet2.default.renderStatic();
                          head = {
                            htmlProps: helmet.htmlAttributes.toComponent(),
                            bodyProps: helmet.bodyAttributes.toComponent(),
                            base: helmet.base.toComponent(),
                            link: helmet.link.toComponent(),
                            meta: helmet.meta.toComponent(),
                            noscript: helmet.noscript.toComponent(),
                            script: helmet.script.toComponent(),
                            style: helmet.style.toComponent(),
                            title: helmet.title.toComponent()
                          };

                          return appHtml;
                        };

                        appHtml = void 0;
                        _context5.prev = 16;
                        _context5.next = 19;
                        return config.renderToHtml(renderToStringAndExtract, FinalComp, renderMeta, clientStats);

                      case 19:
                        appHtml = _context5.sent;
                        _context5.next = 26;
                        break;

                      case 22:
                        _context5.prev = 22;
                        _context5.t0 = _context5['catch'](16);

                        _context5.t0.message = 'Failed exporting HTML for URL /' + route.path + '/ (' + route.component + '): ' + _context5.t0.message;
                        throw _context5.t0;

                      case 26:

                        // Instead of using the default components, we need to hard code meta
                        // from react-helmet into the components
                        HtmlWithMeta = function HtmlWithMeta(_ref8) {
                          var children = _ref8.children,
                              rest = _objectWithoutProperties(_ref8, ['children']);

                          return _react2.default.createElement(
                            'html',
                            _extends({ lang: 'en' }, head.htmlProps, rest),
                            children
                          );
                        };

                        HeadWithMeta = function HeadWithMeta(_ref9) {
                          var children = _ref9.children,
                              rest = _objectWithoutProperties(_ref9, ['children']);

                          var showHelmetTitle = true;
                          var childrenArray = _react2.default.Children.toArray(children).filter(function (child) {
                            if (child.type === 'title') {
                              // Filter out the title of the Document in static.config.js
                              // if there is a helmet title on this route
                              var helmetTitleIsEmpty = head.title[0].props.children === '';
                              if (!helmetTitleIsEmpty) {
                                return false;
                              }
                              showHelmetTitle = false;
                            }
                            return true;
                          });

                          return _react2.default.createElement(
                            'head',
                            rest,
                            head.base,
                            showHelmetTitle && head.title,
                            head.meta,
                            !route.redirect && clientScripts.map(function (script) {
                              return _react2.default.createElement('link', {
                                key: 'clientScript_' + script,
                                rel: 'preload',
                                as: 'script',
                                href: '' + config.publicPath + script
                              });
                            }),
                            !route.redirect && !config.inlineCss && clientStyleSheets.map(function (styleSheet) {
                              return _react2.default.createElement('link', {
                                key: 'clientStyleSheet_' + styleSheet,
                                rel: 'preload',
                                as: 'style',
                                href: '' + config.publicPath + styleSheet
                              });
                            }),
                            !route.redirect && !config.inlineCss && clientStyleSheets.map(function (styleSheet) {
                              return _react2.default.createElement('link', {
                                key: 'clientStyleSheet_' + styleSheet,
                                rel: 'stylesheet',
                                href: '' + config.publicPath + styleSheet
                              });
                            }),
                            head.link,
                            head.noscript,
                            head.script,
                            config.inlineCss && _react2.default.createElement('style', {
                              key: 'clientCss',
                              type: 'text/css',
                              dangerouslySetInnerHTML: {
                                __html: clientCss.toString().replace(/<style>|<\/style>/gi, '')
                              }
                            }),
                            head.style,
                            childrenArray
                          );
                        };
                        // Not only do we pass react-helmet attributes and the app.js here, but
                        // we also need to  hard code site props and route props into the page to
                        // prevent flashing when react mounts onto the HTML.


                        BodyWithMeta = function BodyWithMeta(_ref10) {
                          var children = _ref10.children,
                              rest = _objectWithoutProperties(_ref10, ['children']);

                          return _react2.default.createElement(
                            'body',
                            _extends({}, head.bodyProps, rest),
                            children,
                            _react2.default.createElement(ClientCssHash, null),
                            !route.redirect && _react2.default.createElement('script', {
                              type: 'text/javascript',
                              dangerouslySetInnerHTML: {
                                __html: '\n                window.__routeInfo = ' + (0, _jsesc2.default)(embeddedRouteInfo, {
                                  es6: false,
                                  isScriptContext: true
                                }).replace(/<(\/)?(script)/gi, '<"+"$1$2') + ';'
                              }
                            }),
                            !route.redirect && clientScripts.map(function (script) {
                              return _react2.default.createElement('script', {
                                key: script,
                                defer: true,
                                type: 'text/javascript',
                                src: '' + config.publicPath + script
                              });
                            })
                          );
                        };

                        DocumentHtml = (0, _server.renderToString)(_react2.default.createElement(
                          DocumentTemplate,
                          {
                            Html: HtmlWithMeta,
                            Head: HeadWithMeta,
                            Body: BodyWithMeta,
                            siteData: siteData,
                            routeInfo: embeddedRouteInfo,
                            renderMeta: renderMeta
                          },
                          _react2.default.createElement('div', { id: 'root', dangerouslySetInnerHTML: { __html: appHtml } })
                        ));

                        // Render the html for the page inside of the base document.

                        html = '<!DOCTYPE html>' + DocumentHtml;
                        routeInfoFileContent = JSON.stringify(routeInfo);

                        // If the siteRoot is set and we're not in staging, prefix all absolute URL's
                        // with the siteRoot

                        html = html.replace(hrefReplace, '$1' + config.publicPath + '$3');
                        html = html.replace(srcReplace, '$1' + config.publicPath + '$3');

                        // If the route is a 404 page, write it directly to 404.html, instead of
                        // inside a directory.
                        htmlFilename = route.is404 ? _path2.default.join(config.paths.DIST, '404.html') : _path2.default.join(config.paths.DIST, route.path, 'index.html');

                        // Make the routeInfo sit right next to its companion html file

                        routeInfoFilename = _path2.default.join(config.paths.DIST, route.path, 'routeInfo.json');
                        _context5.next = 38;
                        return Promise.all([_fsExtra2.default.outputFile(htmlFilename, html), !route.redirect ? _fsExtra2.default.outputFile(routeInfoFilename, routeInfoFileContent) : Promise.resolve()]);

                      case 38:
                        res = _context5.sent;

                        htmlProgress.tick();
                        return _context5.abrupt('return', res);

                      case 41:
                      case 'end':
                        return _context5.stop();
                    }
                  }
                }, _callee5, undefined, [[16, 22]]);
              }));
            }), Number(config.outputFileRate) || defaultOutputFileRate);

          case 37:
            console.timeEnd(_chalk2.default.green('=> [\u2713] HTML Exported'));

          case 38:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function exportRoutes(_x3) {
    return _ref2.apply(this, arguments);
  };
}();

exports.exportRoutes = exportRoutes;
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(defaultOutputFileRate, 'defaultOutputFileRate', 'src/static/index.js');
  reactHotLoader.register(Bar, 'Bar', 'src/static/index.js');
  reactHotLoader.register(prepareRoutes, 'prepareRoutes', 'src/static/index.js');
  reactHotLoader.register(exportRoutes, 'exportRoutes', 'src/static/index.js');
  reactHotLoader.register(buildXMLandRSS, 'buildXMLandRSS', 'src/static/index.js');
  leaveModule(module);
})();

;