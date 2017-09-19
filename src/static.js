/* eslint-disable import/no-dynamic-require, react/no-danger, no-cond-assign */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { renderToStaticMarkup } from 'react-dom/server'
import fs from 'fs-extra'
import nodepath from 'path'
//
import { ROOT, DIST } from './paths'

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
  const Html = config.Html
  const Comp = loadComponentForStatic(config.componentPath)

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

      // Inject initialProps into static build
      class InitialPropsContext extends Component {
        static childContextTypes = {
          initialProps: PropTypes.object,
        }
        getChildContext () {
          return {
            initialProps,
          }
        }
        render () {
          return this.props.children
        }
      }

      const ContextualComp = (
        <InitialPropsContext>
          <Comp URL={route.path} context={{}} />
        </InitialPropsContext>
      )

      let data = {}
      if (config.preRenderData) {
        // Allow the user to perform custom rendering logic (important for styles and helmet)
        data = {
          ...data,
          ...(await config.preRenderData(ContextualComp)),
        }
      }

      const appHtml = renderToStaticMarkup(ContextualComp)

      if (config.postRenderData) {
        // Allow the user to perform custom rendering logic (important for styles and helmet)
        data = {
          ...data,
          ...(await config.postRenderData(appHtml)),
        }
      }

      const html = renderToStaticMarkup(
        <Html
          data={data}
          scripts={
            <div>
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
            </div>
          }
        >
          <div id="root" dangerouslySetInnerHTML={{ __html: appHtml }} />
        </Html>,
      )

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

function getMatches (regex, string, index) {
  index = index || 1
  const matches = []
  let match
  while ((match = regex.exec(string))) {
    matches.push(match[index])
  }
  return matches
}
