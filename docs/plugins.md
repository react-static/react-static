# Plugins

React Static ships with a simple plugin API that allows both plugin creators and site developers extend React-Static's core functionality.

## Official Plugins

See the [/docs#plugins](Readme's Plugin section) for the official list of supported react-static plugins

## Installing A Plugin

There are 2 ways to install plugins:

- **NPM**. You can install any react-static compatible plugin via `npm`. Once it is installed, it can be used by React Static.
- **Locally via the `/plugins` directory** - If you have a custom plugin or are developing a plugin locally, you can place your plugin directory in the `/plugins` directory in your project roo. It can then be used by React Static.

## Using Plugins

Once a plugin is installed, you can add use and configure it by adding it to the `plugins` array in your `static.config.js`:

```javascript
// static.config.js

export default {
  plugins: [
    'react-static-plugin-emotion',
    'my-custom-plugin'
  ]
}
```

#### Plugin Execution and Order

**ORDER IS IMPORTANT!!!** Plugins are executed in the order that they are defined in the `plugins: []` array in the `static.config.js`. Also, any methods used directory in the `static.config.js` will be performed last.

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
export default {
  plugins: [
    [
      'react-static-plugin-awesomeness',
      {
        isAwesome: true,
      }
    ]
  ]
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
- That function recieves **plugin options from the user (optional)** 
- **Return an `object`** providing any **API methods** to implement

Here is an **pseudo** example of what a plugin typically looks like:

```javascript
export default pluginOptions => ({
  reducerMethod: (Item, Options) => {
    // Do something amazing!
    return Item
  },
  mappedMethod: (Options) => {
    // Do something amazing!
    return true
  }
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

See [`config.webpack`](/docs/config/#webpack).

#### `Head: Component|Function`

Append arbitrary JSX to the Head component of the application.

- Must be a react or functional component that returns its contents wrapped in a `<React.Fragment>`.
- Provides the user `meta` object as a prop.
- Example:

```javascript
Head: ({ meta }) => (
  <React.Fragment>
    <link rel="stylesheet" href="..." />
    <link rel="stylesheet" href="..." />
  </React.Fragment>
)
```

#### `beforeRenderToElement: Function`

Intercept and proxy the `App` component before it is rendered to an element via `<App />`.

- Arguments:
  - `App` - The `App` component (not yet rendered to an element via `<App />`)
  - `options{}`
    - `meta` - The user `meta` object
- Returns a new `App` component (not yet rendered to an element)

#### `beforeRenderToHtml: Function`

Intercept and proxy the rendered `<App />` element before it is rendered to HTML.

- Arguments:
  - `app` - The `app` element (has already been rendered via `<App />`)
  - `options{}`
    - `meta` - The user `meta` object
- Returns a new react element for the App

#### `beforeHtmlToDocument: Function`

Intercept and proxy the app `html` string before it is injected into the `Document` component.

- Arguments:
  - `html` - The app `html` string to be injected into the Document component
  - `options{}`
    - `meta` - The user `meta` object
- Returns a new `html` string to be injected into the `Document` component

#### `beforeDocumentToFile: Function`

Intercept and proxy the final `html` string before it is written to disk.

- Arguments:
  - `html` - The final `html` string before it is written to disk
  - `options{}`
    - `meta` - The user `meta` object
- Returns a new final `html` string to be written to disk.

#### `plugins: Array(plugin)`

An array of plugins that this plugin depends on. Follows the same format as `static.config.js` does for importing plugins and options.

## Browser Plugin API

There are no browser methods yet! Let's add some :)
