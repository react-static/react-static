import chalk from 'chalk'
import { time, timeEnd } from '../utils'

import generateRoutes from './generateRoutes'

export default (async function extractTemplates(config) {
  console.log('=> Building Templates')
  time(chalk.green('=> [\u2713] Templates Built'))

  // Dedupe all templates into an array
  const templates = []

  config.routes.forEach(route => {
    if (!route.component) {
      return
    }
    // Check if the template has already been added
    const index = templates.indexOf(route.component)
    if (index === -1) {
      // If it's new, add it
      templates.push(route.component)
      // Assign the templateID
      route.templateID = templates.length - 1
    } else {
      // Assign the existing templateID
      route.templateID = index
    }
  })
  timeEnd(chalk.green('=> [\u2713] Templates Built'))

  config.templates = templates

  await generateRoutes({
    config,
  })

  return templates
})
