// For convenience, only declare the exports here that are exported from
// the react-static main index.js.

/**
 * addPrefetchExcludes allows you to register dynamic route exclusions at
 * runtime, so as to not produce 404 errors when attempting to preload static
 * data / templates that link to these routes.
 *
 * @param {...ReadonlyArray<string>} excludes
 */
export function addPrefetchExcludes(excludes: ReadonlyArray<string | RegExp>): void;

/**
 * @private
 */
export function getRouteInfo(path: string, options?: { priority: number }): Promise<unknown>;


/**
 * @private
 */
export function isPrefetchableRoute(path: string): boolean;

/**
 * @private
 */
export function onReloadClientData(fn: () => void): void;

/**
 * @private
 */
export function onReloadTemplates(fn: () => void): void;

/**
 * @private
 */
export const pluginHooks: unknown[];

/**
 * @private
 */
export const plugins: {
  Root: (Comp: unknown) => unknown,
  Routes: (Comp: unknown) => unknown
}

/**
 * Prefetches the route given as `path` and resolves its `routeData`
 *
 * @see usePrefetch
 *
 * @template T the route data
 * @param {string} path the path to prefetch
 * @returns {Promise<T>} the promise that resolves the route data
 */
export function prefetch<T extends unknown = any>(path: string, options?: { type?: 'data' | 'template', priority?: number }): Promise<undefined | T>

/**
 * @private
 */
export function prefetchData<T extends unknown = any>(path: string, options?: { priority?: number }): undefined | T;

/**
 * @private
 */
export function prefetchTemplate<T extends React.ComponentType = any>(path: string, options?: { priority?: number }): undefined | T;

/**
 * @private
 */
export function registerPlugins(newPlugins: unknown[]): void;

/**
 * @private
 */
export function registerTemplateForPath(path: string, template: string): void;

/**
 * @private
 */
export function registerTemplates(templates: { [template: string]: React.ComponentType }, notFoundKey: string): Promise<void>;

/**
 * @private
 */
export const routeErrorByPath: { [path: string]: true }

/**
 * @private
 */
export const routeInfoByPath: { [path: string]: unknown }

/**
 * @private
 */
export const sharedDataByHash: { [hash: string]: unknown }

/**
 * @private
 */
export const templateErrorByPath: { [template: string]: true }

/**
 * @private
 */
export const templates: { [template: string]: React.ComponentType }

/**
 * @private
 */
export const templatesByPath: { [path: string]: React.ComponentType }
