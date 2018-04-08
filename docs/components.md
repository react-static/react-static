# Components

React-Static is packed with awesome components to help you be productive. Some are required for React-Static to work properly, others are available merely for your convenience:

React-Static Components:

* [Router](#router)
* [Routes](#routes-react-static-routes)
* [RouteData](#routedata)
* [SiteData](#sitedata)
* [Link](#link)
* [Loading](#loading)
* [Head](#head)
* [Prefetch](#prefetch)
* [PrefetchWhenSeen](#prefetchwhenseen)
* [Redirect](#redirect)

React-Router Components:

* [Prompt](#prompt)
* [Route](#route)
* [Switch](#switch)
* [matchPath](#matchpath)
* [withRouter](#withRouter)

# React-Static Components

### `Router`

The `Router` component is required and is what makes static exporting easy! It will **automatically** handle both static and browser environments and is recommended to always be the root component of a react-static app.

Props:

* `type: one of:`
  * `browser` - Uses `history.createBrowserHistory`
  * `hash` - Uses `history.createHashHistory`
  * `memory` - Uses `history.createMemoryHistory`
* `autoScrollToTop: Boolean` - Set this to `false` to disable the automatic scroll-to-top when the site path changes. Defaults to `true`.
* `autoScrollToHash: Boolean` - Set this to `false` to disable the automatic scroll-to-hash when the location hash changes. Defaults to `true`.
* `scrollToTopDuration: Int` - The duration of the automatic scroll-to-top animation that happens on path changes. Defaults to `0`
* `scrollToHashDuration: Int` - The duration of the automatic scroll-to-hash animation that happens on hash changes. Defaults to `800`
* `scrollToHashOffset: Int` - The vertical offset of the automatic scroll-to-hash animation that happens on path changes. Defaults to `0`
* `history: History` - An optional history object (most-often used for things like react-router-redux). Provides a helper method to subscribe to loading events. Note that this will override the `type` prop above.

Example:

```javascript
// App.js
import { Router } from 'react-static'

// For standard component routing:
export default () => <Router>...</Router>
```

### `Routes` (`react-static-routes`)

React Static handles all of your routing for you using `react-router` under the hood. All you need to do is import `react-static-routes` and specify where you want to render them:

```javascript
// App.js
import { Router } from 'react-static'
import Routes from 'react-static-routes'

export default () => (
  <Router>
    <Routes />
  </Router>
)
```

The routes that will be rendered will be the **routes** returned by the `getRoutes` function of this config.

**Important!** - `react-static-routes` is not a module you need to install. It is a dynamically generated file that is built with the rest of your site at dev and prod stages. If you install the `react-static-routes` node modules, you will be greeted with a notice to uninstall it and remove it from your dependencies :)

##### Custom `Routes` Rendering

Occasionally, you may need to render the automatic `<Routes>` component in a custom way. The most common use-case is illustrated in the [animated-routes](https://github.com/nozzle/react-static/tree/master/examples/animated-routes) example transitions. To do this, utilize one of these three render prop formats:

**Render Prop Formats**

```javascript
import { Router } from 'react-static'
import Routes from 'react-static-routes'

// This is the default renderer for `<Routes>`
const RenderRoutes = ({ getTemplateForPath }) => (
  // The default renderer uses a catch all route to recieve the pathname
  <Route
    path="*"
    render={props => {
      // The pathname is used to retrieve the component for that path
      let Comp = getComponentForPath(props.location.pathname)
      // The component is rendered!
      return <Comp key={props.location.pathname} {...props} />
    }}
  />
)

export default () => (
  <Router>
    // pass a component (class or SFC)
    <Routes component={RenderRoutes} />
    // or, pass a render function
    <Routes render={RenderRoutes} />
    // or, pass a function as a child
    <Routes>{RenderRoutes}</Routes>
  </Router>
)
```

**Render Props** - These special props are sent to your rendered component or render function

* `getTemplateForPath(pathname) => Component` - Takes a pathname and returns the component (if it exists) to render that path. Returns `false` if no template is found.
* `componentsByTemplateID{templateID: component}` - An object mapping templateIDs to Components
* `templateIDsByPath{path: templateID}` - A object mapping paths to their corresponding template ID.

### `RouteData`

`RouteData` and it's companion HOC `withRouteData` are what provide a component with the results of the currently matched route's `getData` function as defined in your `static.config.js`.

Props

* `component: ReactComponent`
* `render: Function`
* `children: Function`

Render Props

* Any props that you passed in it's corresponding route's `getData` method.
* `is404: boolean` - Will be set to `true` if the page requests results in a 404. This is useful for runtime 404's where the url of the page may remain what the user requested, but the route is not found.

Here is a an example show all of the different syntaxes you can use:

**static.config.js**

```javascript
module.exports = {
  getRoutes: () => [
    {
      path: '/top-100-songs',
      getData: async () => ({
        songs: await SpotifyAPI.getTopSongs(100)
      })
    }
  ]
}
```

**TopSongs.js**

```javascript
import { RouteData} from 'react-static'

// "render" prop syntax - Recommended
export default () => (
  <RouteData render={({ songs }) => (
    <div>
      <h1>Top 100 Spotify Songs</h1>
      <ul>
        {songs.map(song => <li key={song.id}>{song.title}</li>)}
      </ul>
    </div>
  )} />
)

// "children" prop syntax
export default () => (
  <RouteData>
    {({ songs }) => (
      <div>
        <h1>Top 100 Spotify Songs</h1>
        <ul>
          {songs.map(song => <li key={song.id}>{song.title}</li>)}
        </ul>
      </div>
    )}
  </RouteData>
)
```

```javascript
import { RouteData, withRouteData } from 'react-static'

// "component" syntax
const TopSongs = ({ songs }) => (
  <div>
    <h1>Top 100 Spotify Songs</h1>
    <ul>
      {songs.map(song => <li key={song.id}>{song.title}</li>)}
    </ul>
  </div>
)
export default () => (
  <RouteData component={TopSongs}
)

// HOC syntax
export default withRouteData(TopSongs)
```

### `SiteData`

`SiteData` and it's companion HOC `withSiteData` are what provide a component with the results of the `getSiteData` function as defined in your `static.config.js`.

**static.config.js**

```javascript
module.exports = {
  getSiteData: () => ({
    siteTitle: 'React Static',
    metaDescription: 'A progressive static-site framework for React'
  })
}
```

**Home.js**

```javascript
import { SiteData } from 'react-static'

// "render" prop syntax - Recommended
export default () => (
  <SiteData render={({ siteTitle, metaDescription }) => (
    <div>Welcome to {siteTitle}! {metaDescription}</div>
  )} />
)

// "children" prop syntax
export default () => (
  <SiteData>
    {({ siteTitle, metaDescription }) => (
      <div>Welcome to {siteTitle}! {metaDescription}</div>
    )}
  </SiteData>
)
```

```javascript
import { SiteData, withSiteData } from 'react-static'

// "component" syntax
const Welcome = ({ siteTitle, metaDescription }) => (
  <div>Welcome to {siteTitle}! {metaDescription}</div>
)
export default () => (
  <SiteData component={Welcome} />
)

// HOC syntax
export default withSiteData(Welcome)
```

### `Link`

To create links and navigate around your site, React Static provides you with a `<Link>` component that is a super-powered version of `react-router`'s' `Link` and `NavLink` components.

* Props
  * `to: String || Object` - The path or path object to the desired page.
  * `activeClassName: String` - The class to add to the link when it is active.
  * `activeStyle: String` - The style to add to the link when it is active.
  * `prefetch: Boolean || String` - Whether or not to automatically prefetch this link's page. Defaults to `true`. Can also be set to `data` or `template` to only preload that specific resource
  * `scrollToTop: Boolean` - Set this to `false` if you do not want the page to scroll-to-top automatically after navigation. Defaults to `true`
  * Any other prop set to the link will be forwarded to `<a />` or react-router's `<Link>` component, depending on their destination

Please familiarize yourself with [React-Router's Link and Navlink](https://reacttraining.com/react-router/web/api/) component to take full advantage of this component!

Usage:

```javascript
import React from 'react'
import { Link } from 'react-static'

<Link to='/blog/post/1'>
  Go to Blog Post 1
</Link>

<Link to={{
  pathname: '/blog/post/1', // or path: '/blog/post/1'
  search: '?sort=name',
  hash: '#the-hash',
  state: { fromDashboard: true }
}}>
  Go to Blog Post 1
</Link>

<Link to='/blog/post/1' prefetch={false}> // Don't prefetch this route
  Go to Blog Post 1
</Link>

<Link to='/blog/post/1' prefetch='data'> // Only prefetch the data for this route
  Go to Blog Post 1
</Link>

<Link to='/blog/post/1' prefetch='template'> // Only prefetch the template for this route
  Go to Blog Post 1
</Link>
```

### `Loading`

The loading component and it's companion HOC `withLoading` give you access to a `loading` prop, which will be true when react-static is waiting on assets to load (this won't happen often, if at all). Use these components to show a loading indicator if you'd like!

Example:

```javascript
import
import { Loading, withLoading } from 'react-static'

// "render" prop syntax - Recommended
export default () => (
  <Loading render={({ loading }) =>
    <div>{loading && <span>Loading...</span>}</div>
  )} />
)

// "children" prop syntax
export default () => (
  <Loading>
    {({ loading }) => (
      <div>{loading && <span>Loading...</span>}</div>
    )}
  </Loading>
)

//

// "component" syntax
const MyLoading = ({ loading }) => (
  <div>{loading && <span>Loading...</span>}</div>
)
export default () => (
  <Loading component={MyLoading}
)

// HOC syntax
export default withLoading(MyLoading)
```

### `Head`

`Head` is a react component for managing tags in the document's `head`. Use it to update meta tags, title tags, etc.

* It can be used anywhere in your app.
* It can be used in multiple places at the same time.
* For more information, see the [React-Helmet library](https://github.com/nfl/react-helmet) that React Static uses to accomplish this.

Example:

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

### `Prefetch`

Prefetch is a react component that accepts a `path` prop, and optional `only` prop and an optional single child to render. When this component is rendered, any data or template required to render the `path` will be prefetched. This ensures that if the user then navigates to that route , they will not have to wait for the required data to load.

Props:

* `path: String` **Required** - The path you want to prefetch.
* `type: String.oneOf(['data', 'template'])` - An optional string denoted whether to only load the `data` or `template` for the path.

Notes:

* If the path doesn't match a route, no data will be loaded.
* If the route has already been loaded in the session, the synchronous cache will be used instead.
* If multiple instances of the same `path` are prefetched at the same time, only a single request will be made for all instances.
* If used more often than needed, this component could result in fetching a lot of unused data. Be smart about what you prefetch.

Example:

```javascript
import { Prefetch, Link } from 'react-static'

// Standalone
<Prefetch path='/blog' />

// With children
<Prefetch path='/blog'>
  <Link to='/blog'>
    Go to blog
  </Link>
</Prefetch>
```

### `PrefetchWhenSeen`

PrefetchWhenSeen's api is identical to the `Prefetch` component, except that it will not fire until the component is visible in the viewport. If the user's browser doesn't support the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), it will work just like the Prefetch component.

Example:

```javascript
import { PrefetchWhenSeen, Link } from 'react-static'

// Standalone
<PrefetchWhenSeen path='/blog' />

// With children
<PrefetchWhenSeen path='/blog'>
  <Link to='/blog'>
    Go to blog
  </Link>
</PrefetchWhenSeen>
```

### `Redirect`

A proxy of the `Redirect` component that handles both development and runtime redirects.

* During development, uses the standard `react-router` `Redirect` component from [`react-router-dom`](https://reacttraining.com/react-router/web/api/)
* During production, uses an `http-equiv` meta tag resulting in an immediate redirect equivalent to a 301 redirect.

* Props

  * `to: string | object` - The destination url or react-router `to` object.
  * `delay: integer` - The delay in **seconds** for the `http-equiv` meta tag to activate.

* Renders `null`

# React Router Components

### `Prompt`

A direct export of the `Prompt` component from [`react-router-dom`](https://reacttraining.com/react-router/web/api/)

### `Route`

A direct export of the `Route` component from [`react-router-dom`](https://reacttraining.com/react-router/web/api/)

### `Switch`

A direct export of the `Switch` component from [`react-router-dom`](https://reacttraining.com/react-router/web/api/)

### `matchPath`

A direct export of the `matchPath` component from [`react-router-dom`](https://reacttraining.com/react-router/web/api/)

### `withRouter`

A direct export of the `withRouter` component from [`react-router-dom`](https://reacttraining.com/react-router/web/api/)
