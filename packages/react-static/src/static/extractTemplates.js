import chalk from 'chalk'
import { time, timeEnd } from '../utils'

import generateTemplates from './generateTemplates'

export default (async function extractTemplates(config) {
  console.log('=> Building Templates')
  time(chalk.green('=> [\u2713] Templates Built'))

  // Dedupe all templates into an array
  const templates = []
  let notFoundPending = true

  config.routes.forEach(route => {
    if (!route.component) {
      return
    }
    // Check if the template has already been added
    const index = templates.indexOf(route.component)
    if (index === -1) {
      // If it's new, add it
      if (route.path === '404') {
        templates.unshift(route.component)
        notFoundPending = false
        route.templateIndex = 0
      } else {
        templates.push(route.component)
        route.templateIndex = notFoundPending
          ? templates.length
          : templates.length - 1
      }
    } else {
      // Assign the existing templateIndex
      route.templateIndex = notFoundPending ? index + 1 : index
    }
  })
  timeEnd(chalk.green('=> [\u2713] Templates Built'))

  if (notFoundPending) {
    throw new Error(
      'A 404 template was not found at template extractiont time. It should have been at least defaulted to one by now, so this is very bad. File an issue if you see this.'
    )
  }

  // Make sure 404 template is the first one
  config.templates = templates

  await generateTemplates({
    config,
  })

  return templates
})
