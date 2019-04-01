import chalk from 'chalk'
//
import exportRoutes from '../static/exportRoutes'
import getRoutes from '../static/getRoutes'
import getConfig from '../static/getConfig'
import extractTemplates from '../static/extractTemplates'
import { importClientStats } from '../static/clientStats'

export default async (state = {}) => {
  const { debug, isBuildCommand, staging, incremental } = state
  // ensure ENV variables are set
  if (typeof process.env.NODE_ENV === 'undefined' && !debug) {
    process.env.NODE_ENV = 'production'
  }

  process.env.REACT_STATIC_ENV = 'production'
  process.env.BABEL_ENV = 'production'

  if (incremental) {
    process.env.REACT_STATIC_INCREMENTAL = 'true'
  }

  state.stage = 'prod'

  if (!isBuildCommand) {
    console.log(
      `Exporting application for ${staging ? 'Staging' : 'Production'}...`
    )
    console.log('')
  }

  // Allow config location to be overriden
  if (!isBuildCommand) {
    state = await getConfig(state)
    state = await getRoutes(state)
    state = await extractTemplates(state)
  }

  if (!state.routes) {
    state = await getRoutes(state)
  }

  state = await importClientStats(state)
  state = await exportRoutes(state)

  console.log(`
Your app is now exported! Here's what we suggest doing next:
${
  staging
    ? `
- Test your app locally
  - ${chalk.green(
    'serve dist -p 3000'
  )} (or your preferred static server utility)`
    : `
- Upload your 'dist' directory to your favorite static host! We recommend using Netlify:
  - ${chalk.green('npx netlify-cli deploy')}`
}
- Analyze your app's webpack bundles
  - ${chalk.green('react-static bundle --analyze')}
`)

  return state
}
