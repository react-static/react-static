# React-Static - TypeScript Template

To use this template, run `react-static create` and use the `typescript` template.

## Adding Path Aliases for Absolute Imports

Absolute imports are great for developer experience. You can enable them by modifying React-Static's webpack config within a [local plugin](https://github.com/nozzle/react-static/tree/master/docs/plugins#using--configuring-plugins):

```js
// node.api.js

// https://github.com/nozzle/react-static/blob/master/docs/plugins/node-api.md

// Paths Aliases defined through tsconfig.json
// more info: https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping
// more info: https://github.com/marzelin/convert-tsconfig-paths-to-webpack-aliases
// Folders must be lowercase!
const convPaths = require('convert-tsconfig-paths-to-webpack-aliases').default
// Needs to be valid JSON. All comments in tsconfig.json must be removed.
const tsconfig = require('./tsconfig.json')

export default pluginOptions => ({
  webpack: (config, { defaultLoaders }) => {
    config.resolve.alias = convPaths(tsconfig)
    return config
  },
})
```

Now this works:

```
// tsconfig.json
{
  // ...
    "paths": {
      "@components/*": ["src/components/*"]
    },
  // ...
}

// this works
import FancyDiv from '@components/FancyDiv'
```
