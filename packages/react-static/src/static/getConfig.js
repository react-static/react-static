/* eslint-disable import/no-dynamic-require */

import nodePath from 'path'
import chokidar from 'chokidar'
import resolveFrom from 'resolve-from'
import fs from 'fs-extra'

import getDirname from '../utils/getDirname'
import {
  cleanSlashes,
  cutPathToRoot,
  isAbsoluteUrl,
  makeHookReducer,
} from '../utils'

// the default static.config.js location
const defaultConfig = {}
const DEFAULT_NAME_FOR_STATIC_CONFIG_FILE = 'static.config'
const DEFAULT_PATH_FOR_STATIC_CONFIG = nodePath.resolve(
  nodePath.join(process.cwd(), DEFAULT_NAME_FOR_STATIC_CONFIG_FILE)
)
const DEFAULT_ROUTES = [{ path: '/' }]
const DEFAULT_ENTRY = 'index'
const DEFAULT_EXTENSIONS = ['.js', '.jsx']

export const buildConfig = async (config = {}) => {
  // path defaults
  config.paths = {
    root: nodePath.resolve(process.cwd()),
    src: 'src',
    dist: 'dist',
    temp: 'tmp',
    devDist: 'tmp/dev-server',
    public: 'public',
    plugins: 'plugins',
    pages: 'src/pages',
    nodeModules: 'node_modules',
    assets: '',
    ...(config.paths || {}),
  }

  // Use the root to resolve all other relative paths
  const resolvePath = relativePath =>
    nodePath.resolve(config.paths.root, relativePath)

  // Resolve all paths
  const DIST =
    process.env.REACT_STATIC_ENV === 'development'
      ? resolvePath(config.paths.devDist || config.paths.dist)
      : resolvePath(config.paths.dist)

  const ASSETS = nodePath.resolve(DIST, config.paths.assets)

  const paths = {
    ROOT: config.paths.root,
    LOCAL_NODE_MODULES: nodePath.resolve(getDirname(), '../../node_modules'),
    SRC: resolvePath(config.paths.src),
    PAGES: resolvePath(config.paths.pages),
    DIST,
    ASSETS,
    PLUGINS: resolvePath(config.paths.plugins),
    TEMP: resolvePath(config.paths.temp),
    PUBLIC: resolvePath(config.paths.public),
    NODE_MODULES: resolvePath(config.paths.nodeModules),
    EXCLUDE_MODULES:
      config.paths.excludeResolvedModules ||
      resolvePath(config.paths.nodeModules),
    PACKAGE: resolvePath('package.json'),
    HTML_TEMPLATE: nodePath.join(DIST, 'index.html'),
    STATIC_DATA: nodePath.join(ASSETS, 'staticData'),
  }

  let siteRoot = ''
  let basePath = ''

  if (process.env.REACT_STATIC_ENV === 'development') {
    basePath = cleanSlashes(config.devBasePath)
  } else if (process.env.REACT_STATIC_STAGING === 'true') {
    siteRoot = cutPathToRoot(config.stagingSiteRoot, '$1')
    basePath = cleanSlashes(config.stagingBasePath)
  } else {
    siteRoot = cutPathToRoot(config.siteRoot, '$1')
    basePath = cleanSlashes(config.basePath)
  }

  const publicPath = `${cleanSlashes(`${siteRoot}/${basePath}`)}/`

  let assetsPath = cleanSlashes(config.assetsPath || paths.assets)
  if (assetsPath && !isAbsoluteUrl(assetsPath)) {
    assetsPath = `/${cleanSlashes(`${basePath}/${assetsPath}`)}/`
  }

  // Add the project root as a plugin. This allows the dev
  // to use the plugin api directory in their project if they want
  const plugins = [...(config.plugins || []), paths.ROOT]

  const DEFAULT_ENTRY_PATH = nodePath.join(paths.SRC, DEFAULT_ENTRY)

  // Defaults
  config = {
    // Defaults
    entry:
      resolveModule(DEFAULT_ENTRY_PATH, config) || `${DEFAULT_ENTRY_PATH}.js`,
    getSiteData: () => ({}),
    prefetchRate: 5,
    maxThreads: Infinity,
    disableRoutePrefixing: false,
    outputFileRate: 100,
    extensions: DEFAULT_EXTENSIONS,
    getRoutes: async () => DEFAULT_ROUTES,
    minLoadTime: 200,
    disablePreload: false,
    disableRuntime: false,
    preloadPollInterval: 300,
    // Config Overrides
    ...config,
    // Materialized Overrides
    plugins,
    paths,
    babelExcludes: config.babelExcludes || [],
    siteRoot,
    basePath,
    publicPath,
    assetsPath,
    extractCssChunks: config.extractCssChunks || false,
    inlineCss: config.inlineCss || false,
  }

  // Set env variables to be used client side
  process.env.REACT_STATIC_MIN_LOAD_TIME = config.minLoadTime
  process.env.REACT_STATIC_PREFETCH_RATE = config.prefetchRate
  process.env.REACT_STATIC_DISABLE_ROUTE_PREFIXING =
    config.disableRoutePrefixing
  process.env.REACT_STATIC_DISABLE_PRELOAD = config.disablePreload
  process.env.REACT_STATIC_DISABLE_RUNTIME = config.disableRuntime
  process.env.REACT_STATIC_PRELOAD_POLL_INTERVAL = config.preloadPollInterval

  process.env.REACT_STATIC_TEMPLATES_PATH = nodePath.join(
    DIST,
    'react-static-templates.js'
  )
  process.env.REACT_STATIC_PLUGINS_PATH = nodePath.join(
    DIST,
    'react-static-browser-plugins.js'
  )
  process.env.REACT_STATIC_UNIVERSAL_PATH = require.resolve(
    'react-universal-component'
  )

  const resolvePlugin = originalLocation => {
    let options = {}
    if (Array.isArray(originalLocation)) {
      options = originalLocation[1] || {}
      originalLocation = originalLocation[0]
    }

    const location = [
      () => {
        // Absolute
        if (fs.pathExistsSync(originalLocation)) {
          return originalLocation
        }
      },
      () => {
        // Absolute require
        try {
          const found = require.resolve(originalLocation)
          return found.includes('.') ? nodePath.resolve(found, '../') : found
        } catch (err) {
          //
        }
      },
      () => {
        // Plugins Dir
        const found = nodePath.resolve(paths.PLUGINS, originalLocation)
        if (fs.pathExistsSync(found)) {
          return found
        }
      },
      () => {
        // Plugins Dir require
        try {
          const found = resolveFrom(paths.PLUGINS, originalLocation)
          return found.includes('.') ? nodePath.resolve(found, '../') : found
        } catch (err) {
          //
        }
      },
      () => {
        // CWD
        const found = nodePath.resolve(process.cwd(), originalLocation)
        if (fs.pathExistsSync(found)) {
          return found
        }
      },
      () => {
        // CWD require
        try {
          const found = resolveFrom(process.cwd(), originalLocation)
          return found.includes('.') ? nodePath.resolve(found, '../') : found
        } catch (err) {
          //
        }
      },
      () => {
        if (process.env.NODE_ENV === 'test') {
          // Allow plugins to be mocked
          return 'mock-plugin'
        }
      },
    ].reduce((prev, curr) => prev || curr(), null)

    // TODO: We have to do this because we don't have a good mock for process.cwd() :(
    if (!location) {
      throw new Error(
        `Oh crap! Could not find a plugin directory for the plugin: "${location}". We must bail!`
      )
    }

    const nodeLocation = resolveModule(
      nodePath.join(location, 'node.api'),
      config
    )
    const browserLocation = resolveModule(
      nodePath.join(location, 'browser.api'),
      config
    )
    let getHooks = () => ({})

    try {
      // Get the hooks for the node api
      if (nodeLocation) {
        getHooks = require(nodeLocation).default
      }

      const resolvedPlugin = {
        location,
        nodeLocation,
        browserLocation,
        options,
        hooks: getHooks(options) || {},
      }

      // Recursively resolve plugins
      if (resolvedPlugin.plugins) {
        resolvedPlugin.plugins = resolvedPlugin.plugins.map(resolvePlugin)
      }

      return resolvedPlugin
    } catch (err) {
      console.error(
        `The following error occurred in the plugin located at "${nodeLocation}"`
      )
      throw err
    }
  }

  config.plugins = config.plugins.map(resolvePlugin)

  const configHook = makeHookReducer(config.plugins, 'config')
  config = await configHook(config)

  return config
}

const buildConfigFromPath = async configPath => {
  delete require.cache[configPath]
  const config = require(configPath).default
  return buildConfig(config)
}

// Retrieves the static.config.js from the current project directory
export default (async function getConfig(
  configPath = DEFAULT_PATH_FOR_STATIC_CONFIG,
  subscription
) {
  const resolvedPath = resolveModule(configPath)

  const noConfig =
    configPath === DEFAULT_PATH_FOR_STATIC_CONFIG && !resolvedPath

  if (noConfig) {
    if (subscription) {
      return new Promise(async () => {
        subscription(await buildConfig(defaultConfig))
      })
    }
    return buildConfig(defaultConfig)
  }

  const config = await buildConfigFromPath(resolvedPath || configPath)

  if (subscription) {
    // If subscribing, return a never ending promise
    return new Promise(() => {
      chokidar.watch(resolvedPath).on('all', async () => {
        subscription(await buildConfigFromPath(resolvedPath))
      })
    })
  }

  return config
})

function resolveModule(path, config) {
  try {
    // Load any module extension that is supported by Node (.js, .mjs, .node, etc),
    // or that have been registered via Node require hooks (.jsx, .ts, etc)
    return require.resolve(path)
  } catch {
    // Fallback to the extensions that have been registered with Babel
    const extensions = (config && config.extensions) || DEFAULT_EXTENSIONS
    return extensions.map(ext => path + ext).find(fs.pathExistsSync)
  }
}
