/* eslint-disable import/no-dynamic-require, react/no-danger, no-cond-assign */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { renderToString } from 'react-dom/server'
import fs from 'fs-extra'
import nodepath from 'path'
import Helmet from 'react-helmet'
//
import DefaultHtml from './DefaultHtml'
import { pathJoin } from './shared'
import { DIST, ROOT } from './paths'

const defaultEntry = './src/index'

// Normalize routes with parents, full paths, context, etc.
const normalizeRoutes = routes => {
  const flatRoutes = []

  const recurse = (route, parent = { path: '/' }) => {
    const path = pathJoin(parent.path, route.path)

    if (typeof route.noIndex !== 'undefined') {
      console.log(`=> Warning: Route ${route.path} is using 'noIndex'. Did you mean 'noindex'?`)
      route.noindex = route.noIndex
    }

    const normalizedRoute = {
      ...route,
      parent,
      path,
      noindex: typeof route.noindex === 'undefined' ? parent.noindex : route.noindex,
      hasGetProps: !!route.getProps,
    }

    flatRoutes.push(normalizedRoute)

    if (route.children) {
      route.children.forEach(d => recurse(d, normalizedRoute))
    }
  }
  routes.forEach(d => recurse(d))

  flatRoutes.forEach(route => {
    const found = flatRoutes.find(d => d.path === route.path)
    if (found !== route) {
      console.warn('More than one route is defined for path:', route.path)
    }
  })
  return flatRoutes
}

export const getConfig = () => {
  const config = require(nodepath.resolve(nodepath.join(process.cwd(), 'static.config.js'))).default
  return {
    ...config,
    siteRoot: config.siteRoot ? config.siteRoot.replace(/\/{0,}$/g, '') : null,
    getRoutes: async (...args) => {
      const routes = await config.getRoutes(...args)
      return normalizeRoutes(routes)
    },
  }
}

export const writeRoutesToStatic = async ({ config }) => {
  const userConfig = getConfig()
  const HtmlTemplate = config.Html || DefaultHtml
  const Comp = require(nodepath.join(ROOT, userConfig.entry || defaultEntry)).default

  return Promise.all(
    config.routes.map(async route => {
      // Fetch initialProps from each route
      const initialProps = route.getProps && (await route.getProps({ route, dev: false }))
      if (initialProps) {
        await fs.outputFile(
          nodepath.join(DIST, route.path, 'routeData.json'),
          JSON.stringify(initialProps || {}),
        )
      }

      const URL = route.path

      // Inject initialProps into static build
      class InitialPropsContext extends Component {
        static childContextTypes = {
          initialProps: PropTypes.object,
          URL: PropTypes.string,
        }
        getChildContext () {
          return {
            initialProps,
            URL,
          }
        }
        render () {
          return this.props.children
        }
      }

      const ContextualComp = <InitialPropsContext>{Comp}</InitialPropsContext>

      let staticMeta = {}
      if (config.preRenderMeta) {
        // Allow the user to perform custom rendering logic (important for styles and helmet)
        staticMeta = {
          ...staticMeta,
          ...(await config.preRenderMeta(ContextualComp)),
        }
      }

      const appHtml = renderToString(ContextualComp)

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

      staticMeta.head = head

      if (config.postRenderMeta) {
        // Allow the user to perform custom rendering logic (important for styles and helmet)
        staticMeta = {
          ...staticMeta,
          ...(await config.postRenderMeta(appHtml)),
        }
      }

      const Html = ({ children, ...rest }) => (
        <html lang="en" {...head.htmlprops} {...rest}>
          {children}
        </html>
      )
      const Head = ({ children, ...rest }) => (
        <head {...rest}>
          {head.base}
          {head.link}
          {head.meta}
          {head.noscript}
          {head.script}
          {head.style}
          {head.title}
          {children}
        </head>
      )
      const Body = ({ children, ...rest }) => (
        <body {...head.bodyProps} {...rest}>
          {children}
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `window.__routeData = ${JSON.stringify({
                path: route.path,
                initialProps,
              })}`,
            }}
          />
          <script async src="/app.js" />
        </body>
      )

      let html = `<!DOCTYPE html>${renderToString(
        <HtmlTemplate staticMeta={staticMeta} Html={Html} Head={Head} Body={Body}>
          <div id="root" dangerouslySetInnerHTML={{ __html: appHtml }} />
        </HtmlTemplate>,
      )}`

      if (config.siteRoot) {
        html = html.replace(/(href=["'])(\/[^/])/gm, `$1${config.siteroot}$2`)
      }

      const htmlFilename = nodepath.join(DIST, route.path, 'index.html')
      const initialPropsFilename = nodepath.join(DIST, route.path, 'routeData.json')
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
    routes: config.routes.map(route => ({
      permalink: config.siteRoot + route.path,
      lastModified: '',
      priority: 0.5,
      ...route,
    })),
  })

  await fs.writeFile(nodepath.join(DIST, 'sitemap.xml'), xml)

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
