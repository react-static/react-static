import webpack from 'webpack'
import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ScriptExtHtmlWebpackPlugin from 'script-ext-html-webpack-plugin'
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import nodeExternals from 'webpack-node-externals'

//
import rules from './rules'
import { ROOT, DIST, NODE_MODULES, SRC, HTML_TEMPLATE } from '../paths'

export default function ({ config, isNode }) {
  return {
    context: path.resolve(__dirname, '../node_modules'),
    entry: path.resolve(ROOT, config.entry),
    output: {
      filename: isNode ? 'app.static.[hash:8].js' : 'app.[hash:8].js',
      path: DIST,
      publicPath: '/',
      libraryTarget: isNode ? 'umd' : undefined,
    },
    target: isNode ? 'node' : undefined,
    externals: isNode ? [nodeExternals()] : [],
    module: {
      rules: rules({ stage: 'prod' }),
    },
    resolve: {
      modules: [path.resolve(__dirname, '../node_modules'), NODE_MODULES, SRC, DIST],
      extensions: ['.js', '.json', '.jsx'],
    },
    plugins: [
      new webpack.EnvironmentPlugin({
        ...process.env,
        NODE_ENV: 'production',
      }),
      new HtmlWebpackPlugin({
        inject: true,
        template: HTML_TEMPLATE,
        filename: path.join(DIST, 'index.html'),
      }),
      new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: 'async',
      }),
      new CaseSensitivePathsPlugin(),
      new ExtractTextPlugin({
        filename: getPath => {
          process.env.extractedCSSpath = 'styles.css'
          return getPath('styles.css')
        },
        allChunks: true,
      }),
      !isNode ? new webpack.optimize.UglifyJsPlugin() : null,
      config.bundleAnalyzer ? new BundleAnalyzerPlugin() : null,
    ].filter(d => d),

    devtool: 'source-map',
  }
}
