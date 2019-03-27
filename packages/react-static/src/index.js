// Helmet
export { Helmet as Head } from 'react-helmet'

// React-Static
export { Root } from './browser/components/Root'
export { Routes } from './browser/components/Routes'
export { useRouteData } from './browser/hooks/useRouteData'
export { useSiteData } from './browser/hooks/useSiteData'
export { usePrefetch } from './browser/hooks/usePrefetch'
export { useScroller } from './browser/hooks/useScroller'
export { useRoutePath } from './browser/hooks/useRoutePath'
export { useStaticInfo } from './browser/hooks/useStaticInfo'
export { useLocation } from './browser/hooks/useLocation'
export { useBasepath } from './browser/hooks/useBasepath'
export {
  addPrefetchExcludes,
  getRouteInfo,
  isPrefetchableRoute,
  onReloadClientData,
  onReloadTemplates,
  pluginHooks,
  plugins,
  prefetch,
  prefetchData,
  prefetchTemplate,
  registerPlugins,
  registerTemplateForPath,
  registerTemplates,
  routeErrorByPath,
  routeInfoByPath,
  sharedDataByHash,
  templateErrorByPath,
  templates,
  templatesByPath,
} from './browser/'

// Utils
export { getRoutePath, makePathAbsolute, pathJoin } from './browser/utils'
export { default as scrollTo } from './browser/utils/scrollTo'
