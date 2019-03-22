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
  const { staging, debug, analyze } = state
  // ensure ENV variables are set
  if (typeof process.env.NODE_ENV === 'undefined' && !debug) {
    process.env.NODE_ENV = 'production'
  }
  process.env.REACT_STATIC_ENV = 'production'
  process.env.BABEL_ENV = 'production'

  state.stage = 'prod'

  console.log(
    `=> Bundling application for ${staging ? 'Staging' : 'Production'}...`
  )
  console.log('')

  state = await getConfig(state)

  if (debug) {
    console.log('DEBUG - Resolved static.config.js:')
    console.log(state)
  }

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

  return state
})
