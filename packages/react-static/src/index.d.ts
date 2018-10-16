// Type definitions for react-static 5.1.7
// Project: https://github.com/nozzle/react-static
// Definitions for 4.0.1 by: D1no <https://github.com/D1no>
// Updated to 5.1.7 by: Balvajs <https://github.com/Balvajs>
// TypeScript Version: 2.6

/// <reference types="react" />

declare module 'react-static' {
  import * as React from 'react'

  // Passing on helmet typings as "Head"
  import { Helmet } from 'react-helmet'
  export class Head extends Helmet {}

  // Generated Routes
  export class Routes extends React.Component {}

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
}
