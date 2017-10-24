# 3.0.0
#### Breaking Changes
- Your `index.js` file must now export your app in NON-JSX form, eg. `export default App`, not `<App />`. With this change, builds can be faster, leaner, and have more control over the build pipeline.
- The optional `Html` component in `static.config.js` was renamed to `Document`.
- The `preRenderMeta` and `postRenderMeta` hooks in `static.config.js` have been deprecated in favor of the new `renderToHtml` hook. This is a very important change, so please check the readme if you are using these hooks!
- The new `renderToHtml` hook now uses a **mutable** meta object. This object is passed as a prop to the base `Document` component as `renderMeta` now, instead of the previous `staticMeta`.

#### Features
- New `PrefetchWhenSeen` component allows for prefetching when component becomes visible in the viewport.

#### Fixes & Optimizations
- Exporting is now up to 2x faster after switching from a dual pass to a single pass render strategy.
- Fixed a very elusive and angering bug where imported node_modules were not being shared between the node context and the node webpack build of the app used for exporting.

# 2.0.0
#### Breaking Changes
- The `webpack` function in `static.config.js` has a new function signature.
  - The new value can be an array of functions or a single function.
  - Each function passed will receive the previous resulting (or built-in) webpack config, and expect a modified or new config to be returned. See [Webpack Config and Plugins](#webpack-config-and-plugins)

#### Features
Now that the `webpack` callback accepts an array of transformer functions, the concept of plugins has been introduced. These transformer functions are applied in order from top to bottom and have total control over the webpack config. For more information see [Webpack Config and Plugins](#webpack-config-and-plugins)
```
webpack: [
  withCssLoader,
  withFileLoader
]
```

#### Fixes & Optimizations
All route exporting is now done via a node bundle that is packaged with webpack. This should dramatically increase reliability in customization and cross-platform usability.
