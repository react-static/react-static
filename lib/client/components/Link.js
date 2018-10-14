'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NavLink = exports.Link = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _shared = require('../../utils/shared');

var _PrefetchWhenSeen = require('./PrefetchWhenSeen');

var _PrefetchWhenSeen2 = _interopRequireDefault(_PrefetchWhenSeen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
//


//

// Detects internal link url schemas
function isRoutingUrl(to) {
  if (typeof to === 'undefined') return false;
  return !to.match(/^([A-z]?)+:/) && // starts with external protocol
  !to.match(/^#/) && // starts with hash fragment
  !to.match(/^[a-z]{1,10}:\/\//) // starts with double slash protocol
  ;
}

var reactRouterProps = ['activeClassName', 'activeStyle', 'exact', 'isActive', 'location', 'strict', 'to', 'replace'];

function SmartLink(_ref) {
  var _ref$prefetch = _ref.prefetch,
      prefetch = _ref$prefetch === undefined ? true : _ref$prefetch,
      _ref$scrollToTop = _ref.scrollToTop,
      scrollToTop = _ref$scrollToTop === undefined ? true : _ref$scrollToTop,
      _onClick = _ref.onClick,
      rest = _objectWithoutProperties(_ref, ['prefetch', 'scrollToTop', 'onClick']);

  var to = rest.to;

  var resolvedTo = to;
  if ((0, _shared.isObject)(to)) {
    if (!to.pathname && to.path) {
      console.warn('You are using the `path` key in a <Link to={...} /> when you should be using the `pathname` key. This will be deprecated in future versions!');
      to.pathname = to.path;
      delete to.path;
      resolvedTo = to.pathname;
    } else if (to.pathname) {
      resolvedTo = to.pathname;
    }
  }
  // Router Link
  if (isRoutingUrl(resolvedTo)) {
    var finalRest = _extends({}, rest, {
      onClick: function onClick(e) {
        if (typeof document !== 'undefined' && !scrollToTop) {
          window.__noScrollTo = true;
        }
        if (_onClick) {
          _onClick(e);
        }
      }
    });

    if (prefetch) {
      return _react2.default.createElement(_PrefetchWhenSeen2.default, {
        path: resolvedTo,
        type: prefetch,
        render: function render(_ref2) {
          var handleRef = _ref2.handleRef;
          return _react2.default.createElement(_reactRouterDom.NavLink, _extends({}, finalRest, { innerRef: handleRef }));
        }
      });
    }
    return _react2.default.createElement(_reactRouterDom.NavLink, finalRest);
  }

  // Browser Link

  var children = rest.children,
      aRest = _objectWithoutProperties(rest, ['children']);

  aRest.href = aRest.to;
  delete aRest.to;

  reactRouterProps.filter(function (prop) {
    return aRest[prop];
  }).forEach(function (prop) {
    console.warn('Warning: ' + prop + ' makes no sense on a <Link to="' + aRest.href + '">.');
  });
  reactRouterProps.forEach(function (prop) {
    return delete aRest[prop];
  });

  return _react2.default.createElement(
    'a',
    aRest,
    children
  );
}

var Link = exports.Link = SmartLink;
var NavLink = exports.NavLink = SmartLink;