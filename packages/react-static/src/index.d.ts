// Type definitions for react-static 7.0.0
// Project: https://github.com/nozzle/react-static
// Definitions for 4.0.1 by: D1no <https://github.com/D1no>
// Updated to 5.1.7 by: Balvajs <https://github.com/Balvajs>
// TypeScript Version: 3.4
// VERY lightly maintained, we need all the help we can get

// / <reference types="react" />

declare module 'react-static' {
  import * as React from 'react'
  import { ComponentType, ReactNodeArray } from 'react'
  import { Configuration as WebpackDevServerConfig } from 'webpack-dev-server'

  type AnyReactComponent = ComponentType<Record<string, any>>

  // Passing on helmet typings as "Head"
  export { Helmet as Head } from 'react-helmet'

  export class Routes extends React.Component<{ path: String }> {}
  export class Root extends React.Component {}
  export function useRouteData<T = any>(): T
  export function useSiteData<T = any>(): T
  export function prefetch(path: any): Promise<any>
  export function addPrefetchExcludes(arg: String[]): void
  export const Prefetch: React.Component

  /**
   * @see https://github.com/nozzle/react-static/blob/master/docs/config.md
   */
  export interface ReactStaticConfig {
    siteRoot?: string
    stagingSiteRoot?: string
    basePath?: string
    stagingBasePath?: string
    devBasePath?: string
    assetsPath?: string
    extractCssChunks?: boolean
    inlineCss?: boolean
    disablePreload?: boolean
    outputFileRate?: number
    prefetchRate?: number
    maxThreads?: number
    minLoadTime?: number
    disableRoutePrefixing?: boolean
    paths?: PathsConfig
    babelExcludes?: RegExp[]
    devServer?: WebpackDevServerConfig
    plugins?: Array<string | [string, object]>
    Document?: AnyReactComponent
    getRoutes?(flags: RouteFlags): Route[]
    getSiteData?(flags: RouteFlags): any
  }

  export interface PathsConfig {
    root?: string
    src?: string
    temp?: string
    dist?: string
    devDist?: string
    public?: string
    assets?: string
    pages?: string
    plugins?: string
    nodeModules?: string
  }

  export interface RouteFlags {
    stage: string
  }

  export interface Route {
    path: string
    template?: string
    redirect?: string
    children?: Route[]
    getData?(resolvedRoute: Route, flags: RouteFlags): any
    replace: boolean
  }

  export interface DocumentProps {
    Html: AnyReactComponent
    Head: AnyReactComponent
    Body: AnyReactComponent
    children: ReactNodeArray
    state: any // TODO: This should be changed
  }

  export interface OnStartArgs {
    devServerConfig: Readonly<WebpackDevServerConfig>
  }
}
