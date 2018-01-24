export function pathJoin (...paths) {
  let newPath = `${paths.join('/')}`.replace(/\/{2,}/g, '/')
  if (newPath !== '/') {
    newPath = newPath.replace(/\/$/g, '')
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
