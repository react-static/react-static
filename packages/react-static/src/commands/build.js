import bundle from './bundle'
import exporter from './export'

export default (async function build(state) {
  state = await bundle(state)
  return exporter({ ...state, isBuildCommand: true })
})
