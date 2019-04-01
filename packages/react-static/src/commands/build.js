import bundle from './bundle'
import exporter from './export'

export default (async function build(state) {
  state = await bundle({ ...state, isBuildCommand: true })
  return exporter(state)
})
