import { deprecate } from './utils/shared'
import { withRouteData, withSiteData } from './client/methods'

//

// React Router Components
export { Prompt, Route, Switch, matchPath, withRouter } from 'react-router-dom'

// Helmet
export { Helmet as Head } from 'react-helmet'

// React-Static Components
export {
  default as RouteData,
  withRouteData,
} from './client/components/RouteData'
export { default as SiteData, withSiteData } from './client/components/SiteData'
export { default as Loading, withLoading } from './client/components/Loading'
export { default as Prefetch } from './client/components/Prefetch'
export {
  default as PrefetchWhenSeen,
} from './client/components/PrefetchWhenSeen'
export { default as Router } from './client/components/Router'
export { default as Redirect } from './client/components/Redirect'
export { NavLink, Link } from './client/components/Link'

// Methods
export { prefetch, onLoading } from './client/methods'

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
