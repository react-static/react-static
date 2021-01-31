import { readFileSync } from 'fs'
import path from 'path'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import convertPathsToAliases from 'convert-tsconfig-paths-to-webpack-aliases'
import { parseConfigFileTextToJson, findConfigFile, sys } from 'typescript'

export default options => ({
  afterGetConfig: getReactStaticConfigExtender(),
  webpack: webpack(options),
})

function webpack(options) {
  const tsconfigLocation = findConfigFile('./', sys.fileExists)
  const tsconfigPath = tsconfigLocation
    ? path.resolve(tsconfigLocation)
    : tsconfigLocation
  const parsedTsConfig = tsconfigPath
    ? parseConfigFileTextToJson(
        tsconfigPath,
        readFileSync(tsconfigPath, 'utf8')
      )
    : { config: {} }
  const tsAliases =
    parsedTsConfig.config.compilerOptions &&
    parsedTsConfig.config.compilerOptions.paths
      ? convertPathsToAliases(parsedTsConfig.config)
      : {}

  return (previousConfig, state) => {
    const previousModuleConfig = previousConfig.module || {}
    const previousResolveConfig = previousConfig.resolve || {}
    const previousResolveExtensions = previousResolveConfig.extensions || []

    const typescriptLoader = getTypeScriptLoader(state.defaultLoaders.jsLoader)

    const plugins = previousConfig.plugins || []
    if ((options || {}).typeCheck !== false) {
      plugins.push(getTypecheckPlugin(tsconfigPath))
    }

    const loaders =
      Array.isArray(previousModuleConfig.rules) &&
      previousModuleConfig.rules.length > 0 &&
      Array.isArray(previousModuleConfig.rules[0].oneOf)
        ? [...previousModuleConfig.rules[0].oneOf]
        : [
            state.defaultLoaders.jsLoader,
            state.defaultLoaders.jsLoaderExt,
            state.defaultLoaders.cssLoader,
            state.defaultLoaders.fileLoader,
          ]

    if (loaders.indexOf(state.defaultLoaders.jsLoader) !== -1) {
      // If the default Javascript loader is still present, replace it with the TypeScript loader:
      loaders[loaders.indexOf(state.defaultLoaders.jsLoader)] = typescriptLoader
    } else {
      // Otherwise just add the TypeScript loader to the list of loaders, before the others:
      loaders.unshift(typescriptLoader)
    }

    return {
      ...previousConfig,
      plugins,
      resolve: {
        ...previousResolveConfig,
        extensions: previousResolveExtensions.concat(['.ts', '.tsx']),
        alias: {
          ...previousResolveConfig.alias,
          ...tsAliases,
        },
      },
      module: {
        ...previousModuleConfig,
        rules: [
          {
            oneOf: loaders,
          },
        ],
      },
    }
  }
}

function getReactStaticConfigExtender() {
  return state => ({
    ...state,
    config: {
      ...state.config,
      extensions: state.config.extensions.concat(['.ts', '.tsx']),
    },
  })
}

function getTypeScriptLoader(jsLoader) {
  const jsLoaderBabelPresets = jsLoader.use[0].options.presets || []

  const typescriptLoader = {
    ...jsLoader,
    test: /\.(js|jsx|ts|tsx)$/,
    use: [
      {
        ...jsLoader.use[0],
        options: {
          ...jsLoader.use[0].options,
          presets: jsLoaderBabelPresets.concat('@babel/preset-typescript'),
        },
      },
    ],
  }

  return typescriptLoader
}

function getTypecheckPlugin(tsconfigPath) {
  return new ForkTsCheckerWebpackPlugin({
    async: false,
    typescript: {
      configFile: tsconfigPath,
    },
  })
}
