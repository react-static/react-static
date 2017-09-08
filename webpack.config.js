const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  entry: ['babel-polyfill', 'react-hot-loader/patch', './src/index.js'],
  output: {
    path: `${__dirname}/dist`,
    publicPath: '/',
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: './dist',
  },
  resolve: {
    alias:
      process.env.NODE_ENV === 'production'
        ? {
          react: 'preact-compat',
          'react-dom': 'preact-compat',
        }
        : {},
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV', 'IS_STATIC']),
    // new webpack.optimize.UglifyJsPlugin(),
    // new BundleAnalyzerPlugin(),
  ],
}
