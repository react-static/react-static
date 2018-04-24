'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _slash = require('slash');

var _slash2 = _interopRequireDefault(_slash);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _default = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref2) {
    var config = _ref2.config;
    var templates, routes, id404, file, dynamicRoutesPath;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            templates = config.templates, routes = config.routes;
            id404 = routes.find(function (route) {
              return route.path === '404';
            }).templateID;
            file = '\n\nimport React, { Component } from \'react\'\nimport { Route } from \'react-router-dom\'\n' + (process.env.NODE_ENV === 'production' ? '\nimport universal, { setHasBabelPlugin } from \'react-universal-component\'\n' : '') + '\nimport { cleanPath } from \'react-static\'\n\n' + (process.env.NODE_ENV === 'production' ? '\n\nsetHasBabelPlugin()\n\nconst universalOptions = {\n  loading: () => null,\n  error: props => {\n    console.error(props.error);\n    return <div>An error occurred loading this page\'s template. More information is available in the console.</div>;\n  },\n}\n\n  ' + templates.map(function (template, index) {
              var templatePath = _path2.default.relative(config.paths.DIST, _path2.default.resolve(config.paths.ROOT, template));
              return 'const t_' + index + ' = universal(import(\'' + (0, _slash2.default)(templatePath) + '\'), universalOptions)';
            }).join('\n') + '\n' : templates.map(function (template, index) {
              var templatePath = _path2.default.relative(config.paths.DIST, _path2.default.resolve(config.paths.ROOT, template));
              return 'import t_' + index + ' from \'' + (0, _slash2.default)(templatePath) + '\'';
            }).join('\n')) + '\n\n// Template Map\nglobal.componentsByTemplateID = global.componentsByTemplateID || [\n  ' + templates.map(function (template, index) {
              return 't_' + index;
            }).join(',\n') + '\n]\n\n// Template Tree\nglobal.templateIDsByPath = global.templateIDsByPath || {\n  \'404\': ' + id404 + '\n}\n\n// Get template for given path\nconst getComponentForPath = path => {\n  path = cleanPath(path)\n  return global.componentsByTemplateID[global.templateIDsByPath[path]]\n}\n\nglobal.reactStaticGetComponentForPath = getComponentForPath\nglobal.reactStaticRegisterTemplateIDForPath = (path, id) => {\n  global.templateIDsByPath[path] = id\n}\n\nexport default class Routes extends Component {\n  render () {\n    const { component: Comp, render, children } = this.props\n\n    const getFullComponentForPath = path => {\n      let Comp = getComponentForPath(path)\n      let is404 = path === \'404\'\n      if (!Comp) {\n        is404 = true\n        Comp = getComponentForPath(\'404\')\n      }\n      return newProps => (\n        Comp\n          ? <Comp {...newProps} {...(is404 ? {is404: true} : {})} />\n          : null\n      )\n    }\n\n    const renderProps = {\n      componentsByTemplateID: global.componentsByTemplateID,\n      templateIDsByPath: global.templateIDsByPath,\n      getComponentForPath: getFullComponentForPath\n    }\n\n    if (Comp) {\n      return (\n        <Comp\n          {...renderProps}\n        />\n      )\n    }\n\n    if (render || children) {\n      return (render || children)(renderProps)\n    }\n\n    // This is the default auto-routing renderer\n    return (\n      <Route path=\'*\' render={props => {\n        let Comp = getFullComponentForPath(props.location.pathname)\n        // If Comp is used as a component here, it triggers React to re-mount the entire\n        // component tree underneath during reconciliation, losing all internal state.\n        // By unwrapping it here we keep the real, static component exposed directly to React.\n        return Comp && Comp({ ...props, key: props.location.pathname })\n      }} />\n    )\n  }\n}\n\n';
            dynamicRoutesPath = _path2.default.join(config.paths.DIST, 'react-static-routes.js');
            _context.next = 6;
            return _fsExtra2.default.remove(dynamicRoutesPath);

          case 6:
            _context.next = 8;
            return _fsExtra2.default.writeFile(dynamicRoutesPath, file);

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function _default(_x) {
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

  reactHotLoader.register(_default, 'default', 'src/static/generateRoutes.js');
  leaveModule(module);
})();

;