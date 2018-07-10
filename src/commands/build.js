import bundle from './bundle'
import exporter from './export'

export default async function build (args) {
  const config = await bundle(args)
  return exporter({ ...args, config, isBuild: true })
}
