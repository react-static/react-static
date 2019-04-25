const { setIgnorePath } = require('../utils/binHelper')
// eslint-disable-next-line
const path = require('path')
const getConfig = require('./getConfig').default
const { DefaultDocument } = require('./components/RootComponents')
const { poolAll } = require('../utils')
const exportRoute = require('./exportRoute').default

process.on('message', async state => {
  try {
    const { routes } = state
    // Get config again

    state = await getConfig(state)

    setIgnorePath(state.config.paths.ARTIFACTS)

    // Use the node version of the app created with webpack
    // eslint-disable-next-line
    const Comp = require(path.resolve(
      state.config.paths.ARTIFACTS,
      'static-app.js'
    )).default
    // Retrieve the document template
    const DocumentTemplate = state.config.Document || DefaultDocument

    const tasks = []
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i]
      // eslint-disable-next-line
      tasks.push(async () => {
        await exportRoute({
          ...state,
          route,
          Comp,
          DocumentTemplate,
        })
        if (process.connected) {
          process.send({ type: 'tick' })
        }
      })
    }
    await poolAll(tasks, Number(state.config.outputFileRate))
    if (process.connected) {
      process.send({ type: 'done' })
    }
    process.exit()
  } catch (err) {
    console.error(err)
    if (process.connected) {
      process.send({ type: 'error', payload: err })
    }
    process.exit(1)
  }
})
