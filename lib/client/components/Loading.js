'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.withLoading = withLoading;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _methods = require('../methods');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
//


//

var Loading = function (_React$Component) {
  _inherits(Loading, _React$Component);

  function Loading() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Loading);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Loading.__proto__ || Object.getPrototypeOf(Loading)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      loading: _methods.loading
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Loading, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      this.unsubscribe = (0, _methods.onLoading)(function (loading) {
        return _this2.setState({
          loading: loading
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          component = _props.component,
          render = _props.render,
          children = _props.children,
          rest = _objectWithoutProperties(_props, ['component', 'render', 'children']);

      var finalProps = _extends({}, rest, {
        loading: this.state.loading
      });
      if (component) {
        return _react2.default.createElement(component, finalProps, children);
      }
      if (render) {
        return render(finalProps);
      }
      return children(finalProps);
    }
  }]);

  return Loading;
}(_react2.default.Component);

exports.default = Loading;
function withLoading(Comp) {
  return function ConnectedLoading(props) {
    return _react2.default.createElement(Loading, _extends({ component: Comp }, props));
  };
}