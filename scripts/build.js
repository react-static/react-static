import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { renderToStaticMarkup } from 'react-dom/server'
import fs from 'fs-extra'
import nodepath from 'path'
//
import staticConfig from './utils/getConfig'
import buildAppBundle from './utils/buildAppBundle'
import { ROOT, DIST } from './utils/paths'

const Html = staticConfig.Html

const loadComponentForStatic = src => {
  // Require a copy of the component (important to do this in `IS_STATIC` environment variable)
  process.env.IS_STATIC = 'true'
  const Comp = require(nodepath.resolve(nodepath.join(ROOT, src))).default
  process.env.IS_STATIC = 'false'
  return Comp
}

// Normalize routes with parents, full paths, context, etc.
const normalizeRoutes = routes => {
  const recurse = (route, parent = { path: '/' }) => {
    const path = nodepath.join(parent.path, route.path, '/')
    let children = []

    const normalizedRoute = {
      ...route,
      parent,
      path,
      context: {}, // provide a route level context to transfer
      // during the build process
    }
    if (route.children) {
      children = route.children.map(d => recurse(d, normalizedRoute))
    }
    return {
      ...normalizedRoute,
      children,
    }
  }
  return routes.map(d => recurse(d))
}

// Optional prebuild step to store site-level data
const preBuild = async ({ config, siteContext }) => {
  let wasManual
  const allRouteData = await config.preBuild({
    siteContext,
    // Supply some simple plugins to help with different data sources
    copyFromDir: src => {
      wasManual = true
      return fs.copy(nodepath.resolve(src), DIST)
    },
  })
  if (!wasManual && allRouteData) {
    const recurse = routeData => {
      let ds = []
      if (routeData.props) {
        ds.push(
          fs.outputFile(
            nodepath.join(DIST, routeData.path, 'initialProps.json'),
            JSON.stringify(routeData.props || {}),
          ),
        )
      }
      if (routeData.children) {
        ds = ds.concat(routeData.children.map(recurse))
      }
      return Promise.all(ds)
    }
    await Promise.all(normalizeRoutes(allRouteData).map(recurse))
  }
}

// Optional route-level prebuild step to store route-level data
const preRoutes = async ({ config, siteContext }) => {
  const recurse = async route => {
    // Get any route level data
    const preRoutePromise = config.preRoute({
      route,
      siteContext,
    })

    // Recurse into children
    const childrenPromises = route.children ? route.children.map(r => recurse(r, route)) : []

    const initialProps = await preRoutePromise
    await Promise.all(childrenPromises)

    // Write the initialProps to a json file
    if (initialProps) {
      await fs.outputFile(
        nodepath.join(DIST, route.path, 'initialProps.json'),
        JSON.stringify(initialProps || {}),
      )
    }
  }
  await Promise.all(config.routes.map(recurse))
}

const writeRoutesToStatic = async ({ config, siteContext }) => {
  const Comp = loadComponentForStatic(config.componentPath)

  const renderRouteRecursively = async route => {
    const initialPropsPromise = fs.readJSON(nodepath.join(DIST, route.path, 'initialProps.json'))

    const childrenPromises = route.children ? route.children.map(renderRouteRecursively) : []

    await Promise.all([initialPropsPromise, ...childrenPromises])

    const initialProps = await initialPropsPromise

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

    // let html = renderToString(
    let html = renderToStaticMarkup(
      <InitialPropsContext>
        <Html
          scripts={
            <div>
              <script
                type="text/javascript"
                dangerouslySetInnerHTML={{
                  __html: `window.__routeInfo = ${JSON.stringify({
                    path: route.path,
                    initialProps,
                  })}`,
                }}
              />
              <script async src="/app.js" />
            </div>
          }
        >
          <Comp URL={route.path} />
        </Html>
      </InitialPropsContext>,
    )

    const transformedHtml = await config.routeTransform({
      route,
      html,
      siteContext,
    })

    if (transformedHtml) {
      html = transformedHtml
    }

    const htmlFilename = nodepath.join(DIST, route.path, 'index.html')
    const initialPropsFilename = nodepath.join(DIST, route.path, 'initialProps.json')
    const writeHTML = fs.outputFile(htmlFilename, html)
    const writeJSON = fs.outputFile(initialPropsFilename, JSON.stringify(initialProps))
    await Promise.all([writeHTML, writeJSON])
  }

  await Promise.all(config.routes.map(renderRouteRecursively))
}

const build = async () => {
  try {
    // Clean the dist folder
    await fs.remove(DIST)
    // Context can be used to transfer data throughout the build process
    const config = {
      preBuild: async () => {},
      preRoute: async () => {},
      routeTransform: async () => {},
      ...staticConfig,
    }
    const siteContext = {}

    console.time('Static files generated')

    // Normalize the routes
    console.log('Building Routes...')
    config.routes = normalizeRoutes(config.routes)

    // Run the preBuild hook
    console.log('Running preBuild...')
    await preBuild({ config, siteContext })

    // Run the preRoutes hook
    console.log('Running preRoutes...')
    await preRoutes({ config, siteContext })

    // Build static pages and JSON
    console.log('Writing static files...')
    await writeRoutesToStatic({ config, siteContext })

    console.timeEnd('Static files generated')

    // Bundle with webpack
    console.log('Bundling app...')
    await buildAppBundle()
  } catch (err) {
    console.log(err)
  }
}

build()
