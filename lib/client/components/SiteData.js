'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.withSiteData = withSiteData;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _DevSpinner = require('./DevSpinner');

var _DevSpinner2 = _interopRequireDefault(_DevSpinner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
//


//

var siteDataPromise = void 0;

var SiteData = function (_React$Component) {
  _inherits(SiteData, _React$Component);

  function SiteData() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, SiteData);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = SiteData.__proto__ || Object.getPrototypeOf(SiteData)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      siteData: false
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(SiteData, [{
    key: 'componentWillMount',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var _ref3, siteData;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(process.env.REACT_STATIC_ENV === 'development')) {
                  _context.next = 8;
                  break;
                }

                _context.next = 3;
                return function () {
                  if (siteDataPromise) {
                    return siteDataPromise;
                  }
                  siteDataPromise = _axios2.default.get('/__react-static__/siteData');
                  return siteDataPromise;
                }();

              case 3:
                _ref3 = _context.sent;
                siteData = _ref3.data;

                if (!this.unmounting) {
                  _context.next = 7;
                  break;
                }

                return _context.abrupt('return');

              case 7:
                this.setState({
                  siteData: siteData
                });

              case 8:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function componentWillMount() {
        return _ref2.apply(this, arguments);
      }

      return componentWillMount;
    }()
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.unmounting = true;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          component = _props.component,
          render = _props.render,
          children = _props.children,
          rest = _objectWithoutProperties(_props, ['component', 'render', 'children']);

      var siteData = void 0;

      // Get siteInfo from window
      if (typeof window !== 'undefined') {
        if (window.__routeInfo) {
          siteData = window.__routeInfo.siteData;
        }
      }

      // Get siteInfo from context (SSR)
      if (!siteData && this.context.routeInfo && this.context.routeInfo.siteData) {
        siteData = this.context.routeInfo && this.context.routeInfo.siteData;
      }

      // Get siteInfo from request
      if (!siteData && this.state.siteData) {
        siteData = this.state.siteData;
      }

      if (!siteData) {
        if (process.env.REACT_STATIC_ENV === 'development') {
          return _react2.default.createElement(_DevSpinner2.default, null);
        }
        return null;
      }

      var finalProps = _extends({}, rest, siteData);
      if (component) {
        return _react2.default.createElement(component, finalProps, children);
      }
      if (render) {
        return render(finalProps);
      }
      return children(finalProps);
    }
  }]);

  return SiteData;
}(_react2.default.Component);

SiteData.contextTypes = {
  routeInfo: _propTypes2.default.object
};
exports.default = SiteData;
function withSiteData(Comp) {
  return function ConnectedSiteData(props) {
    return _react2.default.createElement(SiteData, _extends({ component: Comp }, props));
  };
}