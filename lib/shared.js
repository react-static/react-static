'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pathJoin = pathJoin;
function pathJoin() {
  for (var _len = arguments.length, paths = Array(_len), _key = 0; _key < _len; _key++) {
    paths[_key] = arguments[_key];
  }

  var newPath = ('' + paths.join('/')).replace(/\/{2,}/g, '/');
  if (newPath !== '/') {
    newPath = newPath.replace(/\/$/g, '');
  }
  return newPath;
}
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(pathJoin, 'pathJoin', 'src/shared.js');
}();

;