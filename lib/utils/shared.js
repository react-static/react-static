'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _swimmer = require('swimmer');

Object.defineProperty(exports, 'poolAll', {
  enumerable: true,
  get: function get() {
    return _swimmer.poolAll;
  }
});
Object.defineProperty(exports, 'createPool', {
  enumerable: true,
  get: function get() {
    return _swimmer.createPool;
  }
});
exports.pathJoin = pathJoin;
exports.cleanPath = cleanPath;
exports.unwrapArray = unwrapArray;
exports.isObject = isObject;
exports.deprecate = deprecate;
exports.trimSlashes = trimSlashes;
function pathJoin() {
  for (var _len = arguments.length, paths = Array(_len), _key = 0; _key < _len; _key++) {
    paths[_key] = arguments[_key];
  }

  var newPath = paths.map(trimSlashes).join('/');
  if (!newPath || newPath === '/') {
    return '/';
  }
  newPath = trimSlashes(newPath);
  if (newPath.includes('?')) {
    newPath = newPath.substring(0, newPath.indexOf('?'));
  }
  return newPath;
}

function cleanPath(path) {
  // Resolve the local path
  if (!path || path === '/') {
    return '/';
  }
  // Remove origin, hashes, and query params
  if (typeof document !== 'undefined') {
    path = path.replace(window.location.origin, '');
    path = path.replace(/#.*/, '');
    path = path.replace(/\?.*/, '');
  }
  if (process.env.REACT_STATIC_BASEPATH) {
    path = path.replace(new RegExp('^\\/?' + process.env.REACT_STATIC_BASEPATH + '\\/'), '');
  }
  path = path || '/';
  return pathJoin(path);
}

function unwrapArray(arg, defaultValue) {
  arg = Array.isArray(arg) ? arg[0] : arg;
  if (!arg && defaultValue) {
    return defaultValue;
  }
  return arg;
}

function isObject(a) {
  return !Array.isArray(a) && (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object' && a !== null;
}

function deprecate(from, to) {
  console.warn('React-Static deprecation notice: ' + from + ' will be deprecated in favor of ' + to + ' in the next major release.');
}

function trimSlashes(str) {
  return str.replace(/^\/{1,}/g, '').replace(/\/{1,}$/g, '');
}