import chalk from 'chalk'
//
import getRoutes from '../static/getRoutes'
import generateBrowserPlugins from '../static/generateBrowserPlugins'
import buildProductionBundles from '../static/webpack/buildProductionBundles'
import getConfig from '../static/getConfig'
import extractTemplates from '../static/extractTemplates'
import generateTemplates from '../static/generateTemplates'
import cleanProjectFiles from '../static/cleanProjectFiles'
import copyPublicFiles from '../static/copyPublicFiles'
import { outputBuildState } from '../static/buildState'

export default (async function bundle(state = {}) {
  const { staging, debug, analyze, isBuildCommand } = state
  // ensure ENV variables are set
  if (typeof process.env.NODE_ENV === 'undefined' && !debug) {
    process.env.NODE_ENV = 'production'
  }
  process.env.REACT_STATIC_ENV = 'production'
  process.env.BABEL_ENV = 'production'

  state.stage = 'prod'

  console.log(
    `Bundling application for ${staging ? 'Staging' : 'Production'}...`
  )
  console.log('')

  state = await getConfig(state)
  state = await cleanProjectFiles(state)
  state = await generateBrowserPlugins(state)
  state = await getRoutes(state)
  state = await extractTemplates(state)
  state = await generateTemplates(state)
  state = await copyPublicFiles(state)
  state = await buildProductionBundles(state)
  state = await outputBuildState(state)

  if (analyze) {
    await new Promise(() => {})
  }

  if (!isBuildCommand) {
    console.log(`
Your app is now bundled! Here's what we suggest doing next:

- Export your app in staging mode to test locally
  - ${chalk.green('react-static export --stage')}
- Export your app in production mode for distrubution
  - ${chalk.green('react-static export')}
- Analyze your app's webpack bundles
  - ${chalk.green('react-static bundle --analyze')}
`)
  }

  return state
})
