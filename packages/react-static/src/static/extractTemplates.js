import chalk from 'chalk'
import slash from 'slash'
import path from 'path'
import { time, timeEnd } from '../utils'

export default (async function extractTemplates(config, opts = {}) {
  console.log('=> Building Templates')
  time(chalk.green('=> [\u2713] Templates Built'))

  // Dedupe all templates into an array
  const templates = []
  let notFoundPending = true

  config.routes.forEach(route => {
    if (!route.component) {
      return
    }
    route.template = slash(
      path.relative(
        config.paths.DIST,
        path.resolve(config.paths.ROOT, route.component)
      )
    )
    // Check if the template has already been added
    const index = templates.indexOf(route.template)
    if (index === -1) {
      // If it's new, add it
      if (route.path === '404') {
        templates.unshift(route.template)
        notFoundPending = false
      } else {
        templates.push(route.template)
      }
    }
  })
  timeEnd(chalk.green('=> [\u2713] Templates Built'))

  if (!opts.incremental && notFoundPending) {
    throw new Error(
      'A 404 template was not found at template extraction time. It should have been at least defaulted to one by now, so this is very bad. File an issue if you see this.'
    )
  }

  // Make sure 404 template is the first one
  config.templates = templates
})
