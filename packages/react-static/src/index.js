import { removal } from './browser/utils'

// Helmet
export { Helmet as Head } from 'react-helmet'

// React-Static
export * from './browser/'
export { default as scrollTo } from './browser/utils/scrollTo'
export { removal, getRoutePath, getBasePath } from './browser/utils'
export {
  default as RouteData,
  withRouteData,
} from './browser/components/RouteData'
export {
  default as SiteData,
  withSiteData,
} from './browser/components/SiteData'
export { default as Prefetch } from './browser/components/Prefetch'
export { default as Routes } from './browser/components/Routes'
export { default as Root } from './browser/components/Root'

// Migration Hints
export const Loading = () => {
  removal('Loading')
}
export const withLoading = () => {
  removal('withLoading')
}
export const onLoading = () => {
  removal('onLoading')
}
