/* eslint-disable import/no-dynamic-require */

import nodePath from 'path'
import chokidar from 'chokidar'
import resolveFrom from 'resolve-from'
import fs from 'fs-extra'
//
import { cleanSlashes, cutPathToRoot, isAbsoluteUrl } from '../utils'
import corePlugins, { validatePlugin } from './plugins'

// the default static.config.js location
const defaultConfig = {}
const DEFAULT_NAME_FOR_STATIC_CONFIG_FILE = 'static.config'
const DEFAULT_PATH_FOR_STATIC_CONFIG = nodePath.resolve(
  nodePath.join(process.cwd(), DEFAULT_NAME_FOR_STATIC_CONFIG_FILE)
)
const DEFAULT_ROUTES = [{ path: '/' }]
const DEFAULT_ENTRY = 'index'
const DEFAULT_EXTENSIONS = ['.js', '.jsx']

// Retrieves the static.config.js from the current project directory
export default function getConfig(
  state,
  callback = config => {
    if (state.debug) {
      console.log('getConfig():')
      console.log(state)
    }
    return config
  }
) {
  const configPath = state.configPath || DEFAULT_PATH_FOR_STATIC_CONFIG

  state = {
    ...state,
    originalConfig: configPath,
  }

  const resolvedPath = resolveModule(configPath)

  const noConfig =
    configPath === DEFAULT_PATH_FOR_STATIC_CONFIG && !resolvedPath

  if (noConfig) {
    // last
    state = buildConfig(state, defaultConfig)
    return callback(state)
  }

  state = buildConfigFromPath(state, resolvedPath || configPath)

  if (state.stage === 'dev') {
    chokidar
      .watch(resolvedPath, {
        ignoreInitial: true,
      })
      .on('all', async () => {
        console.log('')
        console.log(`Updating static.config.js`)
        state = buildConfigFromPath(state, resolvedPath)
        callback(state)
      })
  }

  return callback(state)
}

function buildConfigFromPath(state, configPath) {
  delete require.cache[configPath]
  const config = require(configPath).default
  return buildConfig(state, config)
}

export function buildConfig(state, config = {}) {
  // path defaults
  config.paths = {
    root: nodePath.resolve(process.cwd()),
    src: 'src',
    dist: 'dist',
    temp: 'tmp',
    buildArtifacts: 'artifacts',
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
    SRC: resolvePath(config.paths.src),
    DIST,
    ASSETS,
    PLUGINS: resolvePath(config.paths.plugins),
    TEMP: resolvePath(config.paths.temp),
    ARTIFACTS: resolvePath(config.paths.buildArtifacts),
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
  } else if (state.staging) {
    siteRoot = cutPathToRoot(config.stagingSiteRoot || '/', '$1')
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
    productionSourceMaps: false,
    // Config Overrides
    ...config,
    // Materialized Overrides
    devServer: {
      host: 'http://localhost',
      port: 3000,
      ...config.devServer,
    },
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

  config.terser = config.terser || {}
  config.terser.terserOptions = config.terser.terserOptions || {}
  config.terser.terserOptions.mangle = config.terser.terserOptions.mangle || {}
  config.terser.terserOptions.parse = config.terser.terserOptions.parse || {}
  config.terser.terserOptions.compress =
    config.terser.terserOptions.compress || {}
  config.terser.terserOptions.output = config.terser.terserOptions.output || {}

  // Set env variables to be used client side
  process.env.REACT_STATIC_MIN_LOAD_TIME = config.minLoadTime
  process.env.REACT_STATIC_PREFETCH_RATE = config.prefetchRate
  process.env.REACT_STATIC_DISABLE_ROUTE_PREFIXING =
    config.disableRoutePrefixing
  process.env.REACT_STATIC_DISABLE_PRELOAD = config.disablePreload
  process.env.REACT_STATIC_DISABLE_RUNTIME = config.disableRuntime
  process.env.REACT_STATIC_PRELOAD_POLL_INTERVAL = config.preloadPollIntervalw

  process.env.REACT_STATIC_TEMPLATES_PATH = nodePath.join(
    paths.ARTIFACTS,
    'react-static-templates.js'
  )
  process.env.REACT_STATIC_PLUGINS_PATH = nodePath.join(
    paths.ARTIFACTS,
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
        // Absolute require
        try {
          const found = require.resolve(originalLocation)
          return found.includes('.') ? nodePath.resolve(found, '../') : found
        } catch (err) {
          //
        }
      },
      () => {
        // Absolute
        if (fs.pathExistsSync(originalLocation)) {
          return originalLocation
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
        `Could not find a plugin directory for the plugin: "${originalLocation}". We must bail!`
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
    let buildPluginHooks = () => ({})

    try {
      // Get the hooks for the node api
      if (nodeLocation) {
        buildPluginHooks = require(nodeLocation).default
      } else if (originalLocation !== paths.ROOT && !browserLocation) {
        throw new Error(
          `Could not find a valid node.api.js or browser.api.js plugin file in "${location}"`
        )
      }

      const resolvedPlugin = {
        location,
        nodeLocation,
        browserLocation,
        options,
        hooks: buildPluginHooks(options) || {},
      }

      validatePlugin(resolvedPlugin)

      // Recursively resolve plugins
      if (resolvedPlugin.plugins) {
        resolvedPlugin.plugins = resolvedPlugin.plugins.map(resolvePlugin)
      }

      return resolvedPlugin
    } catch (err) {
      console.error(
        `The following error occurred in the plugin: "${originalLocation}"`
      )
      throw err
    }
  }

  state = {
    ...state,
    plugins: config.plugins.map(resolvePlugin),
    config,
  }

  return corePlugins.afterGetConfig(state)
}

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
