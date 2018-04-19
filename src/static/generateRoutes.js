import path from 'path'
import slash from 'slash'
import fs from 'fs-extra'

export default async ({ config }) => {
  const { templates, routes } = config

  const id404 = routes.find(route => route.path === '404').templateID

  const file = `

import React, { Component } from 'react'
import { Route } from 'react-router-dom'
${
  process.env.NODE_ENV === 'production'
    ? `
import universal, { setHasBabelPlugin } from 'react-universal-component'
`
    : ''
}
import { cleanPath } from 'react-static'

${
  process.env.NODE_ENV === 'production'
    ? `

setHasBabelPlugin()

const universalOptions = {
  loading: () => null,
  error: props => {
    console.error(props.error);
    return <div>An error occurred loading this page's template. More information is available in the console.</div>;
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
      .join('\n')
}

// Template Map
global.componentsByTemplateID = global.componentsByTemplateID || [
  ${templates.map((template, index) => `t_${index}`).join(',\n')}
]

// Template Tree
global.templateIDsByPath = global.templateIDsByPath || {
  '404': ${id404}
}

// Get template for given path
const getComponentForPath = path => {
  path = cleanPath(path)
  return global.componentsByTemplateID[global.templateIDsByPath[path]]
}

global.reactStaticGetComponentForPath = getComponentForPath
global.reactStaticRegisterTemplateIDForPath = (path, id) => {
  global.templateIDsByPath[path] = id
}

export default class Routes extends Component {
  render () {
    const { component: Comp, render, children } = this.props

    const getFullComponentForPath = path => {
      let Comp = getComponentForPath(path)
      let is404 = path === '404'
      if (!Comp) {
        is404 = true
        Comp = getComponentForPath('404')
      }
      return newProps => (
        Comp
          ? <Comp {...newProps} {...(is404 ? {is404: true} : {})} />
          : null
      )
    }

    const renderProps = {
      componentsByTemplateID: global.componentsByTemplateID,
      templateIDsByPath: global.templateIDsByPath,
      getComponentForPath: getFullComponentForPath
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
        let Comp = getFullComponentForPath(props.location.pathname)
        // If Comp is used as a component here, it triggers React to re-mount the entire
        // component tree underneath during reconciliation, losing all internal state.
        // By unwrapping it here we keep the real, static component exposed directly to React.
        return Comp && Comp({ ...props, key: props.location.pathname })
      }} />
    )
  }
}

`

  const dynamicRoutesPath = path.join(config.paths.DIST, 'react-static-routes.js')
  await fs.remove(dynamicRoutesPath)
  await fs.writeFile(dynamicRoutesPath, file)
}
