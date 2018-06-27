/* eslint-disable import/no-dynamic-require, react/no-danger */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import fs from 'fs-extra'
import glob from 'glob'
import path from 'path'
import Helmet from 'react-helmet'
import shorthash from 'shorthash'
import { ReportChunks } from 'react-universal-component'
import Progress from 'progress'
import chalk from 'chalk'
import flushChunks from 'webpack-flush-chunks'

import { makeHtmlWithMeta } from './components/HtmlWithMeta'
import { makeHeadWithMeta } from './components/HeadWithMeta'
import { makeBodyWithMeta } from './components/BodyWithMeta'

import generateRoutes from './generateRoutes'
import { DefaultDocument } from './RootComponents'
import buildXMLandRSS from './buildXML'
import { poolAll } from '../utils/shared'
import Redirect from '../client/components/Redirect'

export { buildXMLandRSS }

const defaultOutputFileRate = 100

const Bar = (len, label) =>
  new Progress(`=> ${label ? `${label} ` : ''}[:bar] :current/:total :percent :rate/s :etas `, {
    total: len,
  })

export const prepareRoutes = async (config, opts) => {
  console.log('getRoutes')
  config.routes = await config.getRoutes(opts)
  console.log('getRoutes finish')
  const progress = Bar(config.routes.length)

  process.env.REACT_STATIC_ROUTES_PATH = path.join(config.paths.DIST, 'react-static-routes.js')

  // Dedupe all templates into an array
  const templates = []

  config.routes.forEach(route => {
    if (!route.component) {
      return
    }
    // Check if the template has already been added
    const index = templates.indexOf(route.component)
    if (index === -1) {
      // If it's new, add it
      templates.push(route.component)
      // Assign the templateID
      route.templateID = templates.length - 1
    } else {
      // Assign the existing templateID
      route.templateID = index
    }
    progress.tick()
  })

  config.templates = templates

  return generateRoutes({
    config,
  })
}

export const fetchSiteData = async config => {
  console.log('=> Fetching Site Data...')
  console.time(chalk.green('=> [\u2713] Site Data Downloaded'))
  // Get the site data
  const siteData = await config.getSiteData({ dev: false })
  console.timeEnd(chalk.green('=> [\u2713] Site Data Downloaded'))
  return siteData
}

export const exportSharedRouteData = async (config, sharedProps) => {
  // Write all shared props to file
  const sharedPropsArr = Array.from(sharedProps)

  if (sharedPropsArr.length) {
    console.log('=> Exporting Shared Route Data...')
    const jsonProgress = Bar(sharedPropsArr.length)
    console.time(chalk.green('=> [\u2713] Shared Route Data Exported'))

    await poolAll(
      sharedPropsArr.map(cachedProp => async () => {
        await fs.outputFile(
          path.join(config.paths.STATIC_DATA, `${cachedProp[1].hash}.json`),
          cachedProp[1].jsonString || '{}'
        )
        jsonProgress.tick()
      }),
      Number(config.outputFileRate) || defaultOutputFileRate
    )
    console.timeEnd(chalk.green('=> [\u2713] Shared Route Data Exported'))
  }
}

export const fetchRoutes = async config => {
  // Set up some scaffolding for automatic data splitting
  const seenProps = new Map()
  const sharedProps = new Map()

  console.log('=> Fetching Route Data...')
  const dataProgress = Bar(config.routes.length)
  console.time(chalk.green('=> [\u2713] Route Data Downloaded'))
  await poolAll(
    config.routes.map(route => async () => {
      // Fetch allProps from each route
      route.allProps = !!route.getData && (await route.getData({ route, dev: false }))
      // Default allProps (must be an object)
      if (!route.allProps) {
        route.allProps = {}
      }

      // TODO: check if route.allProps is indeed an object

      // Loop through the props to find shared props between routes
      // TODO: expose knobs to tweak these settings, perform them manually,
      // or simply just turn them off.
      Object.keys(route.allProps)
        .map(k => route.allProps[k])
        .forEach(prop => {
          // Don't split small strings
          if (typeof prop === 'string' && prop.length < 100) {
            return
          }
          // Don't split booleans or undefineds
          if (['boolean', 'number', 'undefined'].includes(typeof prop)) {
            return
          }
          // Should be an array or object at this point
          // Have we seen this prop before?
          if (seenProps.get(prop)) {
            // Only cache each shared prop once
            if (sharedProps.get(prop)) {
              return
            }
            // Cache the prop
            const jsonString = JSON.stringify(prop)
            sharedProps.set(prop, {
              jsonString,
              hash: shorthash.unique(jsonString),
            })
          } else {
            // Mark the prop as seen
            seenProps.set(prop, true)
          }
        })
      dataProgress.tick()
    }),
    Number(config.outputFileRate) || defaultOutputFileRate
  )

  console.timeEnd(chalk.green('=> [\u2713] Route Data Downloaded'))

  console.log('=> Exporting Route Data...')
  console.time(chalk.green('=> [\u2713] Route Data Exported'))
  await poolAll(
    config.routes.map(route => async () => {
      // Loop through the props and build the prop maps
      route.localProps = {}
      route.sharedPropsHashes = {}
      Object.keys(route.allProps).forEach(key => {
        const value = route.allProps[key]
        const cached = sharedProps.get(value)
        if (cached) {
          route.sharedPropsHashes[key] = cached.hash
        } else {
          route.localProps[key] = value
        }
      })
    }),
    Number(config.outputFileRate) || defaultOutputFileRate
  )
  console.timeEnd(chalk.green('=> [\u2713] Route Data Exported'))

  exportSharedRouteData(config, sharedProps)
}

const buildHTML = async ({ config, siteData, clientStats }) => {
  // Use the node version of the app created with webpack
  const Comp = require(glob.sync(path.resolve(config.paths.DIST, 'static.*.js'))[0]).default

  // Retrieve the document template
  const DocumentTemplate = config.Document || DefaultDocument

  console.log('=> Exporting HTML...')

  const htmlProgress = Bar(config.routes.length)

  console.time(chalk.green('=> [\u2713] HTML Exported'))

  const basePath =
    process.env.REACT_STATIC_STAGING === 'true' ? config.stagingBasePath : config.basePath
  const hrefReplace = new RegExp(
    `(href=["'])\\/(${basePath ? `${basePath}\\/` : ''})?([^\\/])`,
    'gm'
  )
  const srcReplace = new RegExp(`(src=["'])\\/(${basePath ? `${basePath}\\/` : ''})?([^\\/])`, 'gm')

  await poolAll(
    config.routes.map(route => async () => {
      const {
        sharedPropsHashes, templateID, localProps, allProps, path: routePath,
      } = route

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

      // Inject allProps into static build
      class InitialPropsContext extends Component {
        static childContextTypes = {
          routeInfo: PropTypes.object,
          staticURL: PropTypes.string,
        }
        getChildContext () {
          return {
            routeInfo: embeddedRouteInfo,
            staticURL: route.path === '/' ? route.path : `/${route.path}`,
          }
        }
        render () {
          return this.props.children
        }
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
            <InitialPropsContext>
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
        html = html.replace(hrefReplace, `$1${config.publicPath}$3`)
      }

      html = html.replace(srcReplace, `$1${config.publicPath}$3`)

      // If the route is a 404 page, write it directly to 404.html, instead of
      // inside a directory.
      const htmlFilename = route.is404
        ? path.join(config.paths.DIST, '404.html')
        : path.join(config.paths.DIST, route.path, 'index.html')

      // Make the routeInfo sit right next to its companion html file
      const routeInfoFilename = path.join(config.paths.DIST, route.path, 'routeInfo.json')

      const res = await Promise.all([
        fs.outputFile(htmlFilename, html),
        !route.redirect ? fs.outputJson(routeInfoFilename, routeInfo) : Promise.resolve(),
      ])
      htmlProgress.tick()
      return res
    }),
    Number(config.outputFileRate) || defaultOutputFileRate
  )
  console.timeEnd(chalk.green('=> [\u2713] HTML Exported'))
}

// Exporting route HTML and JSON happens here. It's a big one.
export const exportRoutes = async ({ config, clientStats }) => {
  // we modify config in fetchSiteData
  const siteData = await fetchSiteData(config)
  // we modify config in fetchRoutes
  await fetchRoutes(config)

  await buildHTML({
    config,
    siteData,
    clientStats,
  })
}
