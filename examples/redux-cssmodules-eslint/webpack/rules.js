import autoprefixer from 'autoprefixer'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import eslintFormatter from 'react-dev-utils/eslintFormatter'

const path = require('path')
const fs = require('fs')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

export const eslintLoader = {
  test: /\.js$/,
  enforce: 'pre',
  use: [
    {
      options: {
        formatter: eslintFormatter,
        eslintPath: require.resolve('eslint')
      },
      loader: require.resolve('eslint-loader')
    }
  ],
  include: resolveApp('src')
}

export const cssLoader = {
  test: /\.css$/,
  loader: ExtractTextPlugin.extract({
    fallback: require.resolve('style-loader'),
    use: [
      {
        loader: require.resolve('css-loader'),
        options: {
          importLoaders: 1,
          modules: true,
          minimize: true,
          sourceMap: false,
          localIdentName: '[hash:base64:5]'
        }
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          // Necessary for external CSS imports to work
          // https://github.com/facebookincubator/create-react-app/issues/2677
          ident: 'postcss',
          plugins: () => [
            require('postcss-flexbugs-fixes'),
            autoprefixer({
              browsers: [
                '>1%',
                'last 4 versions',
                'Firefox ESR',
                'safari 9',
                'not ie < 9' // React doesn't support IE8 anyway
              ],
              flexbox: 'no-2009'
            })
          ]
        }
      }
    ]
  })
}
