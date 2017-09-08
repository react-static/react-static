import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { renderToString } from 'react-dom/server'
import reactTreeWalker from 'react-tree-walker'
import fs from 'fs-extra'
import path from 'path'
//
import config from './static'

const Html = config.Html
const DIST = path.resolve('./dist')
const scripts = ['/bundle.js']

const cleanSlashes = filename => filename.replace(/(\/)+/g, '/')

const bootstrap = async app => {
  let initialProps
  const visitor = async (element, instance) => {
    if (!initialProps && instance && typeof instance.getInitialProps === 'function') {
      initialProps = await instance.getInitialProps()
    }
    return true
  }

  await reactTreeWalker(app, visitor)
  return initialProps
}

const renderRouteRecursively = async (route, { path: parentPath = '' }) => {
  const fullPath = cleanSlashes(`${parentPath}/${route.path}`)

  const component = (
    <Html scripts={scripts.map(script => <script key={script} src={script} />)}>
      <config.component URL={fullPath} />
    </Html>
  )
  const bootstrapped = bootstrap(component)

  let ds = []
  if (route.children) {
    ds = route.children.map(r => renderRouteRecursively(r, route))
  }

  const childrenDone = Promise.all(ds)
  await Promise.all([bootstrapped, childrenDone])

  const initialProps = await bootstrapped
  const children = await childrenDone

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

  const markup = renderToString(
    <InitialPropsContext>
      {component}
    </InitialPropsContext>,
  )

  return {
    ...route,
    fullPath,
    initialProps,
    markup,
    children,
  }
}

const writeRoutesToDisk = routes => {
  const writeRouteRecursively = async route => {
    const markupFilename = cleanSlashes(`${DIST}/${route.fullPath}/index.html`)
    const initialPropsFilename = cleanSlashes(`${DIST}/${route.fullPath}/initialProps.json`)
    await fs.outputFile(markupFilename, route.markup)
    await fs.outputFile(initialPropsFilename, JSON.stringify(route.initialProps, null, 0))
    if (route.children) {
      await Promise.all(route.children.map(writeRouteRecursively))
    }
  }
  return Promise.all(routes.map(writeRouteRecursively))
}

const build = async () => {
  try {
    await fs.remove(DIST)
    const routes = await Promise.all(config.routes.map(renderRouteRecursively))
    await writeRoutesToDisk(routes)
  } catch (err) {
    console.log(err)
  }
}

build()
