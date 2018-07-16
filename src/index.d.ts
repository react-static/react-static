// Type definitions for react-static 5.1.7
// Project: https://github.com/nozzle/react-static
// Definitions for 4.0.1 by: D1no <https://github.com/D1no>
// Updated to 5.1.7 by: Balvajs <https://github.com/Balvajs>
// TypeScript Version: 2.6

/// <reference types="react" />

declare module 'react-static' {
  import * as React from 'react'

  // Passing on all react-router typings
  export * from 'react-router-dom'
  import { NavLinkProps } from 'react-router-dom'

  // Passing on helmet typings as "Head"
  import { Helmet } from 'react-helmet'
  export class Head extends Helmet {}

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
  export const PrefetchWhenSeen: React.Component

  export const Loading: React.Component

  // Overwriting react-router export as react-static does (no-op)
  export const BrowserRouter: undefined
  export const HashRouter: undefined
  export const MemoryRouter: undefined
  export const StaticRouter: undefined
  export class Router extends React.Component<{
    history?: any
    autoScrollToTop?: boolean
    autoScrollToHash?: boolean
    scrollToHashDuration?: number
    scrollToTopDuration?: number
    showErrorsInProduction?: boolean
  }> {}

  export const NavLink: undefined
  interface LinkProps extends NavLinkProps {
    scrollToTop?: boolean
    prefetch?: boolean | string
  }
  export class Link extends React.Component<LinkProps, any> {}
}

declare module 'react-static-routes' {
  class Routes extends React.Component {}
  export default Routes
}
