# Plugins

React Static ships with a simple plugin API that allows both plugin creators and site developers to extend React-Static's core functionality.

## Official Plugins

- CSS & Style Tooling
  - [react-static-plugin-emotion](/packages/react-static-plugin-emotion) - Adds SSR support for Emotion components.
  - [react-static-plugin-styled-components](/packages/react-static-plugin-styled-components) - Adds SSR support for Styled-Components
  - [react-static-plugin-sass](/packages/react-static-plugin-sass) - Adds SSR and general support for SASS
  - [react-static-plugin-jss](/packages/react-static-plugin-jss) - Adds SSR support for JSS
- React Alternatives
  - [react-static-plugin-preact](/packages/react-static-plugin-preact) - Adds preact support
- Type checking
  - [react-static-plugin-typescript](https://www.npmjs.com/package/react-static-plugin-typescript) - Allows you to write your components in TypeScript
- Don't see a plugin? Help us build it! All the info you need can be found below :)

## Installing A Plugin

There are 3 ways to install plugins and use the plugin API:

- **NPM**. You can install any react-static compatible plugin via `npm`. Once it is installed, it can be used by React Static.
- **Locally via the `/plugins` directory** - If you have a custom plugin or are developing a plugin locally, you can place your plugin directory in the `/plugins` directory in your project root. It can then be used by React Static.
- **Locally via the `/node.api.js` and `/browser.api.js` project files** - If you simply need the plugin API to customize something local to your project, you can create a `node.api.js` and/or `browser.api.js` file in the root of your project. These files are treated just like plugins themselves, but do not receive plugin options and are executed last in the plugin cycle.

## Using Plugins

Once a plugin is installed, you can use and configure it by adding it to the `plugins` array in your `static.config.js`:

```javascript
// static.config.js

export default {
  plugins: ['react-static-plugin-emotion', 'my-custom-plugin'],
}
```

#### Plugin Execution and Order

**ORDER IS IMPORTANT!!!** Plugins are executed in the order that they are defined in the `plugins: []` array in the `static.config.js`. Also, any `node.api.js` and `browser.api.js` files found in the project root will be performed last.

#### Plugin Resolution

Plugins are resolved in this order:

1.  Plugins with an absolute path. Eg. `~/path/to/my/plugin.js` would resolve to that path.
2.  Plugins found in the `/plugins` directory of your project root. Eg. `myPlugin` would resolve to `/plugins/myPlugins.js`.
3.  Plugins found in `node_modules`. Eg. `react-static-plugin-emotion` would resolve to `node_modules/react-static-plugin-emotion`.

## Plugin Options

Plugins can be passed options by using an array (similar to how babel and eslint work).

- The first item in the array is the `plugin name string`
- The second item in the array is the `options object` that will be passed to the plugin

```javascript
// static.config.js

export default {
  plugins: [
    [
      'react-static-plugin-awesomeness',
      {
        isAwesome: true,
      },
    ],
  ],
}
```

## Plugin API

Plugins at the end of the day, are just a `directory` with the following files at the directory's root:

- `node.api.js` - Exposes the [Node Plugin API](#node-plugin-api)
- `browser.api.js` - Exposes the [Browser Plugin API](#browser-plugin-api)

## Why separate node and browser entry points for plugins?

We use separate entry points for node and browser context so as to not create conflict with imports that may not be supported in both environments.

To use either API, the corresponding file must:

- Provide a `function` as the `default export`
- That function receives **plugin options from the user (optional)**
- **Return an `object`** providing any **API methods** to implement

Here is a **pseudo** example of what a plugin typically looks like:

```javascript
// node.api.js or browser.api.js

export default pluginOptions => ({
  reducerMethod: (Item, Options) => {
    // Do something amazing!
    return Item
  },
  mappedMethod: Options => {
    // Do something amazing!
    return true
  },
})
```

#### Plugins must be compiled if installed via node_modules

If a plugin is installed via any method other than the `plugins` directory, it will not be transformed by react-static's `.babelrc` runtime, so you **must compile your plugin to be ES5 compatible if you distribute it**. This can be done via `@babel/core` and the babel-cli. The [react-static-plugin-styled-components](https://github.com/nozzle/react-static-plugin-styled-components) plugin does this and is a prime example to follow.

## Node Plugin API

Plugins methods are executed throughout the lifecycle of a react-static build in the order below:

#### `config: Function`

A method to modify the final `static.config.js` for React Static.

- Arguments:
  - `config{}` - The `static.config.js`
- Returns a new or modified `config{}` object

#### `webpack: Function|Function[]`

An optional function or array of functions to transform the default React-Static webpack config. Each function will receive the previous webpack config, and expect a modified or new config to be returned. You may also return a "falsey" or `undefined` value if you do not want to modify the config at all.

**Function Signature**

```javascript
webpack: []Function(
  previousConfig,
  args: {
    stage,
    defaultLoaders: {
      jsLoader,
      jsLoaderExt,
      cssLoader,
      fileLoader
    }
  }
) => {
  return newConfig // or a falsey value to cancel transformation
}
```

- The `webpack` property's value can be an **array of functions** or a **single function**.
- Each function will receive the previous webpack config, and can return a modified or new config.
- Return any falsey value to cancel the transformation
- `args.stage` is a string of either `prod`, `dev` or `node`, denoting which stage react-static is building for.
- `args.defaultLoaders` - A convenience object containing the default react-static webpack rule functions:
  - `jsLoader` - The default loader for all `.js` files located in your project's `src` directory
  - `jsLoaderExt` - The default loader for all other `.js` files not located in your project's `src` directory.
  - `cssLoader` - The default style loader that supports importing `.css` files and usage of css modules.
  - `fileLoader` - The default catch-all loader for any other file that isn't a `.js` `.json` or `.html` file. Uses `url-loader` and `file-loader`

When `webpack` is passed an array of functions, they are applied in order from top to bottom and are each expected to return a new or modified config to use. They can also return a falsey value to opt out of the transformation and defer to the next function.

By default, React Static's webpack toolchain compiles `.js` and `.css` files. Any other file that is not a `.js` `.json` or `.html` file is also processed with the `fileLoader` (images, fonts, etc.) and will move to `./dist` directory on build. The source for all default loaders can be found in [react-static/lib/webpack/rules/](https://github.com/nozzle/react-static/blob/master/src/webpack/rules).

Our default loaders are organized like so:

```javascript
const webpackConfig = {
  ...
  module: {
    rules: [{
      oneOf: [
        jsLoader, // Compiles all project .js files with babel
        jsLoaderExt, // Compiles all external .js files with babel
        cssLoader, // Supports basic css imports and css modules
        fileLoader // Catch-all url-loader/file-loader for anything else
    }]
  }
  ...
}
```

**Note:** Usage of the `oneOf` rule is not required, but recommended. This ensures each file is only handled by the first loader it matches, and not any loader. This also makes it easier to reutilize the default loaders, without having to fuss with `excludes`. Here are some examples of how to replace and modify the default loaders:

**Replacing all rules**

```javascript
// node.api.js

export default pluginOptions => ({
  webpack: config => {
    config.module.rules = [
      // Your own rules here...
    ]
    return config
  },
}
```

**Replacing a default loader for a different one**

```javascript
// node.api.js

export default pluginOptions => ({
  webpack: (config, { defaultLoaders }) => {
    config.module.rules = [{
      oneOf: [
        defaultLoaders.jsLoader,
        defaultLoaders.jsLoaderExt,
        {
          // Use this special loader
          // instead of the cssLoader
        }
        defaultLoaders.fileLoader,
      ]
    }]
    return config
  }
})
```

**Adding a plugin**

```javascript
// node.api.js

import AwesomeWebpackPlugin from 'awesome-webpack-plugin'

export default pluginOptions => ({
  webpack: config => {
    config.plugins.push(new AwesomeWebpackPlugin())
    return config
  },
})
```

**Using multiple transformers**

```javascript
// node.api.js

export default pluginOptions => ({
  webpack: [
    (config, { defaultLoaders }) => {
      config.module.rules = [
        {
          oneOf: [
            defaultLoaders.jsLoader,
            defaultLoaders.jsLoaderExt,
            defaultLoaders.cssLoader,
            {
              loader: 'file-loader',
              test: /\.(fancyFileExtension)$/,
              query: {
                limit: 10000,
                name: 'static/[name].[hash:8].[ext]',
              },
            },
            defaultLoaders.fileLoader,
          ],
        },
      ]
      return config
    },
    config => {
      console.log(config.module.rules) // Log out the final set of rules
    },
  ],
})
```

#### `Head: Component|Function`

Append arbitrary JSX to the Head component of the application.

- Must be a react or functional component that returns its contents wrapped in a `<React.Fragment>`.
- Provides the user `meta` object as a prop.
- Example:

```javascript
// node.api.js

export default pluginOptions => ({
  Head: ({ meta }) => (
    <React.Fragment>
      <link rel="stylesheet" href="..." />
      <link rel="stylesheet" href="..." />
    </React.Fragment>
  ),
})
```

#### `beforeRenderToElement: Function`

Intercept and proxy the `App` component before it is rendered to an element via `<App />`.

- Arguments:
  - `App` - The `App` component (not yet rendered to an element via `<App />`)
  - `options{}`
    - `meta` - The user `meta` object
- Returns a new `App` component (not yet rendered to an element)

```javascript
// node.api.js

export default pluginOptions => ({
  beforeRenderToElement: (App, { meta }) => {
    return App
  },
})
```

#### `beforeRenderToHtml: Function`

Intercept and proxy the rendered `<App />` element before it is rendered to HTML.

- Arguments:
  - `app` - The `app` element (has already been rendered via `<App />`)
  - `options{}`
    - `meta` - The user `meta` object
- Returns a new react element for the App

```javascript
// node.api.js

export default pluginOptions => ({
  beforeRenderToHtml: (element, { meta }) => {
    return element
  },
})
```

#### `beforeHtmlToDocument: Function`

Intercept and proxy the app `html` string before it is injected into the `Document` component.

- Arguments:
  - `html` - The app `html` string to be injected into the Document component
  - `options{}`
    - `meta` - The user `meta` object
- Returns a new `html` string to be injected into the `Document` component

```javascript
// node.api.js

export default pluginOptions => ({
  beforeHtmlToDocument: (html, { meta }) => {
    return html
  },
})
```

#### `beforeDocumentToFile: Function`

Intercept and proxy the final `html` string before it is written to disk.

- Arguments:
  - `html` - The final `html` string before it is written to disk
  - `options{}`
    - `meta` - The user `meta` object
- Returns a new final `html` string to be written to disk.

```javascript
// node.api.js

export default pluginOptions => ({
  beforeDocumentToFile: (html, { meta }) => {
    return html
  },
})
```

#### `plugins: Array(plugin)`

An array of plugins that this plugin depends on. Follows the same format as `static.config.js` does for importing plugins and options.

```javascript
// node.api.js

export default pluginOptions => ({
  plugins: [
    'another-plugin',
    [
      'another-plugin-with-options',
      {
        anOption: true,
      },
    ],
  ],
})
```

## Browser Plugin API

There are no browser methods yet, so let's add some! :)
