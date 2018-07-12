import path from 'path'
import slash from 'slash'
import fs from 'fs-extra'

export default async ({ config }) => {
  const { templates, routes, paths } = config

  const route404 = routes.find(route => route.path === '404')
  const id404 = route404.templateID

  const productionImports = `
import universal, { setHasBabelPlugin } from 'react-universal-component'
  `
  const developmentImports = ''

  const productionTemplates = `
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
      const templatePath = path.relative(paths.DIST, path.resolve(paths.ROOT, template))
      return `const t_${index} = universal(import('${slash(templatePath)}'), universalOptions)`
    })
    .join('\n')}
`

  const developmentTemplates = templates
    .map((template, index) => {
      const templatePath = path.relative(paths.DIST, path.resolve(paths.ROOT, template))
      return `import t_${index} from '${slash(templatePath)}'`
    })
    .join('\n')

  const file = `
import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { cleanPath } from 'react-static'
${process.env.NODE_ENV === 'production' ? productionImports : developmentImports}

${process.env.NODE_ENV === 'production' ? productionTemplates : developmentTemplates}

// Template Map
global.componentsByTemplateID = global.componentsByTemplateID || [
  ${templates.map((template, index) => `t_${index}`).join(',\n')}
]

const defaultTemplateIDs = {
  '404': ${id404}
}

// Template Tree
global.templateIDsByPath = global.templateIDsByPath || defaultTemplateIDs

// Get template for given path
const getComponentForPath = path => {
  path = cleanPath(path)
  return global.componentsByTemplateID[global.templateIDsByPath[path]]
}

global.reactStaticGetComponentForPath = getComponentForPath
global.reactStaticRegisterTemplateIDForPath = (path, id) => {
  global.templateIDsByPath[path] = id
}
global.clearTemplateIDs = () => {
  global.templateIDsByPath = defaultTemplateIDs
}

export default class Routes extends Component {
  componentDidMount () {
    global.clearTemplateIDs = () => {
      this.setState({})
    }

    if (typeof document !== 'undefined' && module.hot) {
      ${templates
    .map((template, index) => {
      const templatePath = path.relative(paths.DIST, path.resolve(paths.ROOT, template))
      return `module.hot.accept('${slash(templatePath)}', () => {
        global.componentsByTemplateID[${index}] = require('${slash(templatePath)}').default
        this.forceUpdate()
      })`
    })
    .join('\n')}
    }

  }
  render () {
    const { component: Comp, render, children } = this.props

    const getFullComponentForPath = path => {
      let Comp = getComponentForPath(path)
      let is404 = path === '404'
      if (!Comp) {
        is404 = true
        Comp = getComponentForPath('/404')
      }
      return (newProps = {}) => (
        Comp
          ? <Comp {...newProps} {...(is404 ? {path: '404'} : {})} />
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
        return Comp && Comp()
      }} />
    )
  }
}

`

  const dynamicRoutesPath = path.join(paths.DIST, 'react-static-routes.js')
  await fs.remove(dynamicRoutesPath)
  await fs.outputFile(dynamicRoutesPath, file)
}
