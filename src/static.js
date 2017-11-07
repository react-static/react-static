/* eslint-disable import/no-dynamic-require, react/no-danger */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { renderToString } from 'react-dom/server'
import fs from 'fs-extra'
import glob from 'glob'
import path from 'path'
import Helmet from 'react-helmet'
//
import { DefaultDocument } from './RootComponents'
import { getConfig } from './utils'
import { DIST } from './paths'

// Exporting route HTML and JSON happens here. It's a big one.
export const exportRoutes = async ({ config }) => {
  const userConfig = getConfig()
  const DocumentTemplate = config.Document || DefaultDocument

  // Use the node version of the app created with webpack
  const appJsPath = glob.sync(path.resolve(DIST, 'app!(.static).*.js'))[0]
  const appJs = appJsPath.split('/').pop()
  const appStaticJsPath = glob.sync(path.resolve(DIST, 'app.static.*.js'))[0]
  const Comp = require(appStaticJsPath).default

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

      const routesList = config.routes.filter(d => d.hasGetProps).map(d => d.path)
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
            {head.link}
            {process.env.extractedCSSpath && (
              <link rel="stylesheet" href={`/${process.env.extractedCSSpath}`} />
            )}
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
          initialProps,
          siteProps,
        })};
                window.__routesList = ${JSON.stringify(routesList)};
              `,
            }}
          />
          <script async src={`/${appJs}`} />
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

export const prepareRoutes = async routes => {
  // Dynamically create the auto-routing component
  const templates = []
  routes = routes.filter(d => d.component)
  routes.forEach(route => {
    if (!templates.includes(route.component)) {
      templates.push(route.component)
    }
  })

  const templateImports = templates
    .map(template => `import ${template.replace(/[^a-zA-Z]/g, '_')} from '../${template}'`)
    .join('\n')

  const templateMap = `const templateMap = {
    ${templates
    .map((template, index) => `t_${index}: ${template.replace(/[^a-zA-Z]/g, '_')}`)
    .join(',\n')}
  }`

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

  const templateTree = `const templateTree = ${JSON.stringify(tree)
    .replace(/"(\w)":/gm, '$1:')
    .replace(/template: '(.+)'/gm, 'template: $1')}`

  const getTemplateForPath = `
    const getTemplateForPath = path => {
      const parts = path === '/' ? ['/'] : path.split('/').filter(d => d)
      let cursor = templateTree
      try {
        parts.forEach(part => {
          cursor = cursor.c[part]
        })
        return templateMap[cursor.t]
      } catch (e) {
        return false
      }
    }
  `

  const mainRouteComp = `
    <Route path='*' render={props => {
      let Template = getTemplateForPath(props.location.pathname)
      if (!Template) {
        Template = getTemplateForPath('404')
      }
      return <Template {...props} />
    }} />
  `

  const file = `
    import React, { Component } from 'react'
    import { Route } from 'react-router-dom'

    ${templateImports}
    ${templateMap}
    ${templateTree}
    ${getTemplateForPath}

    export default class Routes extends Component {
      render () {
        return (
            ${mainRouteComp}
        )
      }
    }
  `

  const dynamicRoutesPath = path.resolve(DIST, 'react-static-routes.js')
  await fs.remove(dynamicRoutesPath)
  await fs.writeFile(dynamicRoutesPath, file)


  /**
   * Corbin Matschull [cgmx] - basedjux@gmail.com
   *
   * HOTFIX FOR ISSUE #124
   * Commenting this out per #124 so I can test the hotfix.
   * Hotfix is implemented in /master/src/webpack.js:#L47
   *
   * This hotfix was implemented due to FS_ACCURACY causing isssues with webpack-dev-server -
   * builds.
   * This "hack" was removed due to it causing builds to increase in time over n-milliseconds
   *    (See: https://github.com/nozzle/react-static/issues/124#issuecomment-341959542)
   */
  // fs.utimesSync(dynamicRoutesPath, Date.now() / 1000 - 5000, Date.now() / 1000 - 5000)
}
