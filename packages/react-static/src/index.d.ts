// Type definitions for react-static 5.1.7
// Project: https://github.com/nozzle/react-static
// Definitions for 4.0.1 by: D1no <https://github.com/D1no>
// Updated to 5.1.7 by: Balvajs <https://github.com/Balvajs>
// TypeScript Version: 2.6

/// <reference types="react" />

declare module 'react-static' {
  import * as React from 'react'
  import { ComponentType, ReactNodeArray } from "react";
  import { Configuration as WebpackDevServerConfig } from "webpack-dev-server";

  type AnyReactComponent = ComponentType<Record<string, any>>;

  // Passing on helmet typings as "Head"
  import { Helmet } from 'react-helmet'
  export class Head extends Helmet {}

  // Generated Routes
  export class Routes extends React.Component {}

  export type RootProps = {
    disableScroller?: boolean,
    autoScrollToTop?: boolean,
    autoScrollToHash?: boolean,
    scrollToTopDuration?: number,
    scrollToHashDuration?: number,
    scrollToHashOffset?: number,
  }
  export class Root extends React.Component<RootProps> {}

  export function withRouteData(comp: any): any
  export function withSiteData(comp: any): any
  export const RouteData: React.Component
  export const SiteData: React.Component

  export function prefetch(path: any): Promise<any>
  export function scrollTo(
    height: number | React.DOMElement<any, any>,
    options?: {
      duration?: number
      offset?: number
      context?: React.DOMElement<any, any>
    }
  ): Promise<any>

  export const Prefetch: React.Component

  /**
   * @see https://github.com/nozzle/react-static/blob/master/docs/config.md
   */
  export interface ReactStaticConfig {
    siteRoot?: string;
    stagingSiteRoot?: string;
    basePath?: string;
    stagingBasePath?: string;
    devBasePath?: string;
    assetsPath?: string;
    extractCssChunks?: boolean;
    inlineCss?: boolean;
    disablePreload?: boolean;
    bundleAnalyzer?: boolean;
    disableDuplicateRoutesWarning?: boolean;
    outputFileRate?: number;
    prefetchRate?: number;
    maxThreads?: number;
    minLoadTime?: number;
    disableRoutePrefixing?: boolean;
    paths?: PathsConfig;
    babelExcludes?: RegExp[];
    devServer?: WebpackDevServerConfig;
    plugins?: Array<string | [string, object]>;
    Document?: AnyReactComponent;
    getRoutes?(flags: RouteFlags): Route[];
    getSiteData?(flags: RouteFlags): any;
    onStart?(args: OnStartArgs): void;
    onBuild?(): void;
  }

  export interface PathsConfig {
    root?: string;
    src?: string;
    temp?: string;
    dist?: string;
    devDist?: string;
    public?: string;
    assets?: string;
    pages?: string;
    plugins?: string;
    nodeModules?: string;
  }

  export interface RouteFlags {
    dev: boolean;
  }

  export interface Route {
    path: string;
    component?: string;
    redirect?: string;
    noindex?: boolean;
    permalink?: string;
    lastModified?: string;
    priority?: number;
    children?: Route[];
    getData?(resolvedRoute: Route, flags: RouteFlags): any;
  }

  export interface DocumentProps {
    Html: AnyReactComponent,
    Head: AnyReactComponent,
    Body: AnyReactComponent,
    children: ReactNodeArray,
    routeInfo: object;
    stieData: object;
    renderMeta: object;
  }

  export interface OnStartArgs {
    devServerConfig: Readonly<WebpackDevServerConfig>;
  }
}
