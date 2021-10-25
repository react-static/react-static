# Node Plugin API

Plugins functions are executed throughout the lifecycle of a react-static build in the order below:

## `afterGetConfig`

A **synchronous** function to modify the resolved config object during build or export.

- Arguments:
  - `config` - The `static.config.js`
  - `state` - The current state of the cli
- Returns a new or modified `config` object

```javascript
afterGetConfig: (previousConfig, state) => {
  // Return a new config
  return newConfig
}
```

## `beforePrepareBrowserPlugins`

An **async** function to modify the CLI state before browser plugins are prepared.

- Arguments:
  - `state` - The current state of the cli
- Returns the new CLI `state`

```javascript
beforePrepareBrowserPlugins: async state => {
  // Use or modify the CLI state
  return newState
}
```

## `afterPrepareBrowserPlugins`

An **async** function to modify the CLI state after preparing browser plugins.

- Arguments:
  - `state` - The current state of the cli
- Returns the new CLI `state`

```javascript
afterPrepareBrowserPlugins: async state => {
  // Use or modify the CLI state
  return newState
}
```

## `beforePrepareRoutes`

An **async** function to modify the CLI state before preparing routes.

- Arguments:
  - `state` - The current state of the cli
- Returns the new CLI `state`

```javascript
beforePrepareRoutes: async state => {
  // Use or modify the CLI state
  return newState
}
```

## `normalizeRoute`

A **synchronous** function to modify the route after it has been normalized.

- Arguments:
  - `info{}`
    - `route` - The normalized route after it has been normalized
    - `parent` - The parent route
  - `state` - The current state of the cli
- Returns the new `normalizedRoute`

```javascript
normalizeRoute: ({ route, parent }, state) => {
  // Modify the route
  return route
}
```

## `afterPrepareRoutes`

An **async** function to modify the CLI state before preparing routes.

- Arguments:
  - `state` - The current state of the cli
- Returns the new CLI `state`

```javascript
afterPrepareRoutes: async state => {
  // Use or modify the CLI state
  return newState
}
```

## `webpack`

A **synchronous** function to modify the webpack config.

- Arguments:
  - `currentWebpackConfig` - The current webpack configuration object
  - `state` - The current state of the CLI
- Returns a new webpack configuration object

```javascript
webpack: (currentWebpackConfig, state) => {
  // Return a new config
  return newConfig
}
```

**Loaders**
The default loaders for React Static are available as a convenience object at `state.defaultLoaders`:

- `jsLoader` - The default loader for all `.js` files located in your project's `src` directory
- `jsLoaderExt` - The default loader for all other `.js` files not located in your project's `src` directory.
- `cssLoader` - The default style loader that supports importing `.css` files and usage of css modules.
- `fileLoader` - The default catch-all loader for any other file that isn't a `.js` `.json` or `.html` file. Uses `url-loader` and `file-loader`

Our default loaders are organized like so:

```javascript
const webpackConfig = {
  ...
  module: {
    rules: [{
      oneOf: [
        jsLoader, // Compiles all project javascript files with babel
        jsLoaderExt, // Compiles all external (node_modules) javascript files with babel
        cssLoader, // Supports basic css imports and css modules
        fileLoader // Catch-all url-loader/file-loader for anything else
    }]
  }
  ...
}
```

The source for all default loaders can be found in [webpack/rules/ directory](https://github.com/react-static/react-static/tree/master/packages/react-static/src/static/webpack/rules).

**Note:** Usage of the `oneOf` rule is recommended. This ensures each file is only handled by the first loader it matches, and not any loader. This also makes it easier to reutilize the default loaders, without having to fuss with `excludes`. Here are some examples of how to replace and modify the default loaders:

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
})
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

## `afterBundle`

After a completed bundle, run any asynchronous function.

- Arguments:
  - `state` - The current state of the CLI
- Returns a new `state` object

```javascript
// node.api.js

export default pluginOptions => ({
  afterBundle: async state => {
    // Use or alter the state of the CLI
    return state
  },
})
```

## `afterDevServerStart`

Modify the `App` **component** before it is rendered to an element via `<App />`.

- Arguments:
  - `App` - The `App` component (not yet rendered to an element via `<App />`)
  - `state` - The current state of the CLI
- Returns a new `App` component (not yet rendered to an element)

```javascript
// node.api.js

export default pluginOptions => ({
  afterDevServerStart: async state => {
    // Use or modify the CLI state
    return newState
  },
})
```

## `routeInfo`

An **async** function to modify the routeInfo after it has been generated.

- Arguments:
  - `storedRouteInfo` - The routeInfo that is stored, should only contain data that can be sent to the client
  - `options.routeInfo` - This is the routeInfo object with additional information that is not sent to the client, but can be used by the hook
  - `options.state` - The current state of the CLI
- Returns a new routeInfo object

```javascript
// node.api.js

export default pluginOptions => ({
  routeInfo: async (storedRouteInfo, {routeInfo, state}) => {
    storedRouteInfo = {
      ...storedRouteInfo,
      data: {
        ...storedRouteInfo.data,
        somethingElse: 'Data added in hook',
      },
    }

    return storedRouteInfo
  },
})
```

## `beforeRenderToElement`

An **async** function to modify the CLI state after starting the development server.

- Arguments:
  - `App` - The `App` component (not yet rendered to an element via `<App />`)
  - `state` - The current state of the CLI
- Returns a new `App` component (not yet rendered to an element)

```javascript
// node.api.js

export default pluginOptions => ({
  beforeRenderToElement: async (App, state) => {
    const NewApp = props => {
      return <App {...props} />
    }

    // You must return the component, not the rendered element!
    return NewApp
  },
})
```

## `beforeRenderToHtml`

Modify the rendered `<App />` element before it is rendered to HTML.

- Arguments:
  - `app` - The `app` element (has already been rendered via `<App />`)
  - `state` - The current state of the CLI
- Returns a new react element for the App

```javascript
// node.api.js

export default pluginOptions => ({
  beforeRenderToHtml: async (element, state) => {
    // You must return an element (already rendered), not a component
    const newApp = <div>{element}</div>
    return newApp
  },
})
```

## `htmlProps`

Modify the props that will passed to the Document's `<html>` element.

- Arguments:
  - `props` - The current props object
  - `state` - The current state of the CLI
- Returns a new props object

```javascript
// node.api.js

export default pluginOptions => ({
  htmlProps: async (props, state) => {
    return {
      ...props,
      myProp: 'hello',
    }
  },
})
```

## `headElements`

Add elements to the `<head>` of the statically generated page.

- Arguments:
  - `elements` - The current array of elements that will be rendered into the head of the document.
  - `state` - The current state of the CLI
- Returns a new array of elements

```javascript
// node.api.js

export default pluginOptions => ({
  headElements: async (elements, state) => {
    return [
      ...elements,
      <link rel="stylesheet" href="..." />,
      <link rel="stylesheet" href="..." />,
    ]
  },
})
```

## `beforeHtmlToDocument`

Modify the app `html` string before it is injected into the `Document` component.

- Arguments:
  - `html` - The app `html` string to be injected into the Document component
  - `state` - The current state of the CLI
- Returns a new `html` string to be injected into the `Document` component

```javascript
// node.api.js

export default pluginOptions => ({
  beforeHtmlToDocument: async (html, state) => {
    // html is a string here. You can do whatever you like with it!
    return html
  },
})
```

## `beforeHtmlToFile`

Modify the final `html` string before it is written to disk.

- Arguments:
  - `html` - The final `html` string before it is written to disk
  - `state` - The current state of the CLI
- Returns a new final `html` string to be written to disk.

```javascript
// node.api.js

export default pluginOptions => ({
  beforeDocumentToFile: async (html, state) => {
    // html is a string here. You can do whatever you like with it!
    return html
  },
})
```

## `afterExport`

After a completed build and export, run any asynchronous function.

- Arguments:
  - `state` - The current state of the CLI
- Returns a new `state` object

```javascript
// node.api.js

export default pluginOptions => ({
  afterExport: async state => {
    // Use or alter the state of the CLI
    return state
  },
})
```

## `plugins: Array(plugin)`

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
