import {
  uglifyJSPlugin
} from './plugins'

import {
  eslintLoader,
  cssLoader
} from './rules'

const webpack = (config, { stage, defaultLoaders }) => {
  if (stage === 'dev') {
    defaultLoaders.cssLoader.use[1].options = {
      importLoaders: 1,
      modules: true,
      localIdentName: '[name]__[local]___[hash:base64:5]'
    }

    config.module.rules = [
      eslintLoader,
      {
        oneOf: [
          defaultLoaders.jsLoader,
          defaultLoaders.cssLoader,
          defaultLoaders.fileLoader
        ]
      }
    ]
  } else {
    config.plugins = [
      ...config.plugins,
      uglifyJSPlugin
    ]

    config.module.rules = [
      eslintLoader,
      {
        oneOf: [
          defaultLoaders.jsLoader,
          cssLoader,
          defaultLoaders.fileLoader
        ]
      }
    ]
  }

  return config
}

export default webpack
