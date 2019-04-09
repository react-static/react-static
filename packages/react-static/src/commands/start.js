import getRoutes from '../static/getRoutes'
import generateBrowserPlugins from '../static/generateBrowserPlugins'
import runDevServer from '../static/webpack/runDevServer'
import getConfig from '../static/getConfig'
import extractTemplates from '../static/extractTemplates'
import generateTemplates from '../static/generateTemplates'
import createIndexPlaceholder from '../utils/createIndexPlaceholder'
//

export default (async function start(state = {}) {
  // ensure ENV variables are set
  if (typeof process.env.NODE_ENV === 'undefined') {
    process.env.NODE_ENV = 'development'
  }

  process.env.REACT_STATIC_ENV = 'development'
  process.env.BABEL_ENV = 'development'

  state.stage = 'dev'

  console.log(`Starting Development Server...`)

  // Use a callback (a subscription)
  getConfig(state, async state => {
    state = await createIndexPlaceholder(state)
    state = await generateBrowserPlugins(state)

    // Use a callback (a subscription)
    // eslint-disable-next-line
    await getRoutes(state, async state => {
      state = await extractTemplates(state)
      state = await generateTemplates(state)
      state = await runDevServer(state)
    })
  })

  await new Promise(() => {
    // Do nothing indefinitely, the user must exit this command
  })
})
