<div style="text-align:center;">
  <a href="https://github.com/nozzle/react-static" target="\_parent"><img src="https://github.com/nozzle/react-static/raw/master/media/logo.png" alt="React Static Logo" style="width:450px;"/></a>
</div>

<br />
<br />

<a href="https://travis-ci.org/nozzle/react-static" target="\_parent">
<img alt="" src="https://travis-ci.org/nozzle/react-static.svg?branch=master" />
</a>
<a href="https://npmjs.com/package/react-static" target="\_parent">
<img alt="" src="https://img.shields.io/npm/dm/react-static.svg" />
</a>
<a href="https://react-chat-signup.herokuapp.com/" target="\_parent">
<img alt="" src="https://img.shields.io/badge/slack-react--chat-blue.svg" />
</a>
<a href="https://github.com/nozzle/react-static" target="\_parent">
<img alt="" src="https://img.shields.io/github/stars/nozzle/react-static.svg?style=social&label=Star" />
</a>
<a href="https://twitter.com/nozzleio" target="\_parent">
<img alt="" src="https://img.shields.io/twitter/follow/nozzleio.svg?style=social&label=Follow" />
</a>
<a href="https://www.producthunt.com/posts/react-static" target="\_parent">
<img alt="" src="https://img.shields.io/badge/product-hunt-orange.svg" />
</a>

<br />
<br />

# React Static
A **progressive static-site framework** for React.

[**Read the introduction article on Medium**](https://medium.com/@tannerlinsley/%EF%B8%8F-introducing-react-static-a-progressive-static-site-framework-for-react-3470d2a51ebc)

At [Nozzle.io](https://nozzle.io), we take **SEO, site performance, and user/developer experience** very seriously. We’ve launched many sites using different static site tools that claim to solve these goals, but we have yet to find one that satisfies our requirements completely. React-Static is the framework we carefully designed to meet those standards and help everyone build next generation, high-performance websites for the internet.

## Features
- React. Enough said.
- Blazing fast performance.
- Data Agnostic. Feed your site data from anywhere, **however you want**.
- Built for **SEO**, by SEO professionals
- React-first developer experience
- Painless project setup & migration
- Supports 99.9% of the React ecosystem. Including CSS-in-JS libraries, custom Query layers like GraphQL, and even Redux!
- Aggressive and flexible reloading.

## Introduction Video

<a href="https://www.youtube.com/watch?v=OqbJ5swVpDQ" align="center">
  <img src="https://github.com/nozzle/react-static/raw/master/media/videoLink.png" width="600"/>
</a>

<br />
<br />

<a target='\_blank' rel='nofollow' href='https://app.codesponsor.io/link/zpmS8V9r31sBSCeVzP7Wm6Sr/nozzle/react-static'>
  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/zpmS8V9r31sBSCeVzP7Wm6Sr/nozzle/react-static.svg' />
</a>

## Documentation
These docs are for version `1.x.x`.

- [Quick Start](#quick-start)
- [Installation](#installation)
- [CLI](#cli)
  - [`react-static create`](#react-static-create-project-name)
  - [`react-static start`](#react-static-start)
  - [`react-static build`](#react-static-build)
- [Project Setup](#project-setup)
- [Configuration (`static.config.js`)](#configuration-staticconfigjs)
- [Components & Tools](#components--tools)
  - [`<Router />`](#router-)
  - [Automatic Routing with `<Routes />`](#automatic-routing-with--routes-)
  - [Custom Routing](#custom-routing)
  - [React-Router Components](#react-router-components)
  - [`getRouteProps(Component)`](#getroutepropscomponent)
  - [`<Head />`](#head-)
  - [`<Prefetch path=''/>`](#prefetch-path)
  - [`prefetch(path)`](#prefetchpath)

## Quick Start
```bash
$ yarn global add react-static
# or npm install -g react-static

$ react-static create my-static-site
```

## Installation

#### New Projects
To start a new project, install `react-static` globally:
```bash
$ yarn global add react-static
# or
$ npm install react-static -g
```

To create a new project:
```bash
$ react-static create
```

#### Existing Projects
To migrate a project, install `react-static` locally:
```bash
$ yarn add react-static
# or
$ npm install react-static --save
```
For more details on migrating an existing app, see the [Project Setup](#project-setup) section.


## CLI

#### `react-static create`
Creates a new react-static project.
- Prompts for a project name/location
- Prompts to select one of the templates located in this repository's `examples/` directory.

#### `react-static start`
Starts the development server.

#### `react-static build`
Builds your site for production. Outputs to a `dist` directory in your project.

## Project Setup
`react-static` needs a few directories and files in the right places to function properly:

- `static.config.js` - A javascript configuration file for react-static. [Click here to see an example](https://github.com/nozzle/react-static/blob/master/examples/basic/static.config.js)
- `public/` - Anything in this directory will be merged into your static `dist` directory. All files in this directory can be accessed at the root of your site.
- `src/` - a place for all of your code
  - `index.js` - the main entry for your app. This file should export your app as its default export and also handle the rendering of the app when using the development server. [Click here to see an example](https://github.com/nozzle/react-static/blob/master/examples/basic/src/index.js).

## Configuration (`static.config.js`)
A `static.config.js` file is required at your project root to configure react-static. It must export a **default** object with the following interface:
```javascript
export default {
  // getRoutes is the only required method for the entire config.
  // It is an asynchronous function that should
  // resolve an array of route objects. It is also passed a `dev`
  // boolean indicating whether this is a production build or not.
  getRoutes: async ({dev}) => [{
    path: '/' // A route object requires a `path` string
    component: 'src/containers/Home', // specify the react component that will render this route
  }, {
    path: '/blog',
    component: 'src/containers/Blog',
    children: [{ // It can also contained nested routes
      path: '/post-1',
      component: 'src/containers/Post',
      getProps: async ({route, dev}) => ({
        post: {...},
        otherProp: {...}
      })
      // getProps is a n asynchronous function that is passed the
      // resolved `route` object and a `dev` boolean indicating
      // whether this is a production build or not. This function
      // should resolve any data the route needs to render eg. blog
      // posts, API data, etc.

      noindex: false, // Optional. Defaults to `false`. If `true`, will exclude this route from the sitemap XML
      permalink: '', // Optional. If not set, will default to (siteRoot + path)
      lastModified: '', // Optional. String('YYYY-MM-DD')
      priority: 0.5 // Optional.
    }, {
      // If using automatica routing, you can specify a component to render the
      // 404 page by creating a route with `is404` set to `true` and defining a
      // `component` to use.
      is404: true,
      component: 'src/containers/NotFound'
    }],
  }],

  // getSiteProps is very similar to a route's getProps, but is made available
  // to the entire site via the `getSiteProps` HOC
  // IMPORTANT: Any data you return here, although loaded once per session, will
  // be embedded in every page that is exported on your site. So tread lightly ;)
  getSiteProps: async ({dev}) => ({...})

  siteRoot: 'https://mysite.com', // Optional, but necessary for the sitemap.xml

  // An optional custom React component that renders the base
  // Html for every page, including the dev server. Must utilize the
  // `Html`, `Head`, `Body` and `children` for react-static to work. The optional
  // `siteProps` prop will contain any data returned by `getSiteProps` in your config
  // and `staticMeta` prop refers to any data you potentially returned from
  // the `preRenderMeta` and `postRenderMeta` function.
  Html: ({ Html, Head, Body, children, siteProps, staticMeta }) => (
    <Html lang="en-US">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>{children}</Body>
    </Html>
  ),

  // An optional callback, used to modify the webpack config for both dev
  // and production. The function you provide will be passed an instance of
  // webpack-configurator (see https://github.com/lewie9021/webpack-configurator
  // for more information), and an object containing a `dev` boolean, denoting
  // whether you are in development or production mode.
  webpack: (webpackConfigurator, { dev }) => {...},

  // The entry location for your app, defaulting to `./src/index.js`
  // This file must export the JSX of your app as the default export,
  // eg. `default export <MyApp />`.
  // It also handles the rendering of your app while in development mode
  // (including hot reloading). For a brief example, see the Project
  // Setup section above.
  entry: './src/index.js',

  // An optional asynchronous function that is pass the JSX component
  // BEFORE it is rendered to a static string. It can return a javascript
  // object that will be made available to a custom Html component
  preRenderMeta: async JSX => {...},

  // An optional asynchronous function that is passed the statically
  // rendered HTML for each page and returns a javascript object
  // that will be made available to a custom Html component
  postRenderMeta: async staticHTML => {...},

  // Optional. Set to true to serve the bundle analyzer on a production build.
  bundleAnalyzer: false,
}
```

## Components & Tools

### `<Router />`
The `Router` component is required, and provides the underlying React-Router context to its children. It is often the root component of a react-static app.

`Router` automatically handles rendering both static and browser environments. It optionally accepts a `history` object (most-often used for things like react-router-redux), and also provides a helper method to subscribe to loading events.

Example:
```javascript
import { Router } from 'react-static'
import { Switch, Routes, Route } from 'react-router'

import Home from './containers/Home'
import About from './containers/About'
import Blog from './containers/Blog'
import NotFound from './containers/NotFound'

// For standard component routing:
export default () => (
  <Router>
    <Routes />
  </Router>
)

// For custom routing
export default () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/blog" component={Blog} />
      <Route component={NotFound} />
    </Switch>
  </Router>
)
```

To Subscribe to Router loading events, use `Router.subscribe(callback)`.
This can be extremely useful when using a library like `nprogress` to show a loading status.
The subscribe callback will fire whenever the loading state changes:
```javascript
import { Router } from 'react-static'

Router.subscribe(loading => {
  if (loading) {
    console.log('A page is loading!')
  } else {
    console.log('A page is done loading!')
  }
})
```

### Automatic Routing with  `<Routes />`
`react-static` comes built in with a component router that automatically handles all of your routing for you. This is done by first, specifying a `component` path (relative to the root of your project) that should be used to render a route in your `static.config.js`

`static.config.js` example:
```javascript
export default {
  getRoutes: async () => [{
    path: '/'
    component: 'src/containers/Home',
  }]
}
```

When your site is built (both in dev and production mode), the special `<Routes />` component will automatically handle all of your routing based on the paths you define in your `static.config.js`

`App.js` example:
```javascript
import { Router } from 'react-static'
import Routes from 'react-static-routes' // A special `react-static-routes` import is used for Automatic Routing

export default () => (
  <Router>
    <Routes /> // Your <Routes /> can be nested anywhere inside the <Router /> component.
  </Router>
)
```

To see a working example, refer to our [`basic` example template](https://github.com/nozzle/react-static/blob/master/examples/basic)

### Custom Routing
If you end up needing more control than `<Routes />` offers, have no fear. `react-static` provides you with all of the custom routing components you are normally used to with `react-router`:

**NOTE: These components are available via `react-static`. There is no need to import them via `react-router`**

- `<Route>`
- `<Switch>`
- `<Redirect>`
- `<Prompt>`

To build your own custom routing, simply remove (or don't use)  the `<Routes />` component in your app, and use the above components instead.

To see a working example, refer to our [`custom-routing` example template](https://github.com/nozzle/react-static/blob/master/examples/custom-routing)

To learn more about how `react-router` components work, visit [React-Router's Documentation](https://reacttraining.com/react-router/web/guides/philosophy)

### 404 Handling
Making a 404 page in `react-static` is extremely simple for both automatic and custom routing configurations.

##### Automatic Routing
To define a 404 page using automatic routing, define a route with `is404` set to `true` and a `component` path to render the 404 page. Note that no `path` property is needed for a 404 route. At both build time and run time, the rendered result of this `component` will be used for any routes that are not found.

##### Custom Routing
When using custom routing, there are 2 types of 404 pages:
- **Static 404 page** - At build time, `react-static` will automatically attempt to render a `/404` path in your app. Whatever renders as a result of this path will be exported to `404.html` and be used for pages not found on **first load**.
- **Dynamic 404 pages** - For `<Link />`s and in-app navigations that don't match your custom routing structure, you must handle those sitations yourself. The best (and most thorough) way to handle this scenario is to make sure you use a catch all `<Route component={SomeComponent} />` at the end of **all** `<Switch>` statements in your app. Not all of them must point to the same 404 component, since you may want to show a custom 404 page for a post that isn't found, versus a page that isn't found.

### `<Link />` and `<NavLink />`
`react-static` also gives you access to `react-router`'s `<Link />` and `<NavLink />` components. Use these component to allow your users to navigate around your site!

Usage:
```javascript
<Link to={'/blog/post/1'}>
  Go to Blog Post 1
</Link>
```

Example:
```javascript
import React from 'react'
import { Router, Link } from 'react-static'
//
import Routes from 'react-static-routes'

export default () => (
  <Router>
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about/">About</Link>
        <Link to="/blog/">Blog</Link>
      </nav>
      <Routes />
    </div>
  </Router>
)
```

For more information about `<Link />` and `<NavLink />`, see [React-Router's Documentation](https://reacttraining.com/react-router/web/guides/philosophy)

### Other Routing Utilities
For your convenience, `react-static` also exports the following utilities normally exported by `react-router`.

- `history`
- `matchPath`
- `withRouter`

### `getRouteProps(Component)`
`getRouteProps` is an HOC that provides a component with the results of the current route's `getProps` function as defined in your `static.config.js`. Here is a simple example:

**static.config.js**
```javascript
module.exports = {
  getRoutes: () => [{
    path: '/top-100-songs',
    getProps: async () => ({
      songs: await SpotifyAPI.getTopSongs(100)
    })
  }]
}
```

**App.js**
```javascript

const TopHundredSongsPage = getRouteProps(({songs}) =>
  <ul>
    {songs.map(song => <li key={song}>{song}</li>)}
  </ul>
)

...
<Route exact path="/top-100-songs" component={TopHundredSongsPage} />
...
```

### `getSiteProps(Component)`
`getSiteProps` is an HOC that provides a component with the results of the `getSiteProps` function as defined in your `static.config.js`. Here is a simple example:

**static.config.js**
```javascript
module.exports = {
  getSiteProps: () => ({
    title: 'React Static',
    metaDescription: 'A progressive static-site framework for React'
  })
}
```

**App.js**
```javascript

const AnyComponent = getSiteProps(({ title, metaDescription }) =>
  <div>
    Welcome to {title}! I am a {metaDescription} :)
  </div>
)

```

### `<Head />`
`Head` is a react component for managing tags in the document's `head`. Use it to update meta tags, title tags, etc.

- It can be used anywhere in your app.
- If called more than once on a route, it will append and merge them together (and overwrite some tags with the latest tag used).
- For more information, see the [React-Helmet library](https://github.com/nfl/react-helmet) that `react-static` uses to accomplish this.

Example:
```javascript
import { Head } from 'react-static'

export () => (
  <div>
    <Head>
      <title>This is my page title!</title>
    </Head>
    <div>
      My page content...
    </div>
  </div>
)
```

### `<Prefetch path=''/>`
Prefetch is a react component that accepts a `path` prop and an optional single child to render. When this component is rendered, any data resolved by the `path`'s corresponding `getProps` function will be prefetched. This ensures that if the user then navigates to that route in your site, they do not have to wait for the required data to load.

- If the path doesn't match a route, no data will be loaded.
- If the route has already been loaded in the session, the cache will be used instead.
- If multiple instances of the same `path` are prefetched at the same time, only a single request will be made for all instances.
- If used more often than needed, this component could result in fetching a lot of unused data. Be smart about what you prefetch.

Example:
```javascript
import { Prefetch } from 'react-static'
import { Link } from 'react-router-dom'

// Standalone
<Prefetch path='/blog' />

// With children
<Prefetch path='/blog'>
  <Link to='/blog'>
    Go to blog
  </Prefetch>
</Prefetch>
```

### `prefetch(path)`
`prefetch` is an imperative version of the `Prefetch` component that you can use anywhere in your code.

Example:
```javascript
import { prefetch } from 'react-static'

const myFunc = async => {  
  const data = await prefetch('/blog')
  console.log('The preloaded data:', data)
}
```

## Contributing
We are always looking for people to help us grow `react-static`'s capabilities and examples. If you have an issue, feature request, or pull request, let us know!

## License

React Static uses the MIT license. For mor information on this license, [click here](https://github.com/nozzle/react-static/blob/master/LICENSE).
