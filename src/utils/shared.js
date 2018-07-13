export { poolAll, createPool } from 'swimmer'

const REGEX_TO_CUT_TO_ROOT = /(\..+?)\/.*/g
const REGEX_TO_REMOVE_LEADING_SLASH = /^\/{1,}/g
const REGEX_TO_REMOVE_TRAILING_SLASH = /\/{1,}$/g
const REGEX_TO_REMOVE_DOUBLE_SLASH = /\/{2,}/g

export const cutPathToRoot = (string = '') => string.replace(REGEX_TO_CUT_TO_ROOT, '$1')

export const trimLeadingSlashes = (string = '') => string.replace(REGEX_TO_REMOVE_LEADING_SLASH, '')

export const trimTrailingSlashes = (string = '') =>
  string.replace(REGEX_TO_REMOVE_TRAILING_SLASH, '')

export const trimDoubleSlashes = (string = '') => {
  if (isAbsoluteUrl(string)) {
    const [scheme, path] = string.split('://')

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

export function pathJoin (...paths) {
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

export function cleanPath (path) {
  // Resolve the local path
  if (!path || path === '/') {
    return '/'
  }
  // Remove origin, hashes, and query params
  if (typeof document !== 'undefined') {
    path = path.replace(window.location.origin, '')
    path = path.replace(/#.*/, '')
    path = path.replace(/\?.*/, '')
  }
  if (process.env.REACT_STATIC_BASE_PATH) {
    path = path.replace(new RegExp(`^\\/?${process.env.REACT_STATIC_BASE_PATH}\\/`), '')
  }
  path = path || '/'
  return pathJoin(path)
}

export function unwrapArray (arg, defaultValue) {
  arg = Array.isArray(arg) ? arg[0] : arg
  if (!arg && defaultValue) {
    return defaultValue
  }
  return arg
}

export function isObject (a) {
  return !Array.isArray(a) && typeof a === 'object' && a !== null
}

export function deprecate (from, to) {
  console.warn(
    `React-Static deprecation notice: ${from} will be deprecated in favor of ${to} in the next major release.`
  )
}

export function isAbsoluteUrl (url) {
  if (typeof url !== 'string') {
    return false
  }

  return /^[a-z][a-z0-9+.-]*:/.test(url)
}

export function makePathAbsolute (path) {
  if (typeof path !== 'string') {
    return '/'
  }

  if (isAbsoluteUrl(path)) {
    return path
  }

  return `/${trimLeadingSlashes(path)}`
}
