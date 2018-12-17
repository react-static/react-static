# Components

React-Static is packed with awesome components to help you be productive. Some are required for React-Static to work properly, others are available merely for your convenience:

- [Routes](#routes)
- [RouteData](#routedata)
- [SiteData](#sitedata)
- [Head](#head)
- [Prefetch](#prefetch)

### `Routes`

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

##### Custom `Routes` Rendering

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

**Render Props** - These special props are sent to your rendered component or render function

- `getComponentForPath(pathname) => Component` - Takes a pathname and returns the component (if it exists) to render that path. Returns `false` if no component is found.

### `RouteData`

`RouteData` and it's companion HOC `withRouteData` are what provide a component with the results of the currently matched route's `getData` function as defined in your `static.config.js`.

Props

- `component: ReactComponent`
- `render: Function`
- `children: Function`

Render Props

- Any props that you passed in it's corresponding route's `getData` method.
- `is404: boolean` - Will be set to `true` if the page requests results in a 404. This is useful for runtime 404's where the url of the page may remain what the user requested, but the route is not found.

Here is a an example show all of the different syntaxes you can use:

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
import { RouteData } from 'react-static'

export default () => (
  <RouteData>
    {({ songs }) => (
      <div>
        <h1>Top 100 Spotify Songs</h1>
        <ul>
          {songs.map(song => (
            <li key={song.id}>{song.title}</li>
          ))}
        </ul>
      </div>
    )}
  </RouteData>
)
```

```javascript
import { RouteData, withRouteData } from 'react-static'

export default withRouteData(({ songs }) => (
  <div>
    <h1>Top 100 Spotify Songs</h1>
    <ul>
      {songs.map(song => (
        <li key={song.id}>{song.title}</li>
      ))}
    </ul>
  </div>
))
```

### `SiteData`

`SiteData` and it's companion HOC `withSiteData` are what provide a component with the results of the `getSiteData` function as defined in your `static.config.js`.

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
import { SiteData } from 'react-static'

export default () => (
  <SiteData>
    {({ siteTitle, metaDescription }) => (
      <div>
        Welcome to {siteTitle}! {metaDescription}
      </div>
    )}
  </SiteData>
)
```

```javascript
import { SiteData, withSiteData } from 'react-static'

export default withSiteData(({ siteTitle, metaDescription }) => (
  <div>
    Welcome to {siteTitle}! {metaDescription}
  </div>
))
```

### `Link`

To create links and navigate around your site, React Static provides you with a `<Link>` component that is a super-powered version of `react-router`'s' `Link` and `NavLink` components.

- Props
  - `to: String || Object` - The path or path object to the desired page.
  - `activeClassName: String` - The class to add to the link when it is active.
  - `activeStyle: String` - The style to add to the link when it is active.
  - `prefetch: Boolean || String` - Whether or not to automatically prefetch this link's page. Defaults to `true`. Can also be set to `data` or `template` to only preload that specific resource
  - `scrollToTop: Boolean` - Set this to `false` if you do not want the page to scroll-to-top automatically after navigation. Defaults to `true`
  - Any other prop set to the link will be forwarded to `<a />` or react-router's `<Link>` component, depending on their destination

Please familiarize yourself with [React-Router's Link and Navlink](https://reacttraining.com/react-router/web/api/) component to take full advantage of this component!

Usage:

```javascript
import React from 'react'
import { Link } from '@reach/router'

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

### `Head`

`Head` is a react component for managing tags in the document's `head`. Use it to update meta tags, title tags, etc.

- It can be used anywhere in your app.
- It can be used in multiple places at the same time.
- For more information, see the [React-Helmet library](https://github.com/nfl/react-helmet) that React Static uses to accomplish this.

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

Prefetch is a react component that can prefetch the assets for a given route when visibly rendered in the viewport. When it's content or element are visible in the viewport, the template and data required to render the path in the `path` prop will be prefetched. This increases the chance that if the user then navigates to that route, they will not have to wait for the required data to load. You can also force the prefetch to happen even if the element is outside the viewport via the `force` prop.

Props:

- `path: String` **Required** - The path you want to prefetch.
- `force: Boolean` - Force the prefetch even if the element is not visible in the viewport

Notes:

- If the path doesn't match a valid static route, nothing will happen.
- If the route has already been loaded in the session, nothing will happen.
- If multiple instances of the same `path` are prefetched at the same time, only a single request will be made for all instances.
- If abused, this component could result in fetching a lot of unused data. Be smart about what you prefetch.

Example:

```javascript
import { Prefetch } from 'react-static'
import { Link } from '@reach/router'

// Standalone
<Prefetch path='/blog' />

// With children
<Prefetch path='/blog'>
  <Link to='/blog'>
    Go to blog
  </Link>
</Prefetch>

// With a custom refHandler
<Prefetch path='/blog'>
  {({ handleRef }) => (
    <MyComponent ref={handleRef}/>
  )}
</Prefetch>
```
