# Plugins

React Static ships with a simple plugin API that allows both plugin creators and site developers to extend React-Static's core functionality.

## Installing Plugins

#### Official Plugins via NPM

You can install any react-static compatible plugin via `npm`. Once it is installed, it can be used by React Static.

- CSS & Style Tooling
  - [react-static-plugin-emotion](/packages/react-static-plugin-emotion) - Adds SSR support for Emotion components.
  - [react-static-plugin-styled-components](/packages/react-static-plugin-styled-components) - Adds SSR support for Styled-Components
  - [react-static-plugin-sass](/packages/react-static-plugin-sass) - Adds SSR and general support for SASS
  - [react-static-plugin-jss](/packages/react-static-plugin-jss) - Adds SSR support for JSS
- React Alternatives
  - [react-static-plugin-preact](/packages/react-static-plugin-preact) - Adds preact support
- Type checking
  - [react-static-plugin-typescript](https://www.npmjs.com/package/react-static-plugin-typescript) - Allows you to write your components in TypeScript
- Assets
  - [react-static-plugin-favicons](https://www.npmjs.com/package/react-static-plugin-favicons) - Generate (fav)icons in many different sizes for many different platforms, and add them to your site's metadata
- Don't see a plugin? Help us build it! All the info you need can be found below :)

#### Local Plugins via the `/plugins` directory

If you have a custom plugin or are developing a plugin locally, you can place your plugin directory in the `/plugins` directory in your project root. It can then be used by React Static.

#### Local Plugin API via the `/node.api.js` and `/browser.api.js` project files

If you simply need direct access to the the plugin API for a project, you can create a `node.api.js` and/or `browser.api.js` file in the root of your project. These files are treated just like plugins themselves, but do not receive plugin options and are executed very last in the plugin cycle.

## Using & Configuring Plugins

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

Plugins at the end of the day, are just files (or a `directory` that contains the files):

- `node.api.js` - Exposes the [Node Plugin API](/docs/plugins/node-api.md)
- `browser.api.js` - Exposes the [Browser Plugin API](/docs/plugins/browser-api.md)

## Why separate node and browser entry points for plugins?

We use separate entry points for node and browser context so as to not create conflict with imports that may not be supported in both environments.

To use either API, the corresponding API file must:

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
