import ExtractCssChunks from 'extract-css-chunks-webpack-plugin'
import semver from 'semver';

export default ({ includePaths = [], ...rest }) => ({
  webpack: (config, { stage }) => {
    let loaders = []

    const sassLoaderPath = require.resolve('sass-loader')

    const sassLoader = {
      loader: sassLoaderPath,
      options: { includePaths: ['src/', ...includePaths], ...rest },
    }
    const styleLoader = { loader: 'style-loader' }
    const cssLoader = {
      loader: 'css-loader',
      options: {
        importLoaders: 1,
        sourceMap: false,
      },
    }

    if (stage === 'dev') {
      // Dev
      loaders = [styleLoader, cssLoader, sassLoader]
    } else if (stage === 'node') {
      // Node
      // Don't extract css to file during node build process
      loaders = [cssLoader, sassLoader]
    } else {
      // Prod

      // for legacy css-loader version (<2.0) we need to add "minimize" to minify css code
      // for >2.0 it is handled with https://github.com/NMFR/optimize-css-assets-webpack-plugin
      const cssLoaderVersion = require('css-loader/package.json').version;
      if (semver.satisfies(cssLoaderVersion, '<2') === true) {
        cssLoader.options.minimize = true;
      }

      loaders = [ExtractCssChunks.loader, cssLoader, sassLoader]
    }

    config.module.rules[0].oneOf.unshift({
      test: /\.s(a|c)ss$/,
      use: loaders,
    })

    return config
  },
})
