// Type definitions for react-static 7.1.0
// Project: https://github.com/react-static/react-static
// Definitions by: Various Contributors https://github.com/react-static/react-static/blame/master/packages/react-static/src/index.d.ts
//
// VERY lightly maintained, we need all the help we can get

import * as React from 'react';

import { Configuration as WebpackDevServerConfig } from 'webpack-dev-server';
import { RenderFn } from 'create-react-context';

export { Helmet as Head } from 'react-helmet'

interface StaticInfo<T extends object> {
  path: string
  siteData: T
}

interface RoutesRenderProp {
  routePath: string
  getComponentForPath(pathname: string): React.ReactNode | false
}

interface RouteDataProps<T extends object> {
  children: (routeData: T) => React.ReactNode
}

interface SiteDataProps<T extends object> {
  children: (siteData: T) => React.ReactNode
}

/**
 * Hook to get the Route Data for the current route
 *
 * Via `React.Suspense`, the `useRouteData` hook asynchronously provides the
 * results of a routes's `getData` as defined in your `static.config.js`
 *
 * @see Route
 * @see Routes
 * @see routePathContext
 *
 * This will match the `getData()` result from `Route` and
 * only works if it is called in a child of `routePathContext.Provider`, which
 * is always the case in a child of the `Routes` component:
 * - any template/container (the `template` key in `Route`)
 * - any page via the react-static-plugin-source-filesystem
 * - if you manually wrap a component with `<routePathContext.Provider>`
 *
 * Alternatives include the `RouteData` component and the `withRouteData` HOC.
 *
 * @example Getting the route data inside a container (`template`)
 *
 *   function PostContainer(): JSX.Element {
 *     const postData = useRouteData<RouteData>()
 *     // => { the post data }
 *   }
 *
 * @example Getting the route data _oustide_ the container / page / `Routes`
 *
 *   // This needs additional code to work properly in production, because there
 *   // the useStaticInfo must be used to "hydrate" this data as Suspending is
 *   // not allowed in production.
 *
 *   // You might just want to use `render` prop in `Routes` instead.
 *
 *   function Outside(): JSX.Element {
 *     const currentPath = getRoutePath(location.pathName)
 *     return <routePathContext.Provider value={currentPath}>
 *      {childThatCallsUseRouteData}
 *     </routePathContext.Provider>
 *   }
 *
 * @returns {T} the route data
 */
export function useRouteData<T extends object = any>(): T;

/**
 * Hook to get the Site Data
 *
 * Via `React.Suspense`, the `useSiteData` hook asynchronously provides the
 * results of the `getSiteData` function as defined in your `static.config.js`.
 *
 * @see ReactStaticConfig
 *
 * Alternatives include the `SiteData` component and the `withSiteData` HOC.
 *
 * @template T the type of the site data
 * @returns {T} the side data
 */
export function useSiteData<T extends object = any>(): T;

/**
 * Hook to prefetch a path as soon as the linked ref becomes visible.
 *
 * @param {string} path the path to pre-fetch
 * @param {React.Ref} [ref]
 * @returns {React.Ref} returns the prefetch-ref
 *
 * The `usePrefetch` hook binds the prefetching of a specific path's assets to
 * the visibility of an element. When the ref's element becomes visible in the
 * viewport, the template and data required to render the route for the `path`
 * will be prefetched.
 *
 * @example Using the prefetch hook to prefetch a link
 *
 *   import { useRef } from 'react'
 *   import { usePrefetch } from 'react-static'
 *   export default () => {
 *     // Use it to create a ref
 *     const myRef = usePrefetch('/blog')
 *
 *     // or pass your own ref
 *     const myRef = useRef()
 *     usePrefetch('./blog', myRef)
 *
 *     return (<Link to="/blog" ref={myRef}>Go to blog</Link>)
 *   }
 *
 */
export function usePrefetch<T extends object = any>(
  path: string,
  ref?: React.MutableRefObject<T>
): React.MutableRefObject<T>;

/**
 * Hook to get the current Location object (or `undefined` on the first render)
 *
 * Makes a component rerender each time the `Location` changes.
 *
 * @returns {(Location | undefined)} the current location
 */
export function useLocation(): Location | undefined

/**
 * Hook to get the mounted base path
 *
 * @returns {string} empty string when REACT_STATIC_DISABLE_ROUTE_PREFIXING
 *  is true, REACT_STATIC_BASE_PATH otherwise.
 */
export function useBasepath(): string;

/**
 * Primarily used during the build process and to hydrate the app from static
 * data. You probably don't need this when writing your app using `react-static`
 *
 * @template T the siteData
 * @returns {(StaticInfo<T> | undefined)} the static info, if any
 */
export function useStaticInfo<T extends object = any>(): StaticInfo<T> | undefined;

/**
 * Hook to **clean** a route path. Returns the context value if inside a context
 * or sanitizes via `getRoutePath` otherwise.
 *
 * @param {string} routePath
 * @returns {string}
 *
 * Once a routePath goes into the `Routes` component, `useRoutePath` must ALWAYS
 * return the `routePath` used in its parent, so the `Routes` component always
 * passes it down inside a context
 *
 * @see getRoutePath
 * @see routePathContext
 */
export function useRoutePath(routePath: string): string;

/**
 * Context to provide the current route path.
 *
 * This is used in the `Routes` component and provides the route path to
 * `useRoutePath`. If you want to use that hook outside of the `Routes`
 * component, e.g. a sidebar, you can use this context's Provider to pass the
 * current route down.
 *
 * @see useRouteData
 * @see useRoutePath
 *
 * The `useRouteData` hook has an example how to do this properly.
 */
export const routePathContext: React.Context<string>;

/**
 * HOC that passes the `routeData` as a prop to the wrapped `Component`
 *
 * @see useRouteData
 *
 * @template T type of the routeData
 * @template P type of the props of the original `Component`
 * @template S type of the state of the original `Component`
 *
 * @param {React.ComponentType<P>} Comp the component to wrap
 * @returns {(React.ComponentClass<P & { routeData: T }, S>)} tbe wrapped component
 */
export function withRouteData<T extends object = any, P extends object = {}, S extends object = {}>(
  Comp: React.ComponentType<P>
):  React.ComponentClass<P & { routeData: T }, S>;

/**
 * Component with a render function prop as children, which receives the current
 * `routeData` as its only argument.
 *
 * @see useRouteData
 *
 * @template T type of the routedata
 * @param {{ children: (routeData: T) => React.ReactNode }} props
 * @returns {React.ReactNode}
 */
export function RouteData<T extends object = any>(
  props: RouteDataProps<T>
): React.ReactNode

/**
 * HOC that passes the `siteData` as a prop to the wrapped `Component`
 *
 * @see useSiteData
 *
 * @template T type of the siteData
 * @template P type of the props of the original `Component`
 * @template S type of the state of the original `Component`
 *
 * @param {React.ComponentType<P>} Comp the component to wrap
 * @returns {(React.ComponentClass<P & { siteData: T }, S>)} tbe wrapped component
 */
export function withSiteData<T extends object = any, P extends object = {}, S extends object = {}>(
  Comp: React.ComponentType<P>
):  React.ComponentClass<P & { routeData: T }, S>;

/**
 * Component with a render function prop as children, which receives the current
 * `siteData` as its only argument.
 *
 * @see useSiteData
 *
 * @template T type of the routedata
 * @param {{ children: (siteData: T) => React.ReactNode }} props
 * @returns {React.ReactNode}
 */
export function SiteData<T extends object = any>(
  props: SiteDataProps<T>
): React.ReactNode

/**
 * The root component for a `react-static` app
 */
export class Root extends React.Component {}

/**
 * Routes component to render all routes
 *
 * React Static handles all of your routing for you using a router under the
 * hood. All you need to do is import `Routes` and specify where you want to
 * render them. (see first example).
 *
 * Occasionally, you may need to render the automatic `<Routes>` component in a
 * custom way. The most common use-case is illustrated in the animated-routes
 * example transitions. To do this, utilize a render prop. (see second example).
 *
 * @example handle all the routes in `react-static`
 *
 *   import { Root, Routes } from 'react-static'
 *   export default () => (<Root>
 *     <Router>
 *        <Routes path="*" />
 *     </Router>
 *   </Root>)
 *
 * @example handle the routes manually
 *
 *   export default () => (<Root>
 *     <Routes>
 *       {({ routePath, getComponentForPath }) => {
 *         // The pathname is used to retrieve the component for that path
 *         let Comp = getComponentForPath(routePath)
 *         // The component is rendered!
 *         return <Comp />
 *       }}
 *     </Routes>
 *  </Root>)
 *
 */
export class Routes extends React.Component<{
  path?: string,
  default?: boolean,
  render?: (props: RoutesRenderProp) => React.ReactNode
}> {}

// Export all from the browser types; since those are the only things typed
export * from './browser'

type AnyReactComponent = React.ComponentType<Record<string, any>>


/**
 * @see https://github.com/react-static/react-static/blob/master/docs/config.md
 */
export interface ReactStaticConfig {
  /**
   * Your siteRoot in the format of `protocol://domain.com` is highly
   * recommended and is necessary for many things related to SEO to function
   * for your site. So far, this includes:
   *
   * - Automatically generating a `sitemap.xml` on export
   * - Forcing absolute URLs in statically rendered links. Make sure that you
   *   include https if you serve your site with it (which we highly recommend).
   *   **Any trailing slashes including the pathname will be removed automatically**.
   *   If you need to set a base path for your site (eg. if you're using GitHub
   *   pages), you'll want to use the `basePath` option.
   */
  siteRoot?: string

  /**
   * Works exactly like `siteRoot`, but only when building with the
   * `--staging` build flag.
   */
  stagingSiteRoot?: string

  /**
   * Your basePath in the format of some/route is necessary if you intend on
   * hosting your app from a specific route on your domain (eg. When using
   * Github Pages or for example: https://mysite.com/blog where blog would the
   * `basePath`)
   *
   * **All leading and trailing slashes are removed automatically**.
   */
  basePath?: string

  /**
   * Works exactly like `basePath`, but only when building with the
   * `--staging` build flag.
   */
  stagingBasePath?: string

  /**
   * Works exactly like `basePath`, but only when running the dev server.
   */
  devBasePath?: string

  /**
   * Your `assetsPath` determines where your bundled JS and CSS will be loaded
   * from. This is helpful if you want to host your assets in an external
   * location such as a CDN.
   */
  assetsPath?: string

  /**
   * `extractCssChunks` replaces default `ExtractTextPlugin` with
   * `ExtractCssChunks`. It enables automatic CSS splitting into separate files
   * by routes as well as dynamic components (using
   * `react-universal-component`).
   *
   * @see https://github.com/faceyspacey/extract-css-chunks-webpack-plugin
   *   More information about the plugin and why it is useful as a part of CSS
   *   delivery optimisation.
   *
   * @default false
   */
  extractCssChunks?: boolean

  /**
   * By using `extractCssChunks` option and putting code splitting at
   * appropriate places, your page related CSS file can be minimal. This option
   * allows you to inline your page related CSS in order to speed up your
   * application by reducing the number of requests required for a first paint.
   *
   * @default false
   */
  inlineCss?: boolean

  /**
   * Set this boolean to true to disable all preloading. This is mostly meant
   * for debugging at this point, but the internal mechanics could soon be
   * converted into a condition to either preload or not based on the client
   * (mobile, slow-connection, etc)
   *
   * @default false
   */
  disablePreload?: boolean

  /**
   * The maximum number of files that can be concurrently written to disk during
   * the build process.
   */
  outputFileRate?: number

  /**
   * The maximum number of inflight requests for preloading route data on the
   * client.
   */
  prefetchRate?: number

  /**
   * An optional Number of maximum threads to use when exporting your site's
   * pages. By default this is set to Infinity to use all available threads on
   * the machine React Static is running on.
   *
   * _NOTE: This only affects the process that are rendering your pages to html
   * files, not the initial bundling process._
   */
  maxThreads?: number

  /**
   * An optional Number of milliseconds to show the loading spinner when
   * templates, siteData or routeData are not immediately available. If you are
   * preloading aggressively, you shouldn't see a loader at all, but if a loader
   * is shown, it's a good user experience to make is as un-flashy as possible.
   */
  minLoadTime?: number

  /**
   * Set to true to disable prefixing link href values and the browser history
   * with `config.basePath`. Useful if you are using a variable basePath such as
   * `/country/language/basePath`.
   *
   * @default false
   */
  disableRoutePrefixing?: boolean

  /**
   * Set to true to disable warnings of duplicate routes during builds.
   *
   * @default false
   */
  disableDuplicateRoutesWarning?: boolean

  /**
   * An object of internal directories used by react-static that can be customized.
   * Each path is relative to your project root.
   */
  paths?: PathsConfig

  /**
   * We are running Babel seperately for your own sources and externals. The
   * Babel configuration for your own sources can be manipulated the normal way.
   * The one for `node_modules` can not, since it's a bit special. We try to
   * compile them with a bare minimum, but sometimes some modules gives you
   * trouble (e.g. `mapbox-gl`)
   *
   * This option gives you the ability to exclude some modules from babelifying.
   * See https://webpack.js.org/configuration/module/#condition for more
   * details.
   *
   * @example To exclude e.g. `mapboxgl`
   *
   *   export default {
   *     babelExcludes: [/mapbox-gl/],
   *   }
   */
  babelExcludes?: RegExp[]

  /**
   * An `Object` of options to be passed to the underlying
   * `webpack-dev-server` instance used for development.
   */
  devServer?: WebpackDevServerConfig

  /**
   * Set this flag to true to include source maps in production.
   *
   * @default false
   */
  productionSourceMaps?: boolean

  /**
   * It's never been easier to customize the root document of your website!
   * `Document` is an optional (and again, recommended) react component
   * responsible for rendering the HTML shell of your website.
   *
   * Things you may want to place here:
   *
   * - Site-wide custom head and/or meta tags
   * - Site-wide analytics scripts
   * - Site-wide stylesheets
   */
  Document?: DocumentComponent

  /**
   * An asynchronous function that should resolve an array of route objects.
   * You'll probably want to use this function to request any dynamic data or
   * information that is needed to build all of the routes for your site. It is
   * also passed an object containing a dev boolean indicating whether it's
   * being run in a production build or not.
   *
   * @param {RouteFlags} flags
   * @returns {Promise<Route[]>} the promise that resolves the site data
   */
  getRoutes?(flags: RouteFlags): Promise<Route[]>

  /**
   * `getSiteData` is very similar to a route's getData function, but its result
   * is made available to the entire site via the `SiteData` and `useSiteData`
   * component/HOC. Any data you return here, although loaded once per session,
   * will be embedded in every page that is exported on your site. So tread
   * lightly ;)
   *
   * @template T the type of the site data
   * @param {RouteFlags} flags
   * @returns {Promise<T>} the promise that resolves the site data
   */
  getSiteData?(flags: RouteFlags): Promise<object> | object

  plugins?: Array<PluginConfiguration>

  entry?: string
}

export type PluginConfiguration = string | [string, object?]

export interface RouteFlags {
  stage: 'dev' | 'prod'
  debug?: boolean
  isBuildCommand?: boolean
  staging?: boolean
  incremental?: boolean
}

/**
 * A route is an object that represents a unique location in your site and is
 * the backbone of every React-Static site.
 */
export interface Route {
  /**
   * The path of the URL to match for this route, excluding search parameters
   * and hash fragments, relative to your siteRoot + basePath (if this is a
   * child route, also relative to this route's parent path)
   */
  path: string

  /**
   * The path of the component to be used to render this route. (Relative to the
   * root of your project)
   */
  template?: string

  /**
   * Setting this to a URL will perform the equivalent of a 301 redirect (as
   * much as is possible within a static site) using http-equiv meta tags,
   * canonicals, etc. This will force the page to render only the bare minimum
   * to perform the redirect and nothing else.
   */
  redirect?: URL | string

  /**
   * Routes can and should have nested routes when necessary. Route paths are
   * inherited as they are nested, so there is no need to repeat a path prefix
   * in nested routes.
   */
  children?: Route[]

  /**
   * An async function that returns or resolves an object of any necessary data
   * for this route to render.
   *
   * @template T type of the route data
   * @param {Route} resolvedRoute This is the resolved route this function is handling.
   * @param {RouteFlags} flags An object of flags and meta information about the build
   * @returns {T | Promise<T>} the route data
   */
  getData?(resolvedRoute: Route, flags: RouteFlags): Promise<object> | object

  replace?: boolean
}

export interface PathsConfig {
  /** @default process.cwd() */
  root?: string
  /** @default 'src' */
  src?: string
  /** @default 'tmp' */
  temp?: string
  /** @default 'dist' */
  dist?: string
  /** @default 'tmp/dev-server' */
  devDist?: string
  /** @default 'public' */
  public?: string
  /** @default 'dist' */
  assets?: string
  /** @default 'artifacts' */
  buildArtifacts?: string
  pages?: string
  plugins?: string
  nodeModules?: string
}

export type DocumentComponent<T extends object = any> = React.ComponentType<DocumentProps<T>>

export interface InlineScript {
  /**
   * The script as a string.
   */
  script: string
  /**
   * The script's sha256 hash in base64 using the subresource integrity format,
   * eg.: 'sha256-<base64-value>'. This value can be directly used in a CSP.
   */
  hash: string
}

export interface InlineScripts extends Record<string, InlineScript> {
  routeInfo: InlineScript
}

export interface DocumentProps<T extends object = any> {
  Html: JSX.IntrinsicElements['html']
  Head: JSX.IntrinsicElements['head']
  Body: JSX.IntrinsicElements['body']
  children: React.ReactNode
  state: {
    siteData: T
    routeInfo: unknown
    renderMeta: unknown,
    inlineScripts: InlineScripts
  }
}

export interface OnStartArgs {
  devServerConfig: Readonly<WebpackDevServerConfig>
}

/**
 * This function is for extracting a routePath from a path or string as
 * RoutePaths do not have query params, basePaths, and should resemble the same
 * string as passed in the static.config.js routes.
 *
 * You can use this to sanitize the pathname of a location before giving it to
 * a custom `routePathContext.Provider`.
 *
 * @see routePathContext
 *
 * @param {string} routePath the unsanitized path
 * @returns {string} the sanitized path
 */
export function getRoutePath(routePath: string): string

/**
 * Utility function to turn any path into an absolute path
 *
 * @private
 *
 * @param {string} path the potentially non-absolute path
 * @returns {string} the absolute equivalent
 */
export function makePathAbsolute(path: string): string

/**
 * Utility function to join paths, making sure there are no double slashses
 *
 * @private
 *
 * @param {...ReadonlyArray<string>} paths the paths to join
 * @returns {string} the joined path
 */
export function pathJoin(...paths: ReadonlyArray<string>): string
