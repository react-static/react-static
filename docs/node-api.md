# Node API

For those node-heads out there, React Static provides a Node API for full programmatic control!

The following exports are available via the `react-static/node` module:

* [create](#create)
* [start](#start)
* [build](#build)
* [rebuildRoutes](#rebuildroutes)

We recommended using the latest ES6 import syntax:

```javascript
import { create, start, build } from 'react-static/node'
```

### `create`

Creates a new react-static project.

* Arguments
  * `name: string` - The name of your new project (relative to the current-working directory), or the full path to the new directory you wish to create
  * `location: string`
    * The name of the template in the `examples` directory
    * The full URL of a public git repository
    * The full path to a local directory
  * `silent: boolean: true` - Set to true to show standard logging as you would normally see in the CLI
* Returns a `Promise`

### `start`

Starts the development server.

* Arguments
  * `config: object || string` - The config object to use, or the path of the `static.config.js` file you wish to use.
  * `silent: boolean: true` - Set to true to show standard logging as you would normally see in the CLI
* Returns a `Promise` that will **never resolve**. The process must be exited by the user to stop the server.

### `build`

Builds your site for production. Outputs to a `dist` directory in your project.

* Arguments
  * `config: object || string` - The config object to use, or the path of the `static.config.js` file you wish to use.
  * `staging` - When `true`, no siteRoot replacement or absolute URL optimizations are performed, allowing a production build of your site to function on localhost more easily. Use this argument to test a production build locally.
  * `debug` - When `true`, your build will **not** be `uglified` allowing you to debug production errors (as long as they are unrelated to minification or uglification)
  * `silent: boolean: true` - Set to true to show standard logging as you would normally see in the CLI
* Returns a `Promise`

### `rebuildRoutes`

Inteded for use in your `static.config.js` during development. When called it will rebuild all of your your routes and routeData by calling `config.getRoutes()` again. Any new routes or data returned will be hot-reloaded into your running development application. Its main use cases are very applicable if your routes or routeData are changing constantly during development and you do not want to restart the dev server. You can use this method to reload when local files are changed, update at a set timing interval, or even subscribe to an event stream from an API or CMS.

Example:

```javascript
// static.config.js
import { reloadRoutes } from 'react-static/node'

// Reload Manually
reloadRoutes()

// Reload when files change
import chokidar from 'chokidar'
chokidar.watch('./docs').on('all', () => reloadRoutes())

// Reload from API or CMS event
YourFavoriteCMS.subscribe(reloadRoutes)

// Reload your routes every 10 seconds
setInterval(reloadRoutes, 10 * 1000)

// ETC!

export default {
  getRoutes: () => {
    // This will run each time `reloadRoutes` is called
  }
}
```
