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

export default function ({ config, isNode }) {
  const { ROOT, DIST, NODE_MODULES, SRC, HTML_TEMPLATE } = config.paths
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
      rules: rules({ config, stage: 'prod' }),
    },
    resolve: {
      modules: [path.resolve(__dirname, '../node_modules'), NODE_MODULES, SRC, DIST],
      extensions: ['.js', '.json', '.jsx'],
    },
    plugins: [
      new webpack.EnvironmentPlugin(process.env),
      new ExtractTextPlugin({
        filename: getPath => {
          process.env.extractedCSSpath = getPath('styles.[hash:8].css')
          return process.env.extractedCSSpath
        },
        allChunks: true,
      }),
      new HtmlWebpackPlugin({
        inject: true,
        filename: HTML_TEMPLATE,
        // We dont use a template here because we are only concerned with the
        // output files, given that the index.html will also be overwritten by
        // the static export in the end.
      }),
      new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: 'async',
      }),
      new CaseSensitivePathsPlugin(),
      !isNode ? new webpack.optimize.UglifyJsPlugin() : null,
      config.bundleAnalyzer ? new BundleAnalyzerPlugin() : null,
    ].filter(d => d),

    devtool: 'source-map',
  }
}
