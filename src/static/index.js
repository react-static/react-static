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
import flushChunks from 'webpack-flush-chunks'
import Progress from 'progress'
import chalk from 'chalk'
import jsesc from 'jsesc'
//
import generateRoutes from './generateRoutes'
import { DefaultDocument } from './RootComponents'
import { poolAll, pathJoin } from '../utils/shared'
import Redirect from '../client/components/Redirect'

const defaultOutputFileRate = 100

const Bar = (len, label) =>
  new Progress(`=> ${label ? `${label} ` : ''}[:bar] :current/:total :percent :rate/s :etas `, {
    total: len,
  })

export const prepareRoutes = async (config, opts) => {
  config.routes = await config.getRoutes(opts)

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
  })

  config.templates = templates

  return generateRoutes({
    config,
  })
}

// Exporting route HTML and JSON happens here. It's a big one.
export const exportRoutes = async ({ config, clientStats }) => {
  // Use the node version of the app created with webpack
  const Comp = require(glob.sync(path.resolve(config.paths.DIST, 'static.*.js'))[0]).default

  // Retrieve the document template
  const DocumentTemplate = config.Document || DefaultDocument

  console.log('=> Fetching Site Data...')
  console.time(chalk.green('=> [\u2713] Site Data Downloaded'))
  // Get the site data
  const siteData = await config.getSiteData({ dev: false })
  console.timeEnd(chalk.green('=> [\u2713] Site Data Downloaded'))

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

  console.log('=> Exporting HTML...')
  const htmlProgress = Bar(config.routes.length)
  console.time(chalk.green('=> [\u2713] HTML Exported'))

  const basePath = process.env.REACT_STATIC_STAGING === 'true' ? config.stagingBasePath : config.basePath
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
      let ClientCssHash

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
        const {
          scripts, stylesheets, css, CssHash,
        } = flushChunks(clientStats, {
          chunkNames,
          outputPath: config.paths.DIST,
        })

        clientScripts = scripts
        clientStyleSheets = stylesheets
        clientCss = css
        ClientCssHash = CssHash

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

      // Instead of using the default components, we need to hard code meta
      // from react-helmet into the components
      const HtmlWithMeta = ({ children, ...rest }) => (
        <html lang="en" {...head.htmlProps} {...rest}>
          {children}
        </html>
      )
      const HeadWithMeta = ({ children, ...rest }) => {
        let showHelmetTitle = true
        const childrenArray = React.Children.toArray(children).filter(child => {
          if (child.type === 'title') {
            // Filter out the title of the Document in static.config.js
            // if there is a helmet title on this route
            const helmetTitleIsEmpty = head.title[0].props.children === ''
            if (!helmetTitleIsEmpty) {
              return false
            }
            showHelmetTitle = false
          }
          return true
        })

        return (
          <head {...rest}>
            {head.base}
            {showHelmetTitle && head.title}
            {head.meta}
            {!route.redirect &&
              clientScripts.map(script => (
                <link
                  key={`clientScript_${script}`}
                  rel="preload"
                  as="script"
                  href={`${config.publicPath}${script}`}
                />
              ))}
            {!route.redirect &&
              !config.inlineCss &&
              clientStyleSheets.map(styleSheet => (
                <link
                  key={`clientStyleSheet_${styleSheet}`}
                  rel="preload"
                  as="style"
                  href={`${config.publicPath}${styleSheet}`}
                />
              ))}
            {!route.redirect &&
              !config.inlineCss &&
              clientStyleSheets.map(styleSheet => (
                <link
                  key={`clientStyleSheet_${styleSheet}`}
                  rel="stylesheet"
                  href={`${config.publicPath}${styleSheet}`}
                />
              ))}
            {head.link}
            {head.noscript}
            {head.script}
            {config.inlineCss && (
              <style
                key="clientCss"
                type="text/css"
                dangerouslySetInnerHTML={{
                  __html: clientCss.toString().replace(/<style>|<\/style>/gi, ''),
                }}
              />
            )}
            {head.style}
            {childrenArray}
          </head>
        )
      }

      // Not only do we pass react-helmet attributes and the app.js here, but
      // we also need to  hard code site props and route props into the page to
      // prevent flashing when react mounts onto the HTML.
      const BodyWithMeta = ({ children, ...rest }) => (
        <body {...head.bodyProps} {...rest}>
          {children}
          <ClientCssHash />
          {!route.redirect && (
            <script
              type="text/javascript"
              dangerouslySetInnerHTML={{
                __html: `
                window.__routeInfo = ${jsesc(embeddedRouteInfo, {
                  es6: false,
                  isScriptContext: true,
                }).replace(/<(\/)?(script)/gi, '<"+"$1$2')};`,
              }}
            />
          )}
          {!route.redirect &&
            clientScripts.map(script => (
              <script
                key={script}
                defer
                type="text/javascript"
                src={`${config.publicPath}${script}`}
              />
            ))}
        </body>
      )

      const DocumentHtml = renderToStaticMarkup(
        <DocumentTemplate
          Html={HtmlWithMeta}
          Head={HeadWithMeta}
          Body={BodyWithMeta}
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

export async function buildXMLandRSS ({ config }) {
  const siteRoot = process.env.REACT_STATIC_STAGING === 'true' ? config.stagingSiteRoot : config.siteRoot
  if (!siteRoot) {
    return
  }
  const prefixPath = config.disableRoutePrefixing ? siteRoot : config.publicPath
  const xml = generateXML({
    routes: config.routes.filter(d => !d.is404).map(route => ({
      permalink: `${prefixPath}/${pathJoin(route.path)}`,
      lastModified: '',
      priority: 0.5,
      ...route,
    })),
  })

  await fs.writeFile(path.join(config.paths.DIST, 'sitemap.xml'), xml)

  function generateXML ({ routes }) {
    let xml =
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    routes.forEach(route => {
      if (route.noindex) {
        return
      }
      xml += '<url>'
      xml += `<loc>${`${route.permalink}/`.replace(/\/{1,}$/gm, '/')}</loc>`
      xml += route.lastModified ? `<lastmod>${route.lastModified}</lastmod>` : ''
      xml += route.priority ? `<priority>${route.priority}</priority>` : ''
      xml += '</url>'
    })
    xml += '</urlset>'
    return xml
  }
}
