import nodePath from 'path'
import chokidar from 'chokidar'
import nodeGlob from 'glob'
import { pathJoin } from 'react-static'
import { rebuildRoutes } from 'react-static/node'

export default ({
  location,
  pathPrefix,
  createRoute = d => d,
  extensions = [],
}) => ({
  getRoutes: async (routes, state) => {
    const { config, stage, debug } = state
    if (!location) {
      throw new Error(
        'react-static-plugin-source-filesystem: A valid `location` directory ' +
          'is required to use this plugin'
      )
    }
    // Make a glob extension to get all pages with the set extensions from the pages directory
    // It should be a directory, not index.js inside that directory. This will
    // happen when using .resolve in some instances
    if (/index\.js$/.test(location)) {
      location = nodePath.dirname(location)
    }

    // Make a glob extension to get all pages with the set extensions from the
    // pages directory
    const globExtensions = [...config.extensions, ...extensions]
      .map(ext => `${ext.slice(1)}`) // cut off the period of the extension
      .join(',') // join them for the glob string
    const pagesGlob = nodePath.join(location, '**', `*.{${globExtensions}}`)
    // Get the pages

    if (debug) {
      console.log(`Importing directory routes from: ${pagesGlob}`)
    } else {
      console.log('Importing routes from directory...')
    }

    const handle = pages =>
      // Turn each page into a route
      Promise.all(
        pages.map(page => {
          const originalPath = page
          // Glob path will always have unix style path, convert to windows if necessary
          const template = nodePath.resolve(page)
          // Make sure the path is relative to the location root
          let path = nodePath.relative(location, template)
          // Cutoff the extension
          path = nodePath.join(
            nodePath.dirname(path),
            nodePath.basename(path, nodePath.extname(path))
          )
          // Ensure paths are unix
          path = path.split(nodePath.sep).join(nodePath.posix.sep)
          // Make sure it starts with a slash
          path = path[0] === '/' ? path : `/${path}`
          // Turn `/index` paths into roots`
          path = path.replace(/\/index$/, '/')
          // Add the path prefix
          path = pathPrefix ? pathJoin(pathPrefix, path) : path
          // Return the route
          return createRoute({
            path,
            template,
            originalPath,
          })
        })
      )

    // Trigger a getRoutes rebuild when items in
    // the directory change

    if (stage === 'dev') {
      const watcher = chokidar
        .watch(location, {
          ignoreInitial: true,
        })
        .on('all', async (type, file) => {
          if (!['add', 'unlink'].includes(type)) {
            return
          }
          const filename = nodePath.basename(file)
          if (filename.startsWith('.')) {
            return
          }

          console.log(
            `File ${type === 'add' ? 'Added' : 'Removed'}: ${nodePath.relative(
              config.paths.ROOT,
              nodePath.resolve(location, filename)
            )}`
          )
          watcher.close()
          rebuildRoutes()
        })
    }

    const pages = await glob(pagesGlob)
    const directoryRoutes = await handle(pages)

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
