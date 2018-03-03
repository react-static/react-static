/* eslint-disable import/no-dynamic-require, react/no-danger */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { renderToString } from 'react-dom/server'
import fs from 'fs-extra'
import glob from 'glob'
import path from 'path'
import Helmet from 'react-helmet'
import shorthash from 'shorthash'
import { ReportChunks } from 'react-universal-component'
import flushChunks from 'webpack-flush-chunks'
import Progress from 'progress'
import chalk from 'chalk'
//
import ReactStaticRoutes from './ReactStaticRoutes'
import { DefaultDocument } from './RootComponents'
import { poolAll, pathJoin, cleanPath } from './shared'

const defaultOutputFileRate = 100

const Bar = (len, label) =>
  new Progress(`=> ${label ? `${label} ` : ''}:current/:total [:bar] :rate/s :percent :etas `, {
    total: len,
  })

// Exporting route HTML and JSON happens here. It's a big one.
export const exportRoutes = async ({ config, clientStats, cliArguments }) => {
  // Use the node version of the app created with webpack
  const Comp = require(glob.sync(path.resolve(config.paths.DIST, 'static.*.js'))[0]).default

  // Retrieve the document template
  const DocumentTemplate = config.Document || DefaultDocument

  console.log('=> Fetching Site Data...')
  console.time(chalk.green('=> [\u2713] Site Data Downloaded'))
  // Get the site data
  const siteData = await config.getSiteData({ dev: false, cliArguments })
  console.timeEnd(chalk.green('=> [\u2713] Site Data Downloaded'))

  // Set up some scaffolding for automatic data splitting
  const seenProps = new Map()
  const sharedProps = new Map()

  console.log('=> Fetching Route Data...')
  const dataProgress = Bar(config.routes.length)
  console.time(chalk.green('=> [\u2713] Route Data Downloaded'))

  await poolAll(
    config.routes.map(route => async () => {
      // Fetch initialProps from each route
      route.initialProps = !!route.getData && (await route.getData({ route, dev: false }))

      // Default initialProps object
      if (!route.initialProps) {
        route.initialProps = {}
      }

      // Loop through the props
      Object.keys(route.initialProps)
        .map(k => route.initialProps[k])
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
      route.propsMap = {}
      Object.keys(route.initialProps).forEach(key => {
        const value = route.initialProps[key]
        const cached = sharedProps.get(value)
        if (cached) {
          route.propsMap[key] = cached.hash
        } else {
          route.localProps[key] = value
        }
      })
      if (Object.keys(route.localProps).length) {
        route.localPropsDataString = JSON.stringify(route.localProps)
        route.localPropsHash = shorthash.unique(route.localPropsDataString)
        // Make sure local props are tracked in a special key
        route.propsMap.__local = route.localPropsHash
        // Write props to file
        return fs.outputFile(
          path.join(config.paths.STATIC_DATA, `${route.localPropsHash}.json`),
          route.localPropsDataString || '{}'
        )
      }
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

  const allRouteInfo = {}
  config.routes.filter(d => d.hasGetProps).forEach(({ path, propsMap }) => {
    allRouteInfo[path] = propsMap
  })

  console.log('=> Exporting HTML...')
  const htmlProgress = Bar(config.routes.length)
  console.time(chalk.green('=> [\u2713] HTML Exported'))

  await poolAll(
    config.routes.map(route => async () => {
      const staticURL = route.path

      // Inject initialProps into static build
      class InitialPropsContext extends Component {
        static childContextTypes = {
          propsMap: PropTypes.object,
          initialProps: PropTypes.object,
          siteData: PropTypes.object,
          staticURL: PropTypes.string,
        }
        getChildContext () {
          return {
            propsMap: route.propsMap,
            initialProps: route.initialProps,
            siteData,
            staticURL,
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

      const CompWithContext = props => (
        <ReportChunks report={chunkName => chunkNames.push(chunkName)}>
          <InitialPropsContext>
            <Comp {...props} />
          </InitialPropsContext>
        </ReportChunks>
      )

      const renderToStringAndExtract = comp => {
        // Rend the app to string!
        const appHtml = renderToString(comp)
        const { scripts, stylesheets } = flushChunks(clientStats, {
          chunkNames,
        })

        clientScripts = scripts
        clientStyleSheets = stylesheets

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

      // Allow extractions of meta via config.renderToString
      const appHtml = await config.renderToHtml(
        renderToStringAndExtract,
        CompWithContext,
        renderMeta,
        clientStats
      )

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
            <link rel="preload" as="script" href="___REPLACE_WITH_ROUTE_INFO_URL___" />
            {clientScripts.map(script => (
              <link
                key={`clientScript_${script}`}
                rel="preload"
                as="script"
                href={`${config.publicPath}${script}`}
              />
            ))}
            {clientStyleSheets.map(styleSheet => (
              <link
                key={`clientStyleSheet_${styleSheet}`}
                rel="preload"
                as="style"
                href={`${config.publicPath}${styleSheet}`}
              />
            ))}
            {clientStyleSheets.map(styleSheet => (
              <link
                key={`clientStyleSheet_${styleSheet}`}
                rel="stylesheet"
                href={`${config.publicPath}${styleSheet}`}
              />
            ))}
            {head.link}
            {head.noscript}
            {head.script}
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
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
                window.__routeData = ${JSON.stringify({
          path: route.path,
          propsMap: route.propsMap,
          initialProps: route.initialProps,
          siteData,
        }).replace(/<(\/)?(script)/gi, '<"+"$1$2')};`,
            }}
          />
          {clientScripts.map(script => (
            <script
              key={script}
              defer
              type="text/javascript"
              src={`${config.publicPath}${script}`}
            />
          ))}
        </body>
      )

      // Render the html for the page inside of the base document.
      let html = `<!DOCTYPE html>${renderToString(
        <DocumentTemplate
          Html={HtmlWithMeta}
          Head={HeadWithMeta}
          Body={BodyWithMeta}
          siteData={siteData}
          renderMeta={renderMeta}
        >
          <div id="root" dangerouslySetInnerHTML={{ __html: appHtml }} />
        </DocumentTemplate>
      )}`

      const reLinkedPages = /<a.+?href=["']([^"']*?)["']/gm
      let currentMatch
      const routeInfo = {}
      while ((currentMatch = reLinkedPages.exec(html)) !== null) {
        const path = cleanPath(currentMatch[1])
        if (allRouteInfo[path]) {
          routeInfo[path] = allRouteInfo[path]
        }
      }

      const routeInfoContent = `window.__routeInfo = ${JSON.stringify(routeInfo)}`

      // If the siteRoot is set and we're not in staging, prefix all absolute URL's
      // with the siteRoot
      if (!process.env.REACT_STATIC_STAGING && config.siteRoot) {
        html = html.replace(/(href=["'])\/([^/])/gm, `$1${config.siteRoot}$2`)
      }

      // If the route is a 404 page, write it directly to 404.html, instead of
      // inside a directory.
      const htmlFilename = route.is404
        ? path.join(config.paths.DIST, '404.html')
        : path.join(config.paths.DIST, route.path, 'index.html')

      const routeInfoFilename = path.join(config.paths.DIST, route.path, 'routeInfo.js')

      html = html.replace(
        '___REPLACE_WITH_ROUTE_INFO_URL___',
        `${config.publicPath}${pathJoin(route.path, 'routeInfo.js')}`
      )

      const res = await Promise.all([
        fs.outputFile(htmlFilename, html),
        fs.outputFile(routeInfoFilename, routeInfoContent),
      ])
      htmlProgress.tick()
      return res
    }),
    Number(config.outputFileRate) || defaultOutputFileRate
  )
  console.timeEnd(chalk.green('=> [\u2713] HTML Exported'))
}

export async function buildXMLandRSS ({ config }) {
  if (!config.siteRoot) {
    return
  }
  const xml = generateXML({
    routes: config.routes.filter(d => !d.is404).map(route => ({
      permalink: `${config.publicPath}${pathJoin(route.path)}`,
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

export const prepareRoutes = async config => {
  process.env.REACT_STATIC_ROUTES_PATH = path.join(config.paths.DIST, 'react-static-routes.js')

  // Dynamically create the auto-routing component
  const templates = []
  const routes = config.routes.filter(d => d.component)
  routes.forEach(route => {
    if (!templates.includes(route.component)) {
      templates.push(route.component)
    }
  })

  const tree = {}
  routes.forEach(route => {
    const parts = route.path === '/' ? ['/'] : route.path.split('/').filter(d => d)
    let cursor = tree
    parts.forEach((part, partIndex) => {
      const isLeaf = parts.length === partIndex + 1
      if (!cursor.c) {
        cursor.c = {}
      }
      cursor = cursor.c
      if (!cursor[part]) {
        cursor[part] = {}
      }
      cursor = cursor[part]
      if (isLeaf) {
        cursor.t = `t_${templates.indexOf(route.component)}`
      }
    })
  })

  return ReactStaticRoutes({
    config,
    templates,
    tree,
  })
}
