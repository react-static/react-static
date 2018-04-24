'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _raf = require('raf');

var _raf2 = _interopRequireDefault(_raf);

var _shared = require('../../utils/shared');

var _scrollTo = require('../../utils/scrollTo');

var _scrollTo2 = _interopRequireDefault(_scrollTo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
//


var RouterScroller = (0, _reactRouterDom.withRouter)(function (_React$Component) {
  _inherits(RouterScroller, _React$Component);

  function RouterScroller() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, RouterScroller);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = RouterScroller.__proto__ || Object.getPrototypeOf(RouterScroller)).call.apply(_ref, [this].concat(args))), _this), _this.scrollToTop = function () {
      var _this$props = _this.props,
          autoScrollToTop = _this$props.autoScrollToTop,
          scrollToTopDuration = _this$props.scrollToTopDuration;

      if (autoScrollToTop) {
        (0, _scrollTo2.default)(0, {
          duration: scrollToTopDuration
        });
      }
    }, _this.scrollToHash = function () {
      var _this$props2 = _this.props,
          scrollToHashDuration = _this$props2.scrollToHashDuration,
          autoScrollToHash = _this$props2.autoScrollToHash,
          scrollToHashOffset = _this$props2.scrollToHashOffset,
          hash = _this$props2.location.hash;

      if (!autoScrollToHash) {
        return;
      }
      if (hash) {
        var resolvedHash = hash.substring(1);
        if (resolvedHash) {
          // We must attempt to scroll synchronously or we risk the browser scrolling for us
          var element = document.getElementById(resolvedHash);
          if (element !== null) {
            (0, _scrollTo2.default)(element, {
              duration: scrollToHashDuration,
              offset: scrollToHashOffset
            });
          } else {
            (0, _raf2.default)(function () {
              var element = document.getElementById(resolvedHash);
              if (element !== null) {
                (0, _scrollTo2.default)(element, {
                  duration: scrollToHashDuration,
                  offset: scrollToHashOffset
                });
              }
            });
          }
        }
      } else {
        (0, _scrollTo2.default)(0, {
          duration: scrollToHashDuration
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(RouterScroller, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.scrollToHash();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prev) {
      if (prev.location.pathname !== this.props.location.pathname && !this.props.location.hash) {
        if (window.__noScrollTo) {
          window.__noScrollTo = false;
          return;
        }
        this.scrollToTop();
        return;
      }
      if (prev.location.hash !== this.props.location.hash) {
        this.scrollToHash();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return (0, _shared.unwrapArray)(this.props.children);
    }
  }, {
    key: '__reactstandin__regenerateByEval',
    value: function __reactstandin__regenerateByEval(key, code) {
      this[key] = eval(code);
    }
  }]);

  return RouterScroller;
}(_react2.default.Component));

var _default = RouterScroller;
exports.default = _default;
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(RouterScroller, 'RouterScroller', 'src/client/components/RouterScroller.js');
  reactHotLoader.register(_default, 'default', 'src/client/components/RouterScroller.js');
  leaveModule(module);
})();

;