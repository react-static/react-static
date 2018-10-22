import jsLoader from './jsLoader'
import cssLoader from './cssLoader'
import fileLoader from './fileLoader'
import jsLoaderExternal from './jsLoaderExternal'

export const getStagedRules = args => ({
  jsLoader: jsLoader(args),
  jsLoaderExt: jsLoaderExternal(args),
  cssLoader: cssLoader(args),
  fileLoader: fileLoader(args),
})

export default args => [
  {
    oneOf: [
      jsLoader(args),
      jsLoaderExternal(args),
      cssLoader(args),
      fileLoader(args),
    ],
  },
]
