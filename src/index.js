import { deprecate } from './utils/shared'
import { withRouteData, withSiteData } from './client/methods'

//

// React Router Components
export { Prompt, Redirect, Route, Switch, matchPath, withRouter } from 'react-router-dom'

// Helmet
export { Helmet as Head } from 'react-helmet'

// React-Static Components
export RouteData, { withRouteData } from './client/components/RouteData'
export SiteData, { withSiteData } from './client/components/SiteData'
export Loading, { withLoading } from './client/components/Loading'
export Prefetch from './client/components/Prefetch'
export PrefetchWhenSeen from './client/components/PrefetchWhenSeen'
export Router from './client/components/Router'
export { NavLink, Link } from './client/components/Link'

// Methods
export { prefetch, onLoading } from './client/methods'

// Public Utils
export scrollTo from './utils/scrollTo'

// Private Utils
export { cleanPath } from './utils/shared'

// Deprecations
export const getRouteProps = (...args) => {
  deprecate('getRouteProps', 'withRouteData')
  return withRouteData(...args)
}
export const getSiteData = (...args) => {
  deprecate('getSiteData', 'withSiteData')
  return withSiteData(...args)
}
