import generateBrowserPlugins from './generateBrowserPlugins'
import buildXML from './buildXML'
import { makeHookReducer } from '../utils'

export { default as extractTemplates } from './extractTemplates'
export { default as prepareRoutes } from './prepareRoutes'

export { buildXML }

export default (async function preparePlugins({ config }) {
  const beforePrepareBrowserPlugins = makeHookReducer(
    config.plugins,
    'beforePrepareBrowserPlugins'
  )
  config = await beforePrepareBrowserPlugins(config)

  generateBrowserPlugins({ config })

  const afterPrepareBrowserPlugins = makeHookReducer(
    config.plugins,
    'afterPrepareBrowserPlugins'
  )
  config = await afterPrepareBrowserPlugins(config)

  return config
})
