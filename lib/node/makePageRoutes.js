'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = makePageRoutes;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function makePageRoutes(_ref) {
  var items = _ref.items,
      pageSize = _ref.pageSize,
      _ref$pageToken = _ref.pageToken,
      pageToken = _ref$pageToken === undefined ? 'page' : _ref$pageToken,
      route = _ref.route,
      decorate = _ref.decorate;

  var itemsCopy = [].concat(_toConsumableArray(items)); // Make a copy of the items
  var pages = []; // Make an array for all of the different pages

  while (itemsCopy.length) {
    // Splice out all of the items into separate pages using a set pageSize
    pages.push(itemsCopy.splice(0, pageSize));
  }

  var totalPages = pages.length;

  // Move the first page out of pagination. This is so page one doesn't require a page number.
  var firstPage = pages[0];

  var routes = [_extends({}, route, decorate(firstPage, 1, totalPages))].concat(_toConsumableArray(pages.map(function (page, i) {
    return _extends({}, route, { // route defaults
      path: route.path + '/' + pageToken + '/' + (i + 1)
    }, decorate(page, i + 1, totalPages));
  })));

  return routes;
}