import { deprecate } from './utils/shared'
import { withRouteData, withSiteData } from './browser/'

//

// React Router Components
export { Prompt, Route, Switch, matchPath, withRouter } from 'react-router-dom'

// Helmet
export { Helmet as Head } from 'react-helmet'

// React-Static Components
export {
  default as RouteData,
  withRouteData,
} from './browser/components/RouteData'
export {
  default as SiteData,
  withSiteData,
} from './browser/components/SiteData'
export { default as Loading, withLoading } from './browser/components/Loading'
export { default as Prefetch } from './browser/components/Prefetch'
export {
  default as PrefetchWhenSeen,
} from './browser/components/PrefetchWhenSeen'
export { default as Router } from './browser/components/Router'
export { default as Redirect } from './browser/components/Redirect'
export { NavLink, Link } from './browser/components/Link'

// Methods
export { prefetch, onLoading } from './browser/'

// Public Utils
export { default as scrollTo } from './utils/scrollTo'

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
