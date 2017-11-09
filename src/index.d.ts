// Type definitions for react-static 4.0.1
// Project: https://github.com/nozzle/react-static
// Definitions by: D1no <https://github.com/D1no>
// TypeScript Version: 2.6

/// <reference types="react" />

declare module "react-static" {

  import * as React from "react";

  // Passing on all react-router typings
  export * from "react-router-dom";

  // Passing on helmet typings as "Head"
  import * as Helmet from "react-helmet";

  export const Head: Helmet;

  export function getRouteProps(comp: any): any;
  export function getSiteProps(comp: any): any;
  export async function prefetch(path: any): any;

  export const Prefetch: React.Component;
  export const PrefetchWhenSeen: React.Component;

  // Overwriting react-router export as react-static does (no-op)
  export const BrowserRouter: undefined;
  export const HashRouter: undefined;
  export const MemoryRouter: undefined;
  export const StaticRouter: undefined;
}