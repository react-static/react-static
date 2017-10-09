export const pathJoin = (...paths) => {
  let newPath = `${paths.join('/')}`.replace(/\/{2,}/g, '/')
  if (newPath !== '/') {
    newPath = newPath.replace(/\/$/g, '')
  }
  return newPath
}
