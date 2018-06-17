# Node API

For those node-heads out there, React Static provides a Node API for full programmatic control!

The following exports are available via the `react-static/node` module:

* [create](#create)
* [start](#start)
* [build](#build)
* [rebuildRoutes](#rebuildroutes)
* [makePageRoutes](#makePageRoutes)

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

Intended for use in your `static.config.js` during development. When called it will rebuild all of your your routes and routeData by calling `config.getRoutes()` again. Any new routes or data returned will be hot-reloaded into your running development application. Its main use cases are very applicable if your routes or routeData are changing constantly during development and you do not want to restart the dev server. You can use this method to reload when local files are changed, update at a set timing interval, or even subscribe to an event stream from an API or CMS.

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

### `makePageRoutes`

A utility function to aid in splitting an array of items into separate pages for use in your `static.config.js`

* Arguments
  * `options{}` - **Required**
    * `items: Array` - **Required** - The array of items to split into pages
    * `pageSize: Int` - **Required** - The number of items on each page
    * `route{}: Object` - **Required**
      * `path: String` - **Required** - The base path that all pages will share
      * `component: String` - The base component that all pages will share
    * `decorate: Function` - **Required**
      * Arguments:
        * `items: Array` - The items for the given page
        * `pageIndex: Int` - The page index for the given page
        * `totalPages: Int` - The total number of pages that were generated
      * Returns an `Object` that will decorate the base route. In most cases, this will probably include the `getData` and `children` keys, but can contain any route supported keys
    * `pageToken: String` - The string that will be used to prefix each page.
* Returns an array of routes objects

Example:

```javascript
// static.config.js
import { makePageRoutes } from 'react-static/node'

export default {
  getRoutes: () => {
    const posts = [...]

    return [
      ...makePageRoutes({
        items: posts, // Use the posts array as items
        pageSize: 5, // Use 5 items per page
        pageToken: 'page', // use page for the prefix, eg. blog/page/3
        route: {
          // Use this route as the base route
          path: 'blog',
          component: 'src/containers/Blog',
        },
        decorate: (items, pageIndex, totalPages) => ({
          // For each page, supply the posts, page and totalPages
          getData: () => ({
            posts: items,
            currentPage: pageIndex,
            totalPages,
          }),
          // Make the routes for each blog post
          children: items.map(post => ({
            path: `/blog/post/${post.id}`,
            component: 'src/containers/Post',
            getData: () => ({
              post,
            }),
          })),
        }),
      }),
    ]
  }
}
```
