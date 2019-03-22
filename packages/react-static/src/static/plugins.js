import { getHooks, reduceHooks } from '../utils'

export default {
  afterGetConfig: state => {
    const hooks = getHooks(state.plugins, 'afterGetConfig')
    return reduceHooks(hooks)(state)
  },
  beforePrepareBrowserPlugins: state => {
    const hooks = getHooks(state.plugins, 'beforePrepareBrowserPlugins')
    return reduceHooks(hooks)(state)
  },
  afterPrepareBrowserPlugins: state => {
    const hooks = getHooks(state.plugins, 'afterPrepareBrowserPlugins')
    return reduceHooks(hooks)(state)
  },
  beforePrepareRoutes: state => {
    const hooks = getHooks(state.plugins, 'beforePrepareRoutes')
    return reduceHooks(hooks)(state)
  },
  getRoutes: (routes, state) => {
    const hooks = getHooks(state.plugins, 'getRoutes')
    return reduceHooks(hooks)(routes, state)
  },
  normalizeRoute: state => {
    const hooks = getHooks(state.plugins, 'normalizeRoute')
    return route => reduceHooks(hooks, { sync: true })(route, state)
  },
  afterPrepareRoutes: state => {
    const hooks = getHooks(state.plugins, 'afterPrepareRoutes')
    return reduceHooks(hooks)(state)
  },
  webpack: (config, state) => {
    const hooks = getHooks(state.plugins, 'webpack')
    return reduceHooks(hooks, { sync: true })(config, state)
  },
}
