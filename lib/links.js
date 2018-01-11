'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Link = Link;
exports.NavLink = NavLink;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isRoutingUrl(to) {
  if (typeof to !== 'string') return true;
  return !to.match(/^#/) && !to.match(/^[a-z]{1,10}:\/\//) && !to.match(/^(data|mailto):/) && !to.match(/^\/\//);
}

var reactRouterProps = ['activeClassName', 'activeStyle', 'exact', 'isActive', 'location', 'strict', 'to', 'replace'];

function domLinkProps(props) {
  var result = Object.assign({}, props);

  result.href = result.to;
  result.to = undefined;

  reactRouterProps.filter(function (prop) {
    return result[prop];
  }).forEach(function (prop) {
    console.warn('Warning: ' + prop + ' makes no sense on a <Link to="' + props.to + '">.');
  });
  reactRouterProps.forEach(function (prop) {
    return delete result[prop];
  });

  return result;
}

function Link(props) {
  if (isRoutingUrl(props.to)) return _react2.default.createElement(_reactRouterDom.Link, props);
  return _react2.default.createElement(
    'a',
    domLinkProps(props),
    props.children
  );
}

function NavLink(props) {
  if (isRoutingUrl(props.to)) return _react2.default.createElement(_reactRouterDom.NavLink, props);
  return _react2.default.createElement(
    'a',
    domLinkProps(props),
    props.children
  );
}
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(isRoutingUrl, 'isRoutingUrl', 'src/links.js');

  __REACT_HOT_LOADER__.register(reactRouterProps, 'reactRouterProps', 'src/links.js');

  __REACT_HOT_LOADER__.register(domLinkProps, 'domLinkProps', 'src/links.js');

  __REACT_HOT_LOADER__.register(Link, 'Link', 'src/links.js');

  __REACT_HOT_LOADER__.register(NavLink, 'NavLink', 'src/links.js');
}();

;