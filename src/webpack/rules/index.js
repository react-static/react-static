import jsLoader from './jsLoader'
import cssLoader from './cssLoader'
import fileLoader from './fileLoader'

export const getStagedRules = args => ({
  jsLoader: jsLoader(args),
  cssLoader: cssLoader(args),
  fileLoader: fileLoader(args),
})

export default args => [
  {
    oneOf: [jsLoader(args), cssLoader(args), fileLoader(args)],
  },
]
