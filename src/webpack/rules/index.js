import loadJavascript from './loadJavascript'
import loadCSS from './loadCSS'
import loadAnything from './loadAnything'

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

export default args => [...loadJavascript(args), ...loadCSS(args), ...loadAnything(args)]
