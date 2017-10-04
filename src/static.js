/* eslint-disable import/no-dynamic-require, react/no-danger, no-cond-assign */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { renderToString } from 'react-dom/server'
import fs from 'fs-extra'
import nodepath from 'path'
import Helmet from 'react-helmet'
//
import DefaultHtml from './DefaultHtml'
import { ROOT, DIST } from './paths'

const defaultEntry = './src/index'

const loadComponentForStatic = src => {
  // Require a copy of the component (important to do this in `IS_STATIC` environment variable)
  process.env.IS_STATIC = 'true'
  const Comp = require(nodepath.resolve(nodepath.join(ROOT, src))).default
  process.env.IS_STATIC = 'false'
  return Comp
}

export const getConfig = () =>
  require(nodepath.resolve(nodepath.join(process.cwd(), 'static.config.js'))).default

export const writeRoutesToStatic = async ({ config }) => {
  const HtmlTemplate = config.Html || DefaultHtml
  const Comp = loadComponentForStatic(config.entry || defaultEntry)

  return Promise.all(
    config.routes.map(async route => {
      // Fetch initialProps from each route
      const initialProps = route.getProps && (await route.getProps({ route, prod: true }))
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

      const html = `<!DOCTYPE html>${renderToString(
        <HtmlTemplate staticMeta={staticMeta} Html={Html} Head={Head} Body={Body}>
          <div id="root" dangerouslySetInnerHTML={{ __html: appHtml }} />
        </HtmlTemplate>,
      )}`

      const urls = getMatches(
        /(?:\(|"|')((?:(?:\/\/)|(?:\/))(?!\.)(?:[^(),'"\s](?:(?!\/\/|<|>|;|:|@|\s)[^"|'])*)(?:\.(?:jpg|png|gif))(?:.*?))(?:"|'|\)|\s)/gm,
        html,
      ).filter((d, index, self) => self.indexOf(d) === index)

      const htmlFilename = nodepath.join(DIST, route.path, 'index.html')
      const initialPropsFilename = nodepath.join(DIST, route.path, 'routeData.json')
      const writeHTML = fs.outputFile(htmlFilename, html)
      const writeJSON = fs.outputFile(
        initialPropsFilename,
        JSON.stringify({
          initialProps,
          preload: urls,
        }),
      )
      await Promise.all([writeHTML, writeJSON])
    }),
  )
}

export async function buildXMLandRSS ({ config }) {
  if (!config.siteRoot) {
    console.log(
      'Warning: No `siteRoot` defined in `static.config.js`. This is required to build a sitemap.xml!',
    )
    return
  }
  const xml = generateXML({
    routes: config.routes.map(route => ({
      permalink: nodepath.join(config.siteRoot, route.path),
      changeFreq: 600000,
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
      xml += `<loc>${route.permalink}</loc>`
      xml += route.lastModified ? `<lastmod>${route.lastModified}</lastmod>` : ''
      xml += route.changeFreq ? `<changefreq>${route.changeFreq}</changefreq>` : ''
      xml += route.priority ? `<priority>${route.priority}</priority>` : ''
      xml += '</url>'
    })
    xml += '</urlset>'
    return xml
  }
}

function getMatches (regex, string, index) {
  index = index || 1
  const matches = []
  let match
  while ((match = regex.exec(string))) {
    matches.push(match[index])
  }
  return matches
}
