export { poolAll, createPool } from 'swimmer'

export function pathJoin (...paths) {
  let newPath = `${paths.join('/')}`.replace(/\/{2,}/g, '/')
  if (newPath !== '/') {
    newPath = newPath.replace(/\/$/g, '')
    if (newPath.includes('?')) {
      newPath = newPath.substring(0, newPath.indexOf('?'))
    }
  }
  return newPath
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
