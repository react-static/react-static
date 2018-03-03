export { poolAll, createPool } from 'swimmer'

export function pathJoin (...paths) {
  let newPath = trimSlashes(paths.map(trimSlashes).join('/'))
  if (newPath) {
    if (newPath.includes('?')) {
      newPath = newPath.substring(0, newPath.indexOf('?'))
    }
    return newPath
  }
  return '/'
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

export function trimSlashes (str) {
  return str.replace(/^\/{1,}/g, '').replace(/\/{1,}$/g, '')
}

export function cleanPath (path) {
  // Resolve the local path
  if (!path) {
    return path
  }
  if (process.env.REACT_STATIC_BASEPATH) {
    path = path.replace(new RegExp(`^\\/?${process.env.REACT_STATIC_BASEPATH}\\/`), '')
    path = path || '/'
  }
  if (typeof document !== 'undefined') {
    // Only allow origin or absolute links
    path = path.replace(window.location.origin, '')
    let end = path.indexOf('#')
    end = end === -1 ? undefined : end
    path = path.substring(0, end)
  }
  return pathJoin(path)
}
