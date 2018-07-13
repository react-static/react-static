# Plugins

React Static ships with a simple plugin system to make monotonous tasks just the opposite.

#### Installation

Adding a plugin is easy. Just add the plugin location to the `plugins` array in your `static.config.js`.

#### Resolution

Plugins are resolved in this order:

1.  Plugins with an absolute path. Eg. `~/path/to/my/plugin.js` would resolve to that path.
2.  Plugins found in the `/plugins` directory of your project root. Eg. `myPlugin` would resolve to `/plugins/myPlugins.js`.
3.  Plugins found in `node_modules`. Eg. `react-static-plugin-emotion` would resolve to `node_modules/react-static-plugin-emotion`.

### Official Plugins

- [react-static-plugin-emotion](https://github.com/nozzle/react-static-plugin-emotion) - Adds SSR support for Emotion components.
- [react-static-plugin-styled-components](https://github.com/nozzle/react-static-plugin-styled-components) - Adds SSR support for Styled-Components
