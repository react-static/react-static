// Type definitions for react-static 5.1.7
// Project: https://github.com/nozzle/react-static
// Definitions for 4.0.1 by: D1no <https://github.com/D1no>
// Updated to 5.1.7 by: Balvajs <https://github.com/Balvajs>
// TypeScript Version: 2.6

/// <reference types="react" />

declare module 'react-static' {
  import * as React from 'react';

  // Passing on all react-router typings
  export * from 'react-router-dom';
  import { NavLinkProps } from 'react-router-dom';

  // Passing on helmet typings as "Head"
  import { Helmet } from 'react-helmet';
  export class Head extends Helmet {}

  export function withRouteData<E extends React.ReactNode>(fn: (data: any) => E): E;
  export function withSiteData<E extends React.ReactNode>(fn: (data: any) => E): E;
  export type DataProviderProps<T> = {
    render(routeData: T): React.ReactNode;
  } | {
    children(routeData: T): React.ReactNode;
  } | {
    component(routeData: T): React.ReactNode;
  };
  export const RouteData: React.StatelessComponent<DataProviderProps<any>>;
  export const SiteData: React.StatelessComponent<DataProviderProps<any>>;

  export interface PrefetchOptions {
    type?: 'data' | 'template' | any;
    priority?: boolean;
  }
  export function prefetch(path: string, options: PrefetchOptions): Promise<any>;
  export function scrollTo(
    height: number | React.DOMElement<any, any>,
    options?: {
      duration?: number;
      offset?: number;
      context?: React.DOMElement<any, any>;
    }
  ): Promise<void>;

  export interface PrefetchProps extends Pick<PrefetchOptions, 'type'> {
    path: string;
    onLoad?(data: any, cleanedPath: string);
  }
  export const Prefetch: React.StatelessComponent<PrefetchProps>;
  export const PrefetchWhenSeen: React.StatelessComponent<PrefetchProps>;

  export const enum LoadingState {
    Finished = 0,
    NotLoaded = 0,
    Soft = 1,
    Hard = 2,
  }
  export type LoadingEventUnsubscriber = () => void;
  export function onLoading(fn: (state: LoadingState) => void): LoadingEventUnsubscriber;
  export const Loading: React.StatelessComponent<DataProviderProps<LoadingState>>;

  // Overwriting react-router export as react-static does (no-op)
  export const BrowserRouter: undefined;
  export const HashRouter: undefined;
  export const MemoryRouter: undefined;
  export const StaticRouter: undefined;
  export class Router extends React.Component<{
    history?: any;
    autoScrollToTop?: boolean;
    autoScrollToHash?: boolean;
    scrollToHashDuration?: number;
    scrollToTopDuration?: number;
    showErrorsInProduction?: boolean;
  }> {}

  export const NavLink: undefined;
  interface LinkProps extends NavLinkProps {
    scrollToTop?: boolean;
    prefetch?: boolean | string;
  }
  export class Link extends React.Component<LinkProps, any> {}
}

declare module 'react-static-routes' {
  class Routes extends React.Component {}
  export default Routes
}

declare module 'react-static/node' {
  import { Configuration, RuleSetRule, Stats } from 'webpack';
  import { Configuration as devConfiguration } from 'webpack-dev-server';
  export interface DefaultLoaders {
    jsLoader: RuleSetRule;
    cssLoader: RuleSetRule;
    fileLoader: RuleSetRule;
  }
  export interface RouteInfo<SiteData> {
    path: string;
    templateID: number;
    sharedPropsHashes: any;
    localProps: any;
    allProps: any;
    siteData: SiteData;
  }
  export interface DocumentProps<Meta, SiteData> {
    Html: React.DetailedHTMLFactory<React.HtmlHTMLAttributes<HTMLHtmlElement>, HTMLHtmlElement>;
    Head: React.DetailedHTMLFactory<React.HTMLAttributes<HTMLElement>, HTMLHeadElement>;
    Body: React.DetailedHTMLFactory<React.HTMLAttributes<HTMLBodyElement>, HTMLBodyElement>;
    children: React.ReactInstance;
    routeInfo?: RouteInfo<SiteData>;
    siteData?: SiteData;
    renderMeta?: Meta;
  }
  export interface WebpackArgs {
    stage: 'prod' | 'dev' | 'node';
    defaultLoaders: DefaultLoaders;
  }
  export type WebpackConfigurator = (config: Configuration, args: WebpackArgs) => Configuration;
  export interface PathsConfig {
    root: string;
    src: string;
    dist: string;
    devDist: string;
    public: string;
  }
  export interface ConfigObject<Meta = any, SiteData = any> {
    entry: string;
    getRoutes(): Promise<RouteData[]> | RouteData;

    getSiteData(): PromiseLike<SiteData> | SiteData;
    siteRoot?: string;
    stagingSiteRoot?: string;

    basePath?: string;
    stagingBasePath?: string;
    devBasePath?: string;

    extractCssChunks?: boolean;
    generateSourceMap?: boolean;
    Document?: React.StatelessComponent<DocumentProps<Meta, SiteData>>;

    webpack: WebpackConfigurator | WebpackConfigurator[];
    devServer?: devConfiguration;

    renderToHtml?(
      render: (component: React.ReactInstance) => string,
      component: React.StatelessComponent,
      meata: Meta,
      webpackStats: Stats,
    ): string;

    paths?: PathsConfig;

    onStart?(option: { devServer: Readonly<devConfiguration> }): void;
    onBuild?(): void;

    bundleAnalyzer?: boolean;
    outputFileRate?: number;
    prefetchRate?: number;
    disableRouteInfoWarning?: boolean;
    disableDuplicateRoutesWarning?: boolean;
    disableRoutePrefixing?: boolean;
  }

  export type Config = ConfigObject | string;
  export function create(name: string, location: string, silent?: boolean): Promise<any>;
  export function start(config: Config, silent?: boolean): Promise<never>;
  export function build(config: Config, staging: boolean, debug: boolean, silent?: boolean): Promise<any>;
  export function rebuildRoutes(): void;
  export interface BaseRouteRoute {
    component: string;
    getData?(resolvedRoute: any, flags: any[], dev: boolean): Promise<any> | any;
    noindex?: boolean;
    permalink?: string;
    lastModified?: string;
    priority?: number;
  }
  export interface NotFoundRoute extends BaseRouteRoute {
    is404: true;
  }
  export interface RedirectRoute extends BaseRouteRoute {
    redirect: string;
  }
  export interface Route extends BaseRouteRoute {
    path: string;
    children?: RouteData[];
  }
  export type RouteData = NotFoundRoute | Route | RedirectRoute;
  export interface MakingPageRoutesOption<T> {
    items: T[];
    pageSize: number;
    route: RouteData;
    decorate(items: T[], pageIndex: number, totalPages: number): RouteData;
    pageToken: string;
  }

  export function makePageRoutes<T>(options: MakingPageRoutesOption<T>): RouteData[];
}
