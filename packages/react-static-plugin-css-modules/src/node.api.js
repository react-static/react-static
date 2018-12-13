import ExtractCssChunks from 'extract-css-chunks-webpack-plugin'

export default (options = {}) => ({
  webpack: (config, { stage }) => {
    let loaders = []

    const styleLoader = { loader: 'style-loader' }
    const cssLoader = {
      loader: 'css-loader',
      options: {
        modules: true,
        importLoaders: 1,
        ...options
      }
    };

    if (stage === 'dev') {
      // Dev
      loaders = [styleLoader, cssLoader]
    } else if (stage === 'node') {
      loaders = [
        { ...cssLoader, loader: 'css-loader/locals' },
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
