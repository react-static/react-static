import path from 'path'
import slash from 'slash'
import fs from 'fs-extra'

export default async ({ config, templates, tree }) => {
  const file = `

import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import universal, { setHasBabelPlugin } from 'react-universal-component'
import { cleanPath } from 'react-static'

${process.env.NODE_ENV === 'production'
    ? `

setHasBabelPlugin()

const universalOptions = {
  loading: () => null,
  error: () => {
    console.error(props.error);
    return <div>An unknown error has occured loading this page. Please reload your browser and try again.</div>;
  },
}

  ${templates
    .map((template, index) => {
      const templatePath = path.relative(
        config.paths.DIST,
        path.resolve(config.paths.ROOT, template)
      )
      return `const t_${index} = universal(import('${slash(templatePath)}'), universalOptions)`
    })
    .join('\n')}
    `
    : templates
      .map((template, index) => {
        const templatePath = path.relative(
          config.paths.DIST,
          path.resolve(config.paths.ROOT, template)
        )
        return `import t_${index} from '${slash(templatePath)}'`
      })
      .join('\n')}

// Template Map
const templateMap = {
  ${templates.map((template, index) => `t_${index}`).join(',\n')}
}

// Template Tree
const templateTree = ${JSON.stringify(tree)
    .replace(/"(\w)":/gm, '$1:')
    .replace(/template: '(.+)'/gm, 'template: $1')}

// Get template for given path
const getComponentForPath = path => {
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

if (typeof document !== 'undefined') {
  window.reactStaticGetComponentForPath = getComponentForPath
}

export default class Routes extends Component {
  render () {
    const { component: Comp, render, children } = this.props
    const renderProps = {
      templateMap,
      templateTree,
      getComponentForPath
    }
    if (Comp) {
      return (
        <Comp
          {...renderProps}
        />
      )
    }
    if (render || children) {
      return (render || children)(renderProps)
    }

    // This is the default auto-routing renderer
    return (
      <Route path='*' render={props => {
        let Comp = getComponentForPath(cleanPath(props.location.pathname))
        if (!Comp) {
          Comp = getComponentForPath('404')
        }
        return Comp && <Comp {...props} />
      }} />
    )
  }
}

    `

  const dynamicRoutesPath = path.join(config.paths.DIST, 'react-static-routes.js')
  await fs.remove(dynamicRoutesPath)
  await fs.writeFile(dynamicRoutesPath, file)
}
