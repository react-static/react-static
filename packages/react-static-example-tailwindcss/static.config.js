import path from 'path'

import autoprefixer from 'autoprefixer'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes'
import tailwindcss from 'tailwindcss'

export default {
  // TODO: This is deprecated, use config.hooks.webpack
  webpack: (config, { stage, defaultLoaders }) => {
    let loaders = [
      {
        loader: 'css-loader',
        options: {
          minimize: stage !== 'dev',
          sourceMap: stage === 'dev',
          importLoaders: 1,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          // Necessary for external CSS imports to work
          // https://github.com/facebookincubator/create-react-app/issues/2677
          sourceMap: true,
          ident: 'postcss',
          plugins: () => [
            postcssFlexbugsFixes,
            autoprefixer({
              browsers: [
                '>1%',
                'last 4 versions',
                'Firefox ESR',
                'not ie < 9', // React doesn't support IE8 anyway
              ],
              flexbox: 'no-2009',
            }),
            tailwindcss(path.resolve(__dirname, './tailwind.config.js')),
          ],
        },
      },
    ]

    if (stage === 'dev') {
      loaders = ['style-loader'].concat(loaders)
    } else if (stage === 'prod') {
      loaders = ExtractTextPlugin.extract({
        fallback: {
          loader: 'style-loader',
          options: {
            sourceMap: false,
            hmr: false,
          },
        },
        use: loaders,
      })
    }

    config.module.rules = [
      {
        oneOf: [
          defaultLoaders.jsLoader,
          {
            test: /\.css$/,
            use: loaders,
          },
          defaultLoaders.fileLoader,
        ],
      },
    ]
    return config
  },
}
