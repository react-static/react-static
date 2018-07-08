/* eslint-disable import/first, import/no-dynamic-require */

require('babel-register')
require('../utils/binHelper')

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import Helmet from 'react-helmet'
import { ReportChunks } from 'react-universal-component'
import flushChunks from 'webpack-flush-chunks'
import glob from 'glob'
import path from 'path'
import fs from 'fs-extra'

import getConfig from './getConfig'
import { DefaultDocument } from './RootComponents'
import { poolAll } from '../utils/shared'
import { makeHtmlWithMeta } from './components/HtmlWithMeta'
import { makeHeadWithMeta } from './components/HeadWithMeta'
import { makeBodyWithMeta } from './components/BodyWithMeta'
import Redirect from '../client/components/Redirect'

//

let cachedBasePath
let cachedHrefReplace
let cachedSrcReplace

// Inject allProps into static build
class InitialPropsContext extends Component {
  static childContextTypes = {
    routeInfo: PropTypes.object,
    staticURL: PropTypes.string,
  }
  getChildContext () {
    const { embeddedRouteInfo, route } = this.props
    return {
      routeInfo: embeddedRouteInfo,
      staticURL: route.path === '/' ? route.path : `/${route.path}`,
    }
  }
  render () {
    return this.props.children
  }
}

process.on('message', async payload => {
  try {
    const { config: oldConfig, routes, defaultOutputFileRate } = payload
    // Get config again
    const config = await getConfig(oldConfig.originalConfig)
    // Use the node version of the app created with webpack
    const Comp = require(glob.sync(path.resolve(config.paths.DIST, 'static.*.js'))[0]).default
    // Retrieve the document template
    const DocumentTemplate = config.Document || DefaultDocument

    const tasks = []
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i]
      tasks.push(async () => {
        await exportRoute({
          ...payload,
          config,
          route,
          Comp,
          DocumentTemplate,
        })
        if (process.connected) {
          process.send({ type: 'tick' })
        }
      })
    }
    await poolAll(tasks, Number(config.outputFileRate) || defaultOutputFileRate)
    if (process.connected) {
      process.send({ type: 'done' })
    }
  } catch (err) {
    if (process.connected) {
      process.send({ type: 'error', err })
    }
  }
})

async function exportRoute ({
  config, Comp, DocumentTemplate, route, siteData, clientStats,
}) {
  const {
    sharedPropsHashes, templateID, localProps, allProps, path: routePath,
  } = route

  const basePath =
    cachedBasePath ||
    (cachedBasePath =
      process.env.REACT_STATIC_STAGING === 'true' ? config.stagingBasePath : config.basePath)

  const hrefReplace =
    cachedHrefReplace ||
    (cachedHrefReplace = new RegExp(
      `(href=["'])\\/(${basePath ? `${basePath}\\/` : ''})?([^\\/])`,
      'gm'
    ))

  const srcReplace =
    cachedSrcReplace ||
    (cachedSrcReplace = new RegExp(
      `(src=["'])\\/(${basePath ? `${basePath}\\/` : ''})?([^\\/])`,
      'gm'
    ))

  // This routeInfo will be saved to disk. It should only include the
  // localProps and hashes to construct all of the props later.
  const routeInfo = {
    path: routePath,
    templateID,
    sharedPropsHashes,
    localProps,
  }

  // This embeddedRouteInfo will be inlined into the HTML for this route.
  // It should only include the full props, not the partials.
  const embeddedRouteInfo = {
    ...routeInfo,
    localProps: null,
    allProps,
    siteData,
  }

  // Make a place to collect chunks, meta info and head tags
  const renderMeta = {}
  const chunkNames = []
  let head = {}
  let clientScripts = []
  let clientStyleSheets = []
  let clientCss = {}

  let FinalComp

  if (route.redirect) {
    FinalComp = () => <Redirect fromPath={route.path} to={route.redirect} />
  } else {
    FinalComp = props => (
      <ReportChunks report={chunkName => chunkNames.push(chunkName)}>
        <InitialPropsContext embeddedRouteInfo={embeddedRouteInfo} route={route}>
          <Comp {...props} />
        </InitialPropsContext>
      </ReportChunks>
    )
  }

  const renderToStringAndExtract = comp => {
    // Rend the app to string!
    const appHtml = renderToString(comp)
    const { scripts, stylesheets, css } = flushChunks(clientStats, {
      chunkNames,
    })

    clientScripts = scripts
    clientStyleSheets = stylesheets
    clientCss = css
    // Extract head calls using Helmet synchronously right after renderToString
    // to not introduce any race conditions in the meta data rendering
    const helmet = Helmet.renderStatic()
    head = {
      htmlProps: helmet.htmlAttributes.toComponent(),
      bodyProps: helmet.bodyAttributes.toComponent(),
      base: helmet.base.toComponent(),
      link: helmet.link.toComponent(),
      meta: helmet.meta.toComponent(),
      noscript: helmet.noscript.toComponent(),
      script: helmet.script.toComponent(),
      style: helmet.style.toComponent(),
      title: helmet.title.toComponent(),
    }

    return appHtml
  }

  let appHtml

  try {
    // Allow extractions of meta via config.renderToString
    appHtml = await config.renderToHtml(
      renderToStringAndExtract,
      FinalComp,
      renderMeta,
      clientStats
    )
  } catch (error) {
    error.message = `Failed exporting HTML for URL ${route.path} (${route.component}): ${
      error.message
    }`
    throw error
  }

  const DocumentHtml = renderToStaticMarkup(
    <DocumentTemplate
      Html={makeHtmlWithMeta({ head })}
      Head={makeHeadWithMeta({
        head,
        route,
        clientScripts,
        config,
        clientStyleSheets,
        clientCss,
      })}
      Body={makeBodyWithMeta({
        head,
        route,
        embeddedRouteInfo,
        clientScripts,
        config,
      })}
      siteData={siteData}
      routeInfo={embeddedRouteInfo}
      renderMeta={renderMeta}
    >
      <div id="root" dangerouslySetInnerHTML={{ __html: appHtml }} />
    </DocumentTemplate>
  )

  // Render the html for the page inside of the base document.
  let html = `<!DOCTYPE html>${DocumentHtml}`

  // If the siteRoot is set and we're not in staging, prefix all absolute URL's
  // with the siteRoot
  if (process.env.REACT_STATIC_DISABLE_ROUTE_PREFIXING !== 'true') {
    html = html.replace(hrefReplace, `$1${process.env.REACT_STATIC_PUBLICPATH}$3`)
  }

  html = html.replace(srcReplace, `$1${process.env.REACT_STATIC_PUBLICPATH}$3`)

  // If the route is a 404 page, write it directly to 404.html, instead of
  // inside a directory.
  const htmlFilename =
    route.path === '404'
      ? path.join(config.paths.DIST, '404.html')
      : path.join(config.paths.DIST, route.path, 'index.html')

  // Make the routeInfo sit right next to its companion html file
  const routeInfoFilename = path.join(config.paths.DIST, route.path, 'routeInfo.json')

  const res = await Promise.all([
    fs.outputFile(htmlFilename, html),
    !route.redirect ? fs.outputJson(routeInfoFilename, routeInfo) : Promise.resolve(),
  ])
  return res
}
