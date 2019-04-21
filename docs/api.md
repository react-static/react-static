# API

React-Static is packed with awesome components, hooks, and functions to help you be productive. Exports located in the `react-static` package are meant to be used in the **browser** context, **in your application code** and in `browser.api.js`. Exports located in the `react-static/node` package are meant to be used in the **node** context like `static.config.js` and **api.node.js**)

- `react-static`
  - [Routes](#routes)
  - [useRouteData](#useroutedata)
  - [useSiteData](#usesitedata)
  - [Head](#head)
  - [Prefetch](#prefetch)
  - [prefetch](#prefetch-)
  - [addPrefetchExcludes](#addprefetchexcludes)
- `react-static/node`
  - [reloadClientData](#reloadClientData)
  - [makePageRoutes](#makePageRoutes)
  - [createSharedData](#createSharedData)

# `react-static`

The following functions are available via the `react-static` import. They are primarily for use in the browser environment, but are also available for use in `browser.api.js` plugin files, too.

## `Routes`

React Static handles all of your routing for you using `react-router` under the hood. All you need to do is import `Routes` and specify where you want to render them:

```javascript
// App.js
import { Root, Routes } from 'react-static'

export default () => (
  <Root>
    <Routes />
  </Root>
)
```

The routes that will be rendered are the **routes** returned by the `getRoutes` function of this config.

### Custom `Routes` Rendering

Occasionally, you may need to render the automatic `<Routes>` component in a custom way. The most common use-case is illustrated in the [animated-routes](https://github.com/nozzle/react-static/tree/master/examples/animated-routes) example transitions. To do this, utilize a render prop:

```javascript
import { Root, Routes } from 'react-static'

// This is the default renderer for `<Routes>`
const RenderRoutes =

export default () => (
  <Root>
    <Routes>
      {({ getComponentForPath }) => {
        // The pathname is used to retrieve the component for that path
        let Comp = getComponentForPath(window.location.href)
        // The component is rendered!
        return <Comp />
      }}
    </Routes>
  </Root>
)
```

**Render Props** - These special props are sent to your rendered component or render function:

- `getComponentForPath(pathname) => Component` - Takes a pathname and returns the component (if it exists) to render that path. Returns `false` if no component is found.

## `useRouteData`

Via suspense, the `useRouteData` hook asynchronously provides the results of a **routes's** `getData` function as defined in your `static.config.js`. If you are unable to use a hook in your component, you may also use the `RouteData` component or `withRouteData` HOC to access routeData, though we suggest refactoring to hooks for future releases.

**static.config.js**

```javascript
module.exports = {
  getRoutes: () => [
    {
      path: '/top-100-songs',
      getData: async () => ({
        songs: await SpotifyAPI.getTopSongs(100),
      }),
    },
  ],
}
```

**TopSongs.js**

```javascript
import { useRouteData } from 'react-static'

export default () => {
  const { songs } = useRouteData()
  return (
    <div>
      <h1>Top 100 Spotify Songs</h1>
      <ul>
        {songs.map(song => (
          <li key={song.id}>{song.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

## `useSiteData`

Via suspense, the `useSiteData` hook asynchronously provides the results of the `getSiteData` function as defined in your `static.config.js`.

If you are unable to use a hook in your component, you may also use the `SiteData` component or `withSiteData` HOC to access siteData, though we suggest refactoring to hooks for future releases.

**static.config.js**

```javascript
module.exports = {
  getSiteData: () => ({
    siteTitle: 'React Static',
    metaDescription: 'A progressive static-site framework for React',
  }),
}
```

**Home.js**

```javascript
import { useSiteData } from 'react-static'

export default () => {
  const { siteTitle, metaDescription } = useSiteData()

  return (
    <div>
      Welcome to {siteTitle}! {metaDescription}
    </div>
  )
}
```

Note: Make sure to wrap components using `useSiteData()` with React's `<Suspense fallback="..."></Suspense>`. More information on the subject is available [here](https://reactjs.org/docs/react-api.html#reactsuspense).

## `Head`

`Head` is a react component for managing tags in the document's `head`. Use it to update meta tags, title tags, etc.

- It can be used anywhere in your app.
- It can be used in multiple places at the same time.
- For more information, see the [React-Helmet library](https://github.com/nfl/react-helmet) that React Static uses to accomplish this.

### Example

```javascript
import { Head } from 'react-static'

export () => (
  <div>
    <Head>
      <meta charSet="UTF-8" />
      <title>This is my page title!</title>
    </Head>
    <div>
      My page content...
    </div>
  </div>
)
```

## `usePrefetch`

The `usePrefetch` hook binds the prefetching of a specific `path`'s assets to the visibility of an element. When the ref's element becomes visible in the viewport, the template and data required to render the route for the `path` will be prefetched.

This increases the chance that if the user then navigates to that route, they will not have to wait for the required data to load.

```javascript
import { useRef } from 'react'
import { usePrefetch } from 'react-static'

export default () => {
  // Use it to create a ref
  const myRef = usePrefetch('/blog')

  // or pass your own ref
  const myRef = useRef()
  usePrefetch('./blog', myRef)

  return (
    <Link to="/blog" ref={myRef}>
      Go to blog
    </Link>
  )
}
```

Note: It's critical that the `ref.current` value passed to `usePrefetch` resolves to an actual dom element. Otherwise an error will be thrown.

## `prefetch`

`prefetch` is an imperative version of the `usePrefetch` hook that you can use anywhere in your code.

Example:

```javascript
import { prefetch } from 'react-static'

const myFunc = async () => {
  const data = await prefetch('/blog')
  console.log('The preloaded data:', data)
}
```

## `addPrefetchExcludes`

`addPrefetchExcludes` allows you to register dynamic route exclusions at runtime, so as to not produce 404 errors when attempting to preload static data / templates that link to these routes.

- Arguments
  - `excludes: Array[string | RegExp]` - An array of strings and/or RegExp objects
    - `string` - Any routes **starting with this string** will be excluded
    - `RegExp` - Any routes **matching this regular expression** will be excluded
- Returns nothing

Example:

```javascript
import { addPrefetchExcludes } from 'react-static'

// Run this before your app code
addPrefetchExcludes(['dynamic', /admin/i])

// Your app code
// ...
```

# `react-static/node`

The following functions are available as exports from the `react-static/node` module. They are a separate import so that they may be used **primarily** in your static.config.js and node.api.js plugin files.

## `reloadClientData`

Intended for use in your `static.config.js` during development. When called it will rebuild all of your routes and routeData by calling `config.getRoutes()` again. Any new routes or data returned will be hot-reloaded into your running development application. Its main use cases are very applicable if your routes or routeData are changing constantly during development and you do not want to restart the dev server. You can use this method to reload when local files are changed, update at a set timing interval, or even subscribe to an event stream from an API or CMS.

- Arguments
  - `paths: Array` - The paths to reload (defaults to all).
- Returns a `Promise`

Example:

```javascript
// static.config.js
import { reloadClientData } from 'react-static/node'

// Reload Manually
reloadClientData()

// Reload when files change
import chokidar from 'chokidar'
chokidar.watch('./docs').on('all', () => reloadClientData())

// Reload from API or CMS event
YourFavoriteCMS.subscribe(reloadClientData)

// Reload your routes every 10 seconds
setInterval(reloadClientData, 10 * 1000)

// ETC!

export default {
  getRoutes: () => {
    // This will run each time `reloadClientData` is called
  },
}
```

## `makePageRoutes`

A utility function to aid in splitting an array of items into separate pages for use in your `static.config.js`

- Arguments
  - `options{}` - **Required**
    - `items: Array` - **Required** - The array of items to split into pages
    - `pageSize: Int` - **Required** - The number of items on each page
    - `route{}: Object` - **Required**
      - `path: String` - **Required** - The base path that all pages will share
      - `component: String` - The base component that all pages will share
    - `decorate: Function` - **Required**
      - Arguments:
        - `items: Array` - The items for the given page
        - `pageIndex: Int` - The page index for the given page
        - `totalPages: Int` - The total number of pages that were generated
      - Returns an `Object` that will decorate the base route. In most cases, this will probably include the `getData` and `children` keys, but can contain any route supported keys
    - `pageToken: String` - The string that will be used to prefix each page.
- Returns an array of routes objects

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

## `createSharedData`

Each route's `getData` function results in a separate data file for each route being stored as JSON next to the routes HTML on export. This covers the 90% use case for data splitting, but if you want even more control and want to optimize repeated data across routes, you can use this function to create shared data fragments for use in your routes.

These shared data fragments can be placed in any route's `sharedData` object. At runtime, the shared data will only be requested once per session and automatically merged into the route data, which you can consume normally through the `RouteData` or `withRouteData` component/HOC pair.

**Example**

Consider a large and heavy menu structure that is present only on the blog portion of your site. In this case, the menu data should only be loaded on the pages that use it, and only once per session (cached), instead of on every page individually. First we would use the `createSharedData` function and pass the data we want to share between our routes. Then in each route, we can pass the result of our `createSharedData` call as a prop to the route's `sharedData` property. The shared data props will then be stored, served and cached only once per session and merged into the result of the routes `getData` result at runtime!

```javascript
// static.config.js
import { createSharedData } from 'react-static/node'

export default {
  getRoutes: async () => {
    const blogMenu = createSharedData(getMyLargeAndHeavyMenu())
    return [
      {
        path: '/',
        component: 'src/containers/Home',
      },
      {
        path: '/blog',
        component: 'src/containers/Docs',
        sharedData: {
          blogMenu, // `blogMenu` will now be available to this route via
          // RouteData but will only be loaded once per session!
        },
      },
      {
        path: '/help',
        component: 'src/containers/Help',
        sharedData: {
          blogMenu, // `blogMenu` will now be available to this route via
          // RouteData but will only be loaded once per session!
        },
      },
    ]
  },
}
```
