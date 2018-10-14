'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSiteData = exports.getRouteProps = exports.cleanPath = exports.scrollTo = exports.onLoading = exports.prefetch = exports.Link = exports.NavLink = exports.Redirect = exports.Router = exports.PrefetchWhenSeen = exports.Prefetch = exports.withLoading = exports.Loading = exports.withSiteData = exports.SiteData = exports.withRouteData = exports.RouteData = exports.Head = exports.withRouter = exports.matchPath = exports.Switch = exports.Route = exports.Prompt = undefined;

var _reactRouterDom = require('react-router-dom');

Object.defineProperty(exports, 'Prompt', {
  enumerable: true,
  get: function get() {
    return _reactRouterDom.Prompt;
  }
});
Object.defineProperty(exports, 'Route', {
  enumerable: true,
  get: function get() {
    return _reactRouterDom.Route;
  }
});
Object.defineProperty(exports, 'Switch', {
  enumerable: true,
  get: function get() {
    return _reactRouterDom.Switch;
  }
});
Object.defineProperty(exports, 'matchPath', {
  enumerable: true,
  get: function get() {
    return _reactRouterDom.matchPath;
  }
});
Object.defineProperty(exports, 'withRouter', {
  enumerable: true,
  get: function get() {
    return _reactRouterDom.withRouter;
  }
});

var _reactHelmet = require('react-helmet');

Object.defineProperty(exports, 'Head', {
  enumerable: true,
  get: function get() {
    return _reactHelmet.Helmet;
  }
});

var _RouteData2 = require('./client/components/RouteData');

Object.defineProperty(exports, 'withRouteData', {
  enumerable: true,
  get: function get() {
    return _RouteData2.withRouteData;
  }
});

var _SiteData2 = require('./client/components/SiteData');

Object.defineProperty(exports, 'withSiteData', {
  enumerable: true,
  get: function get() {
    return _SiteData2.withSiteData;
  }
});

var _Loading2 = require('./client/components/Loading');

Object.defineProperty(exports, 'withLoading', {
  enumerable: true,
  get: function get() {
    return _Loading2.withLoading;
  }
});

var _Link = require('./client/components/Link');

Object.defineProperty(exports, 'NavLink', {
  enumerable: true,
  get: function get() {
    return _Link.NavLink;
  }
});
Object.defineProperty(exports, 'Link', {
  enumerable: true,
  get: function get() {
    return _Link.Link;
  }
});

var _methods = require('./client/methods');

Object.defineProperty(exports, 'prefetch', {
  enumerable: true,
  get: function get() {
    return _methods.prefetch;
  }
});
Object.defineProperty(exports, 'onLoading', {
  enumerable: true,
  get: function get() {
    return _methods.onLoading;
  }
});

var _shared = require('./utils/shared');

Object.defineProperty(exports, 'cleanPath', {
  enumerable: true,
  get: function get() {
    return _shared.cleanPath;
  }
});

var _RouteData3 = _interopRequireDefault(_RouteData2);

var _SiteData3 = _interopRequireDefault(_SiteData2);

var _Loading3 = _interopRequireDefault(_Loading2);

var _Prefetch2 = require('./client/components/Prefetch');

var _Prefetch3 = _interopRequireDefault(_Prefetch2);

var _PrefetchWhenSeen2 = require('./client/components/PrefetchWhenSeen');

var _PrefetchWhenSeen3 = _interopRequireDefault(_PrefetchWhenSeen2);

var _Router2 = require('./client/components/Router');

var _Router3 = _interopRequireDefault(_Router2);

var _Redirect2 = require('./client/components/Redirect');

var _Redirect3 = _interopRequireDefault(_Redirect2);

var _scrollTo2 = require('./utils/scrollTo');

var _scrollTo3 = _interopRequireDefault(_scrollTo2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.RouteData = _RouteData3.default;

// React-Static Components

exports.SiteData = _SiteData3.default;
exports.Loading = _Loading3.default;
exports.Prefetch = _Prefetch3.default;
exports.PrefetchWhenSeen = _PrefetchWhenSeen3.default;
exports.Router = _Router3.default;
exports.Redirect = _Redirect3.default;

// Public Utils

exports.scrollTo = _scrollTo3.default;

// Private Utils

// Deprecations
var getRouteProps = exports.getRouteProps = function getRouteProps() {
  (0, _shared.deprecate)('getRouteProps', 'withRouteData');
  return _methods.withRouteData.apply(undefined, arguments);
};
var getSiteData = exports.getSiteData = function getSiteData() {
  (0, _shared.deprecate)('getSiteData', 'withSiteData');
  return _methods.withSiteData.apply(undefined, arguments);
};