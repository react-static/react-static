<div style="text-align:center;">
  <a href="https://github.com/react-tools/react-static" target="\_parent"><img src="https://github.com/react-tools/media/raw/master/logo-react-static.png" alt="React Static Logo" style="width:450px;"/></a>
</div>

# React Static
`react-static` is a powerful static-site framework for React apps.

<a href="https://travis-ci.org/react-tools/react-static" target="\_parent">
  <img alt="" src="https://travis-ci.org/react-tools/react-static.svg?branch=master" />
</a>
<a href="https://npmjs.com/package/react-static" target="\_parent">
  <img alt="" src="https://img.shields.io/npm/dm/react-static.svg" />
</a>
<a href="https://react-chat-signup.herokuapp.com/" target="\_parent">
  <img alt="" src="https://img.shields.io/badge/slack-react--chat-blue.svg" />
</a>
<a href="https://github.com/react-tools/react-static" target="\_parent">
  <img alt="" src="https://img.shields.io/github/stars/react-tools/react-static.svg?style=social&label=Star" />
</a>
<a href="https://twitter.com/tannerlinsley" target="\_parent">
  <img alt="" src="https://img.shields.io/twitter/follow/tannerlinsley.svg?style=social&label=Follow" />
</a>
<a href="https://cash.me/$tannerlinsley" target="\_parent">
  <img alt="" src="https://img.shields.io/badge/%24-Donate-brightgreen.svg" />
</a>

<br />
<br />

[![Sponsor](https://app.codesponsor.io/embed/zpmS8V9r31sBSCeVzP7Wm6Sr/react-tools/react-static.svg)](https://app.codesponsor.io/link/zpmS8V9r31sBSCeVzP7Wm6Sr/react-tools/react-static)

## Features
- Static route generation
- Asynchronous routes
- Sitemap & RSS generation
- Preloading
- Dev server

## The challenge
- Generally:
  - React apps don't play well with SEO & crawlers
  - Universal react apps are a lot of work and require a server. :(
- Other solutions usually:
  - Force you into very rigid CMS paradigms
  - Unnecessarily duplicate code across per-page bundles
  - Require that you use a routing system other than the ever popular react-router.

## The solution
- React-Static compiles to a good old standard react app. This means you can use whatever react technology you're already familiar with, even Redux!
- It generates static html files (and accompanying data dependency files) for every route you define
- It directly integrates with (and enhances) React-Router v4 for an amazingly fast and friendly user-experience.
- You can download, cache, import, query, and display your data however you'd like from any imaginable source including CMSaaS's, your favorite HTTP request library, databases, JSON files, etc.

## Quick Start
1. Clone the starter repo:
  ```bash
  $ git clone https://github.com/react-static/react-static-starter
  $ cd react-static-starter
  ```
2. Install dependencies
  ```bash
  $ yarn
  # or npm install
  ```
3. Run the dev server
  ```bash
  $ yarn start
  # or npm run start
  ```
4. Build for production
  ```bash
  $ yarn build
  # or npm run build
  ```

## Documentation
These docs are for version `1.x.x`

- Project Setup
- Configuration
- Components & Tools
  - `<Router />`
  - `getRouteProps(Component)`
  - `<Head />`
  - `<Prefetch url=''/>`
  - `prefetch(url)`

## Project Setup
For react-static to be amazing, it needs a few directories and files in the right places:

- Project Root
  - `static.config.js` - A javascript configuration file for react-static. More information on this below.
  - `public/` - Anything in this directory will be merged into your static `dist` directory. All files in this directory can be accessed at the root of your site.
  - `src/` - a place for all of your code
    - `index.js` - the main entry for your app. This file should export your app as its default export and also handle the rendering of the app when using the development server. This is a perfectly sufficient `index.js` file:
      ```javascript
      import React from 'react'
      import ReactDOM from 'react-dom'
      import { AppContainer } from 'react-hot-loader'

      // Your top level component
      import App from './App'

      // Export your top level component as JSX (for static rendering)
      export default <App />

      // Render your app
      if (typeof document !== 'undefined') {
        const render = () => {
          ReactDOM.render(
            <AppContainer>
              <App />
            </AppContainer>,
            document.getElementById('root'),
          )
        }

        // Render!
        render()

        // Hot Module Replacement
        if (module.hot) {
          module.hot.accept('./App', render)
        }
      }
      ```
      You may find you need more than this, especially if you are using something like Redux.

## Configuration
A `static.config.js` file is required at your project root to configure react-static. It must export an object with the following interface:
```javascript
module.exports = {
  // getRoutes is the only required method for the entire config.
  // It is an asynchronous function that should
  // resolve an array of route objects. It is also passed a `prod`
  // boolean indicating whether this is a production build or not.
  getRoutes: async ({prod}) => [{
    path: '/' // A route object only requires a `path` string
  }, {
    path: '/blog',
    children: [{ // It can also contained nested routes
      path: '/post-1',
      getProps: async ({route, prod}) => ({
        post: {...},
        otherProp: {...}
      })
      // getProps is a n asynchronous function that is passed the
      // resolved `route` object and a `prod` boolean indicating
      // whether this is a production build or not. This function
      // should resolve any data the route needs to render eg. blog
      // posts, API data, etc.
      nofollow: false, // used to generate the sitemap.xml
      noindex: false, // used to generate the sitemap.xml
    }],
  }],

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
  preRenderData: async JSX => {...},

  // An optional asynchronous function that is passed the statically
  // rendered HTML for each page and returns a javascript object
  // that will be made available to a custom Html component
  postRenderData: async staticHTML => {...},

  // An optional custom React component that renders the base
  // Html for every page, including the dev server. Must utilize the
  // `Html`, `Head`, `Body` and `children` for react-static to work. The optional
  // `data` prop refers to any data you potentially returned from
  // the `postRenderData` function.
  Html: ({ Html, Head, Body, children, data }) => (
    <Html lang="en-US">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>{children}</Body>
    </Html>
  ),
}
```

## Components & Tools

### `<Router />`
The `Router` component is react-static's special version of React-Router's `Router` component. It is to be used in conjunction with other React Router components. By using react-static's `Router` at the base of your app, you won't have to worry about switching between static routing and browser routing. It accepts a `history` object like you're used to (to support things like react-router-redux), and also provides a helper method to subscribe to loading events.

Example:
```javascript
import { Router } from 'react-static'
import { Switch, Route } from 'react-router'

import Home from './containers/Home'
import About from './containers/About'
import Blog from './containers/Blog'

export default () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/blog" component={Blog} />
      <Redirect to="/" />
    </Switch>
  </Router>
)
```

To Subscribe to Router loading events, use `Router.subscribe(callback)`.
The subscribe callback will fire whenever the loading state changes.

Example:
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

### `<Prefetch url=''/>`
Prefetch is a react component that accespts a `url` prop and an optional single child to render. When this component is rendered, any data resolved by the `url`'s corresponding `getProps` function will be prefetched. This ensures that if the user then navigates to that route in your site, they do not have to wait for the required data to load.

- If the url doesn't match a route, no data will be loaded.
- If the route has already been loaded in the session, the cache will be used instead.
- If multiple instances of the same `url` are prefetched at the same time, only a single request will be made for all instances.
- If used more often than needed, this component could result in fetching a lot of unused data. Be smart about what you prefetch.

Example:
```javascript
import { Prefetch } from 'react-static'
import { Link } from 'react-router-dom'

// Standalone
<Prefetch url='/blog' />

// With children
<Prefetch url='/blog'>
  <Link to='/blog'>
    Go to blog
  </Prefetch>
</Prefetch>
```

### `prefetch(url)`
`prefetch` is an imperative version of the `Prefetch` component that you can use anywhere in your code.

Example:
```javascript
import { prefetch } from 'react-static'

const myFunc = async => {  
  const data = await prefetch('/blog')
  console.log('The preloaded data:', data)
}
```
