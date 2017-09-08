import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import fs from 'fs-extra'
import path from 'path'
import webpack from 'webpack'
//
import staticConfig from './static'
import webpackConfig from './webpack.config.js'

const Html = staticConfig.Html
const DIST = path.resolve('./dist')
const scripts = ['/bundle.js']

// Remove more than single slashes from paths
const cleanSlashes = filename => filename.replace(/(\/)+/g, '/')

const loadComponentForStatic = src => {
  // Require a copy of the component (important to do this in `IS_STATIC` environment variable)
  process.env.IS_STATIC = 'true'
  const Comp = require(src).default
  process.env.IS_STATIC = 'false'
  return Comp
}

// Normalize routes with parents, full paths, context, etc.
const normalizeRoutes = routes => {
  const recurse = (route, parent = { path: '/' }) => {
    const path = cleanSlashes(`${parent.path}/${route.path}`)
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
      return fs.copy(path.resolve(src), DIST)
    },
  })
  if (!wasManual && allRouteData) {
    const recurse = routeData => {
      let ds = []
      if (routeData.props) {
        ds.push(
          fs.outputFile(
            path.join(DIST, routeData.path, 'initialProps.json'),
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
    // Provide the component that will be rendered, in case
    // they would like to inspect or walk its tree.
    const Comp = loadComponentForStatic(config.componentPath)

    const component = (
      <Html scripts={scripts.map(script => <script key={script} src={script} />)}>
        <Comp URL={config.path} />
      </Html>
    )

    // Get any route level data
    const preRoutePromise = config.preRoute({
      route,
      component,
      siteContext,
    })

    // Recurse into children
    const childrenPromises = route.children ? route.children.map(r => recurse(r, route)) : []

    const initialProps = await preRoutePromise
    console.log(initialProps)
    await Promise.all(childrenPromises)

    // Write the initialProps to a json file
    await fs.outputFile(
      path.join(DIST, route.path, 'initialProps.json'),
      JSON.stringify(initialProps || {}),
    )
  }
  await Promise.all(config.routes.map(recurse))
}

const writeRoutesToStatic = async ({ config, siteContext }) => {
  const Comp = loadComponentForStatic(config.componentPath)

  const renderRouteRecursively = async route => {
    const component = (
      <Html scripts={scripts.map(script => <script key={script} src={script} />)}>
        <Comp URL={route.path} />
      </Html>
    )

    const initialPropsPromise = fs.readJSON(path.join(DIST, route.path, 'initialProps.json'))

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
        {component}
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

    const htmlFilename = path.join(DIST, route.path, 'index.html')
    const initialPropsFilename = path.join(DIST, route.path, 'initialProps.json')
    const writeHTML = fs.outputFile(htmlFilename, html)
    const writeJSON = fs.outputFile(initialPropsFilename, JSON.stringify(initialProps))
    await Promise.all([writeHTML, writeJSON])
  }

  await Promise.all(config.routes.map(renderRouteRecursively))
}

const buildAppBundle = () =>
  new Promise((resolve, reject) =>
    webpack(webpackConfig, (err, stats) => {
      if (err) {
        return reject(err)
      }
      resolve(stats)
    }),
  )

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
    // Normalize the routes
    console.log('Building Routes...')
    config.routes = normalizeRoutes(config.routes)

    // Run the preBuild hook
    console.log('Running preBuild...')
    await preBuild({ config, siteContext })

    // Run the preRoutes hook
    console.log('Running preRoutes...')
    await preRoutes({ config, siteContext })

    // Bundle with webpack
    console.log('Bundling app...')
    await buildAppBundle()

    // Build static pages and JSON
    console.log('Writing static files...')
    await writeRoutesToStatic({ config, siteContext })

    console.log('Done!')
  } catch (err) {
    console.log(err)
  }
}

build()
