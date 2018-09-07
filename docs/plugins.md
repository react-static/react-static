# Plugins

React Static ships with a simple plugin system that allows both plugin creators and site developers extend React-Static's built-in functionality.

## Using Plugins

You can use plugins 3 different ways:

- `static.config.js` - Little did you know your `static.config.js` file is already a fancy built-in plugin! Any [plugin hooks](#plugin-api) documented here can also be used directly in your `static.config.js`.
- The `/plugins/` directory in the root of your project. Any file you place here can be added to the `plugins: []` array in your `static.config.js`.
- By installing it as a `node_module`. You can install any react-static compatible plugin via `npm` and add it to the `plugins: []` array in your `static.config.js`.

#### Plugin Resolution

Plugins are resolved in this order:

1.  Plugins with an absolute path. Eg. `~/path/to/my/plugin.js` would resolve to that path.
2.  Plugins found in the `/plugins` directory of your project root. Eg. `myPlugin` would resolve to `/plugins/myPlugins.js`.
3.  Plugins found in `node_modules`. Eg. `react-static-plugin-emotion` would resolve to `node_modules/react-static-plugin-emotion`.

#### Plugin Options

Plugins can be passed options by using an array (similar to how babel and eslint work).
- The first item in the array is the `plugin name string`
- The second item in the array is the `options object` that will be passed to the plugin


```javascript
export default {
  plugins: [
    [
      'react-static-plugin-awesome',
      {
        awesomeOption: true,
      }
    ]
  ]
}
```

## Official Plugins

See the [/docs#plugins](Readme's Plugin section) for the official list of supported react-static plugins

## Building A Plugin

A plugin is a single `default export` of a `function` that recieves **plugin options from the user (optional)** and **returns an `object`** providing any number of **hook methods** to use.

A plugin typically looks like this:

```javascript
export default pluginOptions => ({
  someHook: (hookItem, hookOptions) => {
    // Do something amazing!
    return hookItem
  }
})
```

## Plugin Execution and Order

**ORDER IS IMPORTANT!!!** Plugins are executed in the order that they are defined in the `plugins: []` array in the `static.config.js`. Also, any hooks used directory in the `static.config.js` will be performed last.

## Plugins must be compiled if installed via node_modules

If a plugin is installed via any method other than the `plugins` directory, it will not be transformed by react-static's `.babelrc` runtime, so you **must compile your plugin to be ES5 compatible if you distribute it**. This can be done via `@babel/core` and the babel-cli. The [react-static-plugin-styled-components](https://github.com/nozzle/react-static-plugin-styled-components) plugin does this and is a prime example to follow.

## Plugin API

Plugins hooks are executed throughout the lifecycle of a react-static build in the order below:

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
