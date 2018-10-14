'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createIndexFilePlaceholder = exports.findAvailablePort = exports.ChalkColor = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var createIndexFilePlaceholder = exports.createIndexFilePlaceholder = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref2) {
    var config = _ref2.config,
        Component = _ref2.Component,
        siteData = _ref2.siteData;
    var DocumentHtml, html;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // Render the base document component to string with siteprops
            DocumentHtml = (0, _server.renderToString)(_react2.default.createElement(
              Component,
              { renderMeta: {}, Html: _RootComponents.Html, Head: _RootComponents.Head, Body: _RootComponents.Body, siteData: siteData },
              _react2.default.createElement('div', { id: 'root' })
            ));
            html = '<!DOCTYPE html>' + DocumentHtml;

            // Write the Document to index.html

            _context.next = 4;
            return _fsExtra2.default.outputFile(config.paths.HTML_TEMPLATE, html);

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function createIndexFilePlaceholder(_x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.copyPublicFolder = copyPublicFolder;
exports.isArray = isArray;
exports.isObject = isObject;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _openport = require('openport');

var _openport2 = _interopRequireDefault(_openport);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _RootComponents = require('../static/RootComponents');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /* eslint-disable import/no-dynamic-require, react/no-danger */

//


//

var ChalkColor = exports.ChalkColor = {
  yarn: '#2c8ebb',
  npm: '#cb3837'
};

var findAvailablePort = exports.findAvailablePort = function findAvailablePort(start) {
  var avoid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return new Promise(function (resolve, reject) {
    return _openport2.default.find({
      startingPort: start,
      endingPort: start + 1000,
      avoid: avoid
    }, function (err, port) {
      if (err) {
        return reject(err);
      }
      resolve(port);
    });
  });
};

function copyPublicFolder(config) {
  _fsExtra2.default.ensureDirSync(config.paths.PUBLIC);

  _fsExtra2.default.copySync(config.paths.PUBLIC, config.paths.DIST, {
    dereference: true,
    filter: function filter(file) {
      return file !== config.paths.INDEX;
    }
  });
}

function isArray(a) {
  return Array.isArray(a);
}

function isObject(a) {
  return !Array.isArray(a) && (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object' && a !== null;
}