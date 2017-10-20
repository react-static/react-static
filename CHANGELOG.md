# 2.0.0
#### Breaking Changes
- The `webpack` function in `static.config.js` has a new function signature.
  - The new value can be an array of functions or a single function.
  - Each function passed will receive the previous resulting (or built-in) webpack config, and expect a modified or new config to be returned. See [Webpack Config and Plugins](#webpack-config-and-plugins)

#### Features
- Now that the `webpack` callback accepts an array of transformer functions, the concept of plugins has been introduced. These transformer functions are applied in order from top to bottom and have total control over the webpack config. For more information see [Webpack Config and Plugins](#webpack-config-and-plugins)
```
webpack: [
  withCssLoader,
  withFileLoader
]
