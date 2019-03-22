import nodePath from 'path'
import chokidar from 'chokidar'
import nodeGlob from 'glob'
import { pathJoin } from 'react-static'

let watcher
let routesCache

export default ({ location, pathPrefix, extensions = [] }) => ({
  getRoutes: async (routes, state) => {
    const { config, stage, debug } = state
    if (!location) {
      throw new Error(
        'react-static-plugin-source-directory: A valid `location` directory is required to use this plugin'
      )
    }
    // Make a glob extension to get all pages with the set extensions from the pages directory
    const globExtensions = [...config.extensions, ...extensions]
      .map(ext => `${ext.slice(1)}`) // cut off the period of the extension
      .join(',') // join them for the glob string
    const pagesGlob = `${location}/**/*.{${globExtensions}}`
    // Get the pages

    if (debug) {
      console.log(`=> Importing directory routes from: ${pagesGlob}`)
    } else {
      console.log('=> Importing routes from directory...')
    }

    const handle = pages => {
      // Turn each page into a route
      const routes = pages.map(page => {
        // Glob path will always have unix style path, convert to windows if necessary
        const template = nodePath.resolve(page)
        // Make sure the path is relative to the root of the site
        let path = page.replace(`${location}`, '').replace(/\..*/, '')
        // turn windows paths back to unix
        path = path.split('\\').join('/')
        // Turn `/index` paths into roots`
        path = path.replace(/\/index$/, '/')
        path = pathPrefix ? pathJoin(pathPrefix, path) : path
        // Return the route
        return {
          path,
          template,
        }
      })
      return routes
    }

    // if (stage === 'dev' && !watcher) {
    //   watch(location, {
    //     ignoreInitial: true,
    //   }).on(
    //     'all',
    //     debounce(async (type, file) => {
    //       if (!['add', 'unlink'].includes(type)) {
    //         return
    //       }
    //       const filename = nodePath.basename(file)
    //       if (filename.startsWith('.')) {
    //         return
    //       }
    //       const pages = await glob(pagesGlob)
    //       const routes = handle(pages)
    //       routesCache = routes
    //       // devRunner.update()
    //     }),
    //     50
    //   )
    // }

    // if (routesCache) {
    //   return routesCache
    // }

    const pages = await glob(pagesGlob)
    const directoryRoutes = handle(pages)

    return [...routes, ...directoryRoutes]
  },
})

function glob(path, options = {}) {
  return new Promise((resolve, reject) =>
    nodeGlob(path, options, (err, files) => {
      if (err) {
        return reject(err)
      }
      resolve(files)
    })
  )
}

function debounce(fn, time) {
  let timeout
  return (...args) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    setTimeout(() => fn(...args), time)
  }
}

function watch(...args) {
  if (watcher) {
    watcher.close()
  }
  watcher = chokidar.watch(...args)

  return watcher
}
