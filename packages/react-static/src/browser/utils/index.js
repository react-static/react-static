export { poolAll, createPool } from 'swimmer'

const REGEX_TO_CUT_TO_ROOT = /(\..+?)\/.*/g
const REGEX_TO_REMOVE_LEADING_SLASH = /^\/{1,}/g
const REGEX_TO_REMOVE_TRAILING_SLASH = /\/{1,}$/g
const REGEX_TO_REMOVE_DOUBLE_SLASH = /\/{2,}/g

export const cutPathToRoot = (string = '') =>
  string.replace(REGEX_TO_CUT_TO_ROOT, '$1')

export const trimLeadingSlashes = (string = '') =>
  string.replace(REGEX_TO_REMOVE_LEADING_SLASH, '')

export const trimTrailingSlashes = (string = '') =>
  string.replace(REGEX_TO_REMOVE_TRAILING_SLASH, '')

export const trimDoubleSlashes = (string = '') => {
  if (isAbsoluteUrl(string)) {
    const [scheme = '', path = ''] = string.split('://')

    return [scheme, path.replace(REGEX_TO_REMOVE_DOUBLE_SLASH, '/')].join('://')
  }

  return string.replace(REGEX_TO_REMOVE_DOUBLE_SLASH, '/')
}

export const cleanSlashes = (string, options = {}) => {
  if (!string) return ''

  const { leading = true, trailing = true, double = true } = options
  let cleanedString = string

  if (leading) {
    cleanedString = trimLeadingSlashes(cleanedString)
  }

  if (trailing) {
    cleanedString = trimTrailingSlashes(cleanedString)
  }

  if (double) {
    cleanedString = trimDoubleSlashes(cleanedString)
  }

  return cleanedString
}

export function pathJoin(...paths) {
  let newPath = paths.map(cleanSlashes).join('/')
  if (!newPath || newPath === '/') {
    return '/'
  }

  newPath = cleanSlashes(newPath)
  if (newPath.includes('?')) {
    newPath = newPath.substring(0, newPath.indexOf('?'))
  }
  return newPath
}

// This function is for extracting a routePath from a path or string
// RoutePaths do not have query params, basePaths, and should
// resemble the same string as passed in the static.config.js routes
export function getRoutePath(routePath) {
  // Detect falsey paths and the root path
  if (
    !routePath ||
    routePath === '/' ||
    routePath === process.env.REACT_STATIC_BASE_PATH
  ) {
    return '/'
  }

  // Remove origin, hashes, and query params
  if (typeof document !== 'undefined') {
    routePath = routePath.replace(window.location.origin, '')
    routePath = routePath.replace(/#.*/, '')
    routePath = routePath.replace(/\?.*/, '')
  }

  // Be sure to remove the base path
  if (process.env.REACT_STATIC_BASE_PATH) {
    routePath = routePath.replace(
      new RegExp(`^\\/?${process.env.REACT_STATIC_BASE_PATH}(\\/|$)`),
      ''
    )
  }
  routePath = routePath || '/'
  return pathJoin(routePath)
}

export function getCurrentRoutePath() {
  // If in the browser, use the window
  if (typeof document !== 'undefined') {
    return getRoutePath(decodeURIComponent(window.location.href))
  }
}

export function unwrapArray(arg, defaultValue) {
  arg = Array.isArray(arg) ? arg[0] : arg
  if (!arg && defaultValue) {
    return defaultValue
  }
  return arg
}

export function isObject(a) {
  return !Array.isArray(a) && typeof a === 'object' && a !== null
}

export function deprecate(from, to) {
  console.warn(
    `React-Static deprecation notice: ${from} will be deprecated in favor of ${to} in the next major release.`
  )
}

export function removal(from) {
  console.warn(
    `React-Static removal notice: ${from} is no longer supported in this version of React-Static. Please refer to the CHANGELOG for details.`
  )
}

export function isAbsoluteUrl(url) {
  if (typeof url !== 'string') {
    return false
  }

  return /^[a-z][a-z0-9+.-]*:/.test(url)
}

export function makePathAbsolute(path) {
  if (typeof path !== 'string') {
    return '/'
  }

  if (isAbsoluteUrl(path)) {
    return path
  }

  return `/${trimLeadingSlashes(path)}`
}

export function reduceHooks(hooks, { sync } = {}) {
  // These returns a runner that takes a value (and options) and
  // reduces the value through each hook, returning the
  // final value
  // compare is a function which is used to compare
  // the prev and next value and decide which to use.
  // By default, if undefined is returned from a reducer, the prev value
  // is retained

  // If synchronous, things are simple
  if (sync) {
    return (value, options) =>
      hooks.reduce((prev, hook) => {
        const next = hook(prev, options)
        if (next instanceof Promise) {
          throw new Error(
            'Expected hook to return a value, but received promise instead. A plugin is attempting to use a sync plugin with an async function!'
          )
        }
        return typeof next !== 'undefined' ? next : prev
      }, value)
  }

  // We create a map of hook handlers that point to the next hook
  // in line and reduce the value throughout (or return it if it's done)
  return (startValue, options) => {
    const hookList = hooks.map((hook, index) => async lastValue => {
      let nextValue = await hook(lastValue, options)
      nextValue = typeof nextValue !== 'undefined' ? nextValue : lastValue
      if (hookList[index + 1]) {
        return hookList[index + 1](nextValue)
      }
      return nextValue
    })
    return hookList.length ? hookList[0](startValue) : startValue
  }
}

export function mapHooks(hooks, { sync } = {}) {
  // Returns a function that takes state and returns
  // a flat array of values mapped from each hook
  if (sync) {
    return state => {
      const results = hooks.map(hook => hook(state))
      return results.filter(d => typeof d !== 'undefined')
    }
  }

  return state => {
    const results = []
    const hookList = hooks.map((hook, index) => async () => {
      results[index] = await hook(state)

      if (hookList[index + 1]) {
        return hookList[index + 1]()
      }

      return results.filter(d => typeof d !== 'undefined')
    })
    return hookList.length ? hookList[0]() : []
  }
}

export function getHooks(plugins, hook) {
  if (!hook) {
    throw new Error('A hook ID is required!')
  }
  // The flat hooks
  const hooks = []

  // Adds a plugin hook to the hook list
  const addToHooks = plugin => {
    // Add the hook
    hooks.push(plugin.hooks[hook])

    // Recurse into sub plugins if needs be
    if (plugin.plugins) {
      plugin.plugins.forEach(addToHooks)
    }
  }
  // Start with the config plugins
  plugins.forEach(addToHooks)

  // Filter out falsey entries
  return hooks.filter(Boolean)
}

export function getFullRouteData(routeInfo) {
  return {
    ...(routeInfo.sharedData ? routeInfo.sharedData : {}),
    ...routeInfo.data,
  }
}

export const PATH_404 = '404'

export function is404Path(path) {
  return path === PATH_404
}
