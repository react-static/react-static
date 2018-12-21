import React from 'react'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import Helmet from 'react-helmet'
import { ReportChunks } from 'react-universal-component'
import flushChunks from 'webpack-flush-chunks'
import nodePath from 'path'
import fs from 'fs-extra'

import Redirect from './components/Redirect'
import { makePathAbsolute, makeHookReducer } from '../utils'
import { absoluteToRelativeChunkName } from '../utils/chunkBuilder'

import { makeHtmlWithMeta } from './components/HtmlWithMeta'
import { makeHeadWithMeta } from './components/HeadWithMeta'
import { makeBodyWithMeta } from './components/BodyWithMeta'

//

let cachedBasePath
let cachedHrefReplace
let cachedSrcReplace

export default (async function exportRoute({
  config,
  Comp,
  DocumentTemplate,
  route,
  siteData,
  clientStats,
}) {
  const {
    sharedHashesByProp,
    templateIndex,
    data,
    sharedData,
    path: routePath,
  } = route

  const basePath = cachedBasePath || (cachedBasePath = config.basePath)

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
  // data and hashes to construct all of the props later.
  const routeInfo = {
    templateIndex,
    sharedHashesByProp,
    data,
    path: routePath,
  }

  // This embeddedRouteInfo will be inlined into the HTML for this route.
  // It should include all of the data, including shared data
  const embeddedRouteInfo = {
    ...routeInfo,
    sharedData,
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

  // Get the react component from the Comp and
  // pass it the export context. This uses
  // reactContext under the hood to pass down
  // the exportContext, since react's new context
  // api doesn't survive across bundling.
  Comp = config.disableRuntime ? Comp : Comp(embeddedRouteInfo)

  if (route.redirect) {
    FinalComp = () => <Redirect fromPath={route.path} to={route.redirect} />
  } else {
    FinalComp = props => (
      <ReportChunks
        report={chunkName => {
          // if we are building to a absolute path we must make the detected chunkName relative and matching to the one we set in generateTemplates
          if (!config.paths.DIST.startsWith(config.paths.ROOT)) {
            chunkName = absoluteToRelativeChunkName(
              config.paths.ROOT,
              chunkName
            )
          }

          chunkNames.push(chunkName)
        }}
      >
        <Comp {...props} />
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
    const beforeRenderToElementHook = makeHookReducer(
      config.plugins,
      'beforeRenderToElement'
    )
    FinalComp = await beforeRenderToElementHook(FinalComp, {
      config,
      meta: renderMeta,
    })

    // Run the configs renderToElement function
    let RenderedComp = await config.renderToElement(FinalComp, {
      meta: renderMeta,
      clientStats,
    })

    // Run the beforeRenderToHtml hook
    // Rum the Html hook
    const beforeRenderToHtml = makeHookReducer(
      config.plugins,
      'beforeRenderToHtml'
    )
    RenderedComp = await beforeRenderToHtml(RenderedComp, {
      config,
      meta: renderMeta,
    })

    // Run the configs renderToHtml function
    appHtml = await config.renderToHtml(
      renderToStringAndExtract,
      RenderedComp,
      {
        meta: renderMeta,
        clientStats,
      }
    )

    // Rum the beforeHtmlToDocument hook
    const beforeHtmlToDocument = makeHookReducer(
      config.plugins,
      'beforeHtmlToDocument'
    )
    appHtml = await beforeHtmlToDocument(appHtml, { config, meta: renderMeta })
  } catch (error) {
    error.message = `Failed exporting HTML for URL ${route.path} (${
      route.component
    }): ${error.message}`
    throw error
  }

  const DocumentHtml = renderToStaticMarkup(
    <DocumentTemplate
      Html={makeHtmlWithMeta({ head })}
      Head={
        await makeHeadWithMeta({
          head,
          route,
          clientScripts,
          config,
          clientStyleSheets,
          clientCss,
          meta: renderMeta,
        })
      }
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

  // Rum the beforeDocumentToFile hook
  const beforeDocumentToFile = makeHookReducer(
    config.plugins,
    'beforeDocumentToFile'
  )
  html = await beforeDocumentToFile(html, { meta: renderMeta })

  // If the siteRoot is set and we're not in staging, prefix all absolute URL's
  // with the siteRoot
  const publicPath = makePathAbsolute(process.env.REACT_STATIC_PUBLIC_PATH)
  if (process.env.REACT_STATIC_DISABLE_ROUTE_PREFIXING !== 'true') {
    html = html.replace(hrefReplace, `$1${publicPath}$3`)
  }

  html = html.replace(srcReplace, `$1${publicPath}$3`)

  // If the route is a 404 page, write it directly to 404.html, instead of
  // inside a directory.
  const htmlFilename =
    route.path === '404'
      ? nodePath.join(config.paths.DIST, '404.html')
      : nodePath.join(config.paths.DIST, route.path, 'index.html')

  // Make the routeInfo sit right next to its companion html file
  const routeInfoFilename = nodePath.join(
    config.paths.DIST,
    route.path,
    'routeInfo.json'
  )

  const res = await Promise.all([
    fs.outputFile(htmlFilename, html),
    !route.redirect
      ? fs.outputJson(routeInfoFilename, routeInfo)
      : Promise.resolve(),
  ])
  return res
})
