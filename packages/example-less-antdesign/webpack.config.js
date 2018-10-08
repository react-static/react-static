/*
* ============================= PATH ALIAS HELPER =============================
* This file converts the tsconfig.json paths aliases to a webpack compatible
* format. This is great for IDEs which parse webpack configurations for
* codesense (such as WebStorm) and allows your code to go from

  import {component} from "../../../../something";

* by simply adding to your compilerOptions:

  "paths": {
    "@mycomponents/*":
      ["src/mylegacy/library/components/*"]
  }

* to

  import {component} from "@mycomponents/something";

* which fully supports js(x) and ts(x) files in react-static without node
* module resolution constraints (nesting package.json's).

* More Information:
* https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping
* https://github.com/marzelin/convert-tsconfig-paths-to-webpack-aliases

* ================== IMPORTANT: Folders must be lowercase ===================
* Only use lowercase letters for folder names, because there is a lasting bug
* in webpacks watch mode concerning the CaseSensitivePathsPlugin:
* https://github.com/webpack/webpack/issues/5073#issuecomment-317108683
* */

const convPaths = require('convert-tsconfig-paths-to-webpack-aliases').default

// Needs to be valid JSON. All comments in tsconfig.json must be removed.
const tsconfig = require('./tsconfig.json')

const aliases = convPaths(tsconfig)

// Consumable std. Webpack Export
module.exports = {
  resolve: {
    alias: aliases,
  },
}
