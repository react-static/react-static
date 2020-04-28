import chalk from 'chalk'
import slash from 'slash'
import path from 'path'
import { time, timeEnd, is404Path } from '../utils'

export default (async function extractTemplates(state) {
  const { config, routes, incremental } = state
  console.log('Building Templates...')
  time(chalk.green('[\u2713] Templates Built'))

  // Dedupe all templates into an array
  const templates = []
  let notFoundPending = true

  routes.forEach(route => {
    if (!route.template) {
      return
    }

    route.template = slash(
      `__react_static_root__/${path.relative(
        config.paths.ROOT,
        route.template
      )}`
    )

    // Check if the template has already been added
    const index = templates.indexOf(route.template)
    if (index === -1) {
      // If it's new, add it
      if (is404Path(route.path)) {
        // Make sure 404 template is the first one
        templates.unshift(route.template)
        notFoundPending = false
      } else {
        templates.push(route.template)
      }
    }
  })
  timeEnd(chalk.green('[\u2713] Templates Built'))

  if (!incremental && notFoundPending) {
    throw new Error(
      'A 404 template was not found at template extraction time. It should have been at least defaulted to one by now, so this is very bad. File an issue if you see this.'
    )
  }

  return {
    ...state,
    templates,
  }
})
