import ExtractCssChunks from 'extract-css-chunks-webpack-plugin'

export default (options = {}) => ({
  webpack: (config, { stage }) => {
    let loaders = []

    const cssLoader = {
      loader: 'css-loader',
      options: {
        modules: true,
        importLoaders: 1,
        ...options,
      },
    }

    if (stage === 'dev') {
      // Dev
      loaders = [
        {
          loader: ExtractCssChunks.loader,
          options: {
            hot: true,
            reloadAll: true,
          },
        },
        cssLoader,
      ]
    } else if (stage === 'node') {
      loaders = [
        {
          ...cssLoader,
          loader: 'css-loader',
          options: {
            exportOnlyLocals: true,
            ...options,
          },
        },
      ]
    } else {
      // Prod
      loaders = [ExtractCssChunks.loader, cssLoader]
    }

    config.module.rules[0].oneOf.unshift({
      test: /\.css$/,
      use: loaders,
    })

    return config
  },
})
