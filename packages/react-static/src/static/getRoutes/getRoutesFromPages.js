import nodePath from 'path'
import chokidar from 'chokidar'

import { glob, debounce } from '../../utils'

let watcher
let routesCache

export default (async function getRoutesFromPages(
  { config, opts = {} },
  subscription
) {
  // Make a glob extension to get all pages with the set extensions from the pages directory
  const globExtensions = config.extensions
    .map(ext => `${ext.slice(1)}`)
    .join(',')
  const pagesGlob = `${config.paths.PAGES}/**/*.{${globExtensions}}`
  // Get the pages

  const handle = pages => {
    // Turn each page into a route
    const routes = pages.map(page => {
      // Glob path will always have unix style path, convert to windows if necessary
      page = nodePath.resolve(page)
      // Get the component path relative to ROOT
      const component = nodePath.relative(config.paths.ROOT, page)
      // Make sure the path is relative to the root of the site
      let path = page.replace(`${config.paths.PAGES}`, '').replace(/\..*/, '')
      // turn windows paths back to unix
      path = path.split('\\').join('/')
      // Turn `/index` paths into roots`
      path = path.replace(/\/index$/, '/')
      // Return the route
      return {
        path,
        component,
        isPage: true, // tag it with isPage, so we know its origin
      }
    })
    return routes
  }

  if (opts.dev && !watcher) {
    watcher = chokidar
      .watch(config.paths.PAGES, {
        ignoreInitial: true,
      })
      .on(
        'all',
        debounce(async (type, file) => {
          if (!['add', 'unlink'].includes(type)) {
            return
          }
          const filename = nodePath.basename(file)
          if (filename.startsWith('.')) {
            return
          }
          const pages = await glob(pagesGlob)
          const routes = handle(pages)
          routesCache = routes
          subscription(routes)
        }),
        50
      )
  }
  if (routesCache) {
    return subscription(routesCache)
  }
  const pages = await glob(pagesGlob)
  const routes = handle(pages)
  return subscription(routes)
})
