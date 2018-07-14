import ExtractCssChunks from 'extract-css-chunks-webpack-plugin'

export const webpack = (config, { stage }) => {
  let loaders = []

  const sassLoaderPath = require.resolve('sass-loader')

  const sassLoader = { loader: sassLoaderPath }
  const styleLoader = { loader: 'style-loader' }
  const cssLoader = {
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      minimize: stage === 'prod',
      sourceMap: false,
    },
  }

  if (stage === 'dev') {
    // Dev
    loaders = [styleLoader, cssLoader, sassLoader]
  } else if (stage === 'node') {
    // Node
    // Don't extract css to file during node build process
    loaders = [
      cssLoader,
      {
        loader: require.resolve('sass-loader'),
        options: { includePaths: ['src/'] },
      },
    ]
  } else {
    // Prod
    loaders = [ExtractCssChunks.loader, cssLoader, sassLoader]
  }

  config.module.rules[0].oneOf.unshift({
    test: /\.s(a|c)ss$/,
    use: loaders,
  })

  return config
}
