import jsLoader from './jsLoader'
import cssLoader from './cssLoader'
import universalLoader from './universalLoader'

export const getStagedRules = args => ({
  jsLoader: jsLoader(args),
  cssLoader: cssLoader(args),
  universalLoader: universalLoader(args),
})

export default args => [
  {
    oneOf: [...jsLoader(args), ...cssLoader(args), ...universalLoader(args)],
  },
]
