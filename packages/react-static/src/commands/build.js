import bundle from './bundle'
import exporter from './export'

export default (async function build(options) {
  const config = await bundle(options)
  return exporter({ ...options, config, isBuild: true })
})
