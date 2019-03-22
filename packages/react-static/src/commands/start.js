import getRoutes from '../static/getRoutes'
import generateBrowserPlugins from '../static/generateBrowserPlugins'
import runDevServer from '../static/webpack/runDevServer'
import getConfig from '../static/getConfig'
import extractTemplates from '../static/extractTemplates'
import generateTemplates from '../static/generateTemplates'
import fetchSiteData from '../static/fetchSiteData'
import createIndexPlaceholder from '../utils/createIndexPlaceholder'
//

export default (async function start(state = {}) {
  const { debug } = state
  // ensure ENV variables are set
  if (typeof process.env.NODE_ENV === 'undefined') {
    process.env.NODE_ENV = 'development'
  }

  process.env.REACT_STATIC_ENV = 'development'
  process.env.BABEL_ENV = 'development'

  state.stage = 'dev'

  console.log(`=> Starting Development Server...`)

  getConfig(state, async state => {
    console.log('')
    if (debug) {
      console.log('DEBUG:')
      console.log(state)
    }

    state = await fetchSiteData(state)
    state = await createIndexPlaceholder(state)
    state = await generateBrowserPlugins(state)
    state = await getRoutes(state)
    state = await extractTemplates(state)
    state = await generateTemplates(state)
    state = await runDevServer(state)
  })

  await new Promise(() => {
    // Do nothing indefinitely, the user must exit this command
  })
})
