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
const DEFAULT_NAME_FOR_STATIC_CONFIG_FILE = 'static.config.js'
const DEFAULT_PATH_FOR_STATIC_CONFIG = nodePath.resolve(
  nodePath.join(process.cwd(), DEFAULT_NAME_FOR_STATIC_CONFIG_FILE)
)
const DEFAULT_ROUTES = [{ path: '/' }]
const DEFAULT_ENTRY = 'index.js'
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
  const configPath =
    state.configPath ||
    state.packageConfig.config ||
    DEFAULT_PATH_FOR_STATIC_CONFIG

  state = {
    ...state,
    originalConfig: configPath,
  }

  const resolvedPath = nodePath.resolve(configPath)

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
  // Default Paths
  let paths = {
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
  const resolvePath = relativePath => nodePath.resolve(paths.root, relativePath)

  // Resolve and replace all pathss
  const DIST =
    process.env.REACT_STATIC_ENV === 'development'
      ? resolvePath(paths.devDist || paths.dist)
      : resolvePath(paths.dist)
  const ASSETS = nodePath.resolve(DIST, paths.assets)

  paths = {
    ROOT: paths.root,
    SRC: resolvePath(paths.src),
    DIST,
    ASSETS,
    PLUGINS: resolvePath(paths.plugins),
    TEMP: resolvePath(paths.temp),
    ARTIFACTS: resolvePath(paths.buildArtifacts),
    PUBLIC: resolvePath(paths.public),
    NODE_MODULES: resolvePath(paths.nodeModules),
    EXCLUDE_MODULES:
      paths.excludeResolvedModules || resolvePath(paths.nodeModules),
    PACKAGE: resolvePath('package.json'),
    HTML_TEMPLATE: nodePath.join(DIST, 'index.html'),
    STATIC_DATA: nodePath.join(ASSETS, 'staticData'),
  }

  // siteRoot, basePath, publicPath, and assetPath resolution
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

  // if (process.env.NODE_ENV !== 'test' && !entry) {
  //   throw new Error(
  //     `Could not resolve entry file from location: ${entry} using extensions: ${(
  //       config.extensions || DEFAULT_EXTENSIONS
  //     ).join(', ')}`
  //   )
  // }

  // Defaults
  config = {
    // Defaults
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
    entry: DEFAULT_ENTRY,

    // Config Overrides
    ...config,

    // Materialized Overrides
    paths,
    plugins,
    siteRoot,
    basePath,
    publicPath,
    assetsPath,
    extractCssChunks: config.extractCssChunks || false,
    inlineCss: config.inlineCss || false,
    babelExcludes: config.babelExcludes || [],
    devServer: {
      host: 'localhost',
      port: 3000,
      ...(config.devServer || {}),
    },
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

    let nodeLocation = nodePath.join(location, 'node.api.js')
    let browserLocation = nodePath.join(location, 'browser.api.js')

    // Detect if the node plugin entry exists, and provide the nodeResolver to it
    nodeLocation = fs.pathExistsSync(nodeLocation) ? nodeLocation : null

    // Detect if the browser plugin entry exists, and provide the nodeResolver to it
    browserLocation = fs.pathExistsSync(browserLocation)
      ? browserLocation
      : null

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
