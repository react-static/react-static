'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _ErrorCatcher = require('./ErrorCatcher');

var _ErrorCatcher2 = _interopRequireDefault(_ErrorCatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ErrorWrapper = function ErrorWrapper(_ref) {
  var showErrorsInProduction = _ref.showErrorsInProduction,
      children = _ref.children;

  if (process.env.REACT_STATIC_ENV === 'development' || showErrorsInProduction) {
    return _react2.default.createElement(
      _ErrorCatcher2.default,
      null,
      children
    );
  }

  return _react2.default.Children.only(children);
};

ErrorWrapper.propTypes = {
  showErrorsInProduction: _propTypes2.default.bool,
  children: _propTypes2.default.node.isRequired
};

ErrorWrapper.defaultProps = {
  showErrorsInProduction: false
};

exports.default = ErrorWrapper;