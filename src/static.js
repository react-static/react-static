/* eslint-disable import/no-dynamic-require, react/no-danger */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { renderToString } from 'react-dom/server'
import fs from 'fs-extra'
import path from 'path'
import Helmet from 'react-helmet'
//
import { DefaultDocument } from './RootComponents'
import { getConfig } from './utils'
import { DIST } from './paths'

// Exporting route HTML and JSON happens here. It's a big one.
export const writeRoutesToStatic = async ({ config }) => {
  const userConfig = getConfig()
  const DocumentTemplate = config.Html || DefaultDocument

  // Use the node version of the app created with webpack
  const Comp = require(path.resolve(DIST, 'app.static.js')).default

  const siteProps = await userConfig.getSiteProps({ dev: false })

  return Promise.all(
    config.routes.map(async route => {
      // Fetch initialProps from each route
      const initialProps = route.getProps && (await route.getProps({ route, dev: false }))
      if (initialProps) {
        await fs.outputFile(
          path.join(DIST, route.path, 'routeData.json'),
          JSON.stringify(initialProps || {}),
        )
      }

      const URL = route.path

      // Inject initialProps into static build
      class InitialPropsContext extends Component {
        static childContextTypes = {
          initialProps: PropTypes.object,
          siteProps: PropTypes.object,
          URL: PropTypes.string,
        }
        getChildContext () {
          return {
            initialProps,
            siteProps,
            URL,
          }
        }
        render () {
          return this.props.children
        }
      }

      const ContextualComp = props => (
        <InitialPropsContext>
          <Comp {...props} />
        </InitialPropsContext>
      )

      const renderMeta = {}

      // Allow extractionso of meta via config.renderToString
      const appHtml = await config.renderToHtml(renderToString, ContextualComp, renderMeta)

      // Extract head calls using Helmet
      const helmet = Helmet.renderStatic()
      const head = {
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

      // Instead of using the default components, we need to hard code meta
      // from react-helmet into the components
      const HtmlWithMeta = ({ children, ...rest }) => (
        <html lang="en" {...head.htmlprops} {...rest}>
          {children}
        </html>
      )
      const HeadWithMeta = ({ children, ...rest }) => (
        <head {...rest}>
          {head.base}
          {head.title}
          {head.meta}
          {head.link}
          {process.env.extractedCSSpath && (
            <link rel="stylesheet" href={`/${process.env.extractedCSSpath}`} />
          )}
          {head.noscript}
          {head.script}
          {head.style}
          {children}
        </head>
      )
      // Not only do we pass react-helmet attributes and the app.js here, but
      // we also need to  hard code site props and route props into the page to
      // prevent flashing when react mounts onto the HTML.
      const BodyWithMeta = ({ children, ...rest }) => (
        <body {...head.bodyProps} {...rest}>
          {children}
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `window.__routeData = ${JSON.stringify({
                path: route.path,
                initialProps,
                siteProps,
              })}`,
            }}
          />
          <script async src="/app.js" />
        </body>
      )

      // Render the html for the page inside of the base document.
      let html = `<!DOCTYPE html>${renderToString(
        <DocumentTemplate
          Html={HtmlWithMeta}
          Head={HeadWithMeta}
          Body={BodyWithMeta}
          siteProps={siteProps}
          renderMeta={renderMeta}
        >
          <div id="root" dangerouslySetInnerHTML={{ __html: appHtml }} />
        </DocumentTemplate>,
      )}`

      // If the siteRoot is set, prefix all absolute URL's
      if (config.siteRoot) {
        html = html.replace(/(href=["'])(\/[^/])/gm, `$1${config.siteRoot}$2`)
      }

      // If the route is a 404 page, write it directly to 404.html, instead of
      // inside a directory.
      const htmlFilename = route.is404
        ? path.join(DIST, '404.html')
        : path.join(DIST, route.path, 'index.html')
      const initialPropsFilename = path.join(DIST, route.path, 'routeData.json')
      const writeHTML = fs.outputFile(htmlFilename, html)
      const writeJSON = fs.outputFile(
        initialPropsFilename,
        JSON.stringify({
          initialProps,
        }),
      )
      await Promise.all([writeHTML, writeJSON])
    }),
  )
}

export async function buildXMLandRSS ({ config }) {
  if (!config.siteRoot) {
    console.log(
      `
=> Warning: No 'siteRoot' defined in 'static.config.js'!
=> This is required for both absolute url's and a sitemap.xml to be exported.
`,
    )
    return
  }
  const xml = generateXML({
    routes: config.routes.filter(d => !d.is404).map(route => ({
      permalink: config.siteRoot + route.path,
      lastModified: '',
      priority: 0.5,
      ...route,
    })),
  })

  await fs.writeFile(path.join(DIST, 'sitemap.xml'), xml)

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

export const writeRouteComponentsToFile = async routes => {
  const templates = []
  routes = routes.filter(d => d.component)
  routes.forEach(route => {
    if (!templates.includes(route.component)) {
      templates.push(route.component)
    }
  })

  const standardRoutes = routes.filter(d => !d.is404)

  const notFoundRoute = routes.find(d => d.is404)

  const file = `
    import React, { Component } from 'react'
    import { Switch, Route } from 'react-router-dom'

    ${templates
    .map(template => `import ${template.replace(/[^a-zA-Z]/g, '_')} from '../${template}'`)
    .join('\n')}

    export default class Routes extends Component {
      render () {
        return (
          <Switch>
              ${standardRoutes
    .map(
      route =>
        `<Route exact path={'${route.path}'} component={${route.component.replace(
          /[^a-zA-Z]/g,
          '_',
        )}} />`,
    )
    .join('\n')}
              ${notFoundRoute
    ? `<Route component={${notFoundRoute.component.replace(/[^a-zA-Z]/g, '_')}} />`
    : ''}
          </Switch>
        )
      }
    }
  `

  const filepath = path.resolve(DIST, 'react-static-routes.js')
  await fs.remove(filepath)
  await fs.writeFile(filepath, file)
  const now = Date.now() / 1000
  const then = now - 1000
  fs.utimesSync(filepath, then, then)
}
