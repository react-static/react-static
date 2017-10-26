import jsLoader from './jsLoader'
import cssLoader from './cssLoader'
import universalLoader from './universalLoader'

export const withoutRules = config => {
  config.module.rules = []
  return config
}

export const addRules = (config, moduleRules, args) => {
  if (!Array.isArray(moduleRules)) {
    moduleRules = [moduleRules]
  }

  config.module.rules = config.module.rules.concat(
    ...moduleRules.map(a => (typeof a === 'function' ? a(args) : a)),
  )
  return config
}

export default args => [...jsLoader(args), ...cssLoader(args), ...universalLoader(args)]
