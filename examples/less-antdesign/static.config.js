import axios from 'axios'
import React, { Component } from 'react'
import { ServerStyleSheet } from 'styled-components'
/*
* For Less Support
* */
import autoprefixer from 'autoprefixer'
import ExtractCSS from 'extract-css-chunks-webpack-plugin'
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes'

/*
* For TypeScript Support
* */
const typescriptWebpackPaths = require('./webpack.config.js')

const path = require('path')
const fs = require('fs')

const lessToJs = require('less-vars-to-js')

const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, 'src/theme-ant-overwrite.less'), 'utf8'))

const webpack = require('webpack')

//
export default {
  getSiteData: () => ({
    title: 'React Static',
  }),
  getRoutes: async () => {
    const { data: posts } = await axios.get('https://jsonplaceholder.typicode.com/posts')
    return [
      {
        path: '/',
        component: 'src/containers/Home',
      },
      {
        path: '/about',
        component: 'src/containers/About',
      },
      {
        path: '/blog',
        component: 'src/containers/Blog',
        getData: () => ({
          posts,
        }),
        children: posts.map(post => ({
          path: `/post/${post.id}`,
          component: 'src/containers/Post',
          getData: () => ({
            post,
          }),
        })),
      },
      {
        path: '404',
        component: 'src/containers/404',
      },
    ]
  },
  renderToHtml: (render, Comp, meta) => {
    const sheet = new ServerStyleSheet()
    const html = render(sheet.collectStyles(<Comp />))
    meta.styleTags = sheet.getStyleElement()
    return html
  },
  Document: class CustomHtml extends Component {
    render () {
      const {
        Html, Head, Body, children, renderMeta,
      } = this.props

      return (
        <Html>
          <Head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            {renderMeta.styleTags}
          </Head>
          <Body>
            {children}
          </Body>
        </Html>
      )
    }
  },
  webpack: (config, { stage, defaultLoaders }) => {
    /*
    * TypeScript Support
    * */

    // Add .ts and .tsx extension to resolver
    config.resolve.extensions.push('.ts', '.tsx')

    // Add TypeScript Path Mappings (from tsconfig via webpack.config.js)
    // to react-statics alias resolution
    config.resolve.alias = typescriptWebpackPaths.resolve.alias

    // Needed for momoent js resolution in React 16
    // See: https://github.com/moment/moment/issues/2979#issuecomment-332217206
    config.resolve.alias.moment$ = 'moment/moment.js'

    // We replace the existing JS rule with one, that allows us to use
    // both TypeScript and JavaScript interchangeably
    const jsTsLoader = {
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: defaultLoaders.jsLoader.exclude, // as std jsLoader exclude
      use: [
        {
          loader: 'babel-loader',
        },
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      ],
    }

    /*
    * Less Support
    * */

    // Add .less & .css to resolver
    config.resolve.extensions.push('.less')
    config.resolve.extensions.push('.css')

    // Loader depending on stage. Same format as the default cssLoader.
    let loaders = [
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
          minimize: stage !== 'dev',
          sourceMap: true,
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
      {
        loader: 'less-loader',
        options: {
          sourceMap: true,
          modifyVars: themeVariables,
          javascriptEnabled: true,
        },
      },
    ]

    if (stage === 'dev') {
      // Enable Hot Module Replacement
      config.plugins.push(new webpack.HotModuleReplacementPlugin())

      // In-Line with style-loader
      loaders = ['style-loader'].concat(loaders)
    } else if (stage === 'prod') {
      // Extract to style.css
      loaders = {
        use: [ExtractCSS.loader].concat(loaders),
      }
    }

    const lessLoader = {
      test: /\.less$/,
      use: loaders,
    }

    /*
    * Add new Loaders to default Loaders
    * */

    config.module.rules = [
      {
        oneOf: [jsTsLoader, lessLoader, defaultLoaders.cssLoader, defaultLoaders.fileLoader],
      },
    ]

    if (stage === 'prod') {
      // Update ExtractTextPlugin with current instance
      config.plugins.forEach((plugin, index) => {
        if (plugin instanceof ExtractCSS) {
          config.plugins[index] = new ExtractCSS({
            filename: getPath => {
              process.env.extractedCSSpath = 'styles.css'
              return getPath('styles.css')
            },
          })
        }
      })
    }

    return config
  },
}
