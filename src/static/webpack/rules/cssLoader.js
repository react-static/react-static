import autoprefixer from 'autoprefixer'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin'
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes'

export default function ({ config, stage, isNode }) {
  let cssLoader = [
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1,
        minimize: stage === 'prod',
        sourceMap: false,
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
        ],
      },
    },
  ]

  if (stage === 'dev') {
    cssLoader = ['style-loader'].concat(cssLoader)
  } else if (!isNode) {
    cssLoader = (config.extractCssChunks
      ? ExtractCssChunks
      : ExtractTextPlugin
    ).extract({
      fallback: {
        loader: 'style-loader',
        options: {
          sourceMap: false,
          hmr: false,
        },
      },
      use: cssLoader,
    })
  }

  return {
    test: /\.css$/,
    loader: cssLoader,
  }
}
