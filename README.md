<div style="text-align:center;">
  <a href="https://github.com/nozzle/react-static" target="\_parent"><img src="https://github.com/react-tools/media/raw/master/logo-react-static.png" alt="React Static Logo" style="width:450px;"/></a>
</div>

# React Static
`react-static` is a powerful static-site framework for React.

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
<a href="https://twitter.com/tannerlinsley" target="\_parent">
  <img alt="" src="https://img.shields.io/twitter/follow/tannerlinsley.svg?style=social&label=Follow" />
</a>
<a href="https://cash.me/$tannerlinsley" target="\_parent">
  <img alt="" src="https://img.shields.io/badge/%24-Donate-brightgreen.svg" />
</a>

<br />
<br />

<a target='\_blank' rel='nofollow' href='https://app.codesponsor.io/link/zpmS8V9r31sBSCeVzP7Wm6Sr/nozzle/react-static'>
  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/zpmS8V9r31sBSCeVzP7Wm6Sr/nozzle/react-static.svg' />
</a>

## Features
- Static route generation
- Sitemap & RSS generation
- Progressive content loading
- Powerful Preloading
- Built-in dev server
- Ready-to-use Babel & Webpack

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
```bash
$ yarn global add react-static
# or npm install -g react-static

$ react-static create my-static-site
```

## Documentation
These docs are for version `1.x.x`

- [Installation](#installation)
- [CLI](#cli)
  - [`react-static create`](#react-static-create-project-name)
  - [`react-static start`](#react-static-start)
  - [`react-static build`](#react-static-build)
- [Project Setup](#project-setup)
- [Configuration (`static.config.js`)](configuration-staticconfigjs)
- [Components & Tools](#components--tools)
  - [`<Router />`](#router-)
  - [`getRouteProps(Component)`](#getroutepropscomponent)
  - [`<Head />`](#head-)
  - [`<Prefetch url=''/>`](#prefetch-url)
  - [`prefetch(url)`](#prefetchurl)

## Installation
```bash
$ yarn add react-static
# or
$ npm install react-static --save
```

## CLI

#### `react-static create [project-name]`
Creates a new react-static project at the directory name your provide using the template project located in this repository's `demo/` directory.

#### `react-static start`
Starts the development server.

#### `react-static build`
Builds your site for production. Outputs to a `dist` directory in your project.

## Project Setup
`react-static` needs a few directories and files in the right places to function properly:

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
      const render = Comp => {
        ReactDOM.render(
          <AppContainer>
            <Comp />
          </AppContainer>,
          document.getElementById('root'),
        )
      }

      // Render!
      render(App)

      // Hot Module Replacement
      if (module.hot) {
        module.hot.accept('./App', () => {
          render(require('./App').default)
        })
      }
    }

    ```

## Configuration (`static.config.js`)
A `static.config.js` file is required at your project root to configure react-static. It must export a **default** object with the following interface:
```javascript
export default {
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

      noindex: false, // Optional. Defaults to `false`. If `true`, will exclude this route from the sitemap XML
      permalink: '', // Optional. If not set, will default to (siteRoot + path)
      changeFreq: 60000, // Optional.
      lastModified: '', // Optional. String('YYYY-MM-DD')
      priority: 0.5 // Optional.
    }],
  }],

  // An optional custom React component that renders the base
  // Html for every page, including the dev server. Must utilize the
  // `Html`, `Head`, `Body` and `children` for react-static to work. The optional
  // `staticMeta` prop refers to any data you potentially returned from
  // the `preRenderMeta` and `postRenderMeta` function.
  Html: ({ Html, Head, Body, children, staticMeta }) => (
    <Html lang="en-US">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>{children}</Body>
    </Html>
  ),

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
}
```

## Components & Tools

#### `<Router />`
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

#### `getRouteProps(Component)`
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

#### `<Head />`
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

#### `<Prefetch url=''/>`
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

#### `prefetch(url)`
`prefetch` is an imperative version of the `Prefetch` component that you can use anywhere in your code.

Example:
```javascript
import { prefetch } from 'react-static'

const myFunc = async => {  
  const data = await prefetch('/blog')
  console.log('The preloaded data:', data)
}
```

## Tips and Tricks

#### Using `styled-components`
To use `styled-components`, you'll need to define a custom `Html` component in your `static.config.js` that can render `styled-components` styles on the server. This should suffice:
```javascript
import React, { Component } from 'react'
import { ServerStyleSheet } from 'styled-components'

export default class CustomHtml extends Component {
  render () {
    const { Html, Head, Body, children } = this.props

    const sheet = new ServerStyleSheet()
    const newChildren = sheet.collectStyles(children)
    const styleTags = sheet.getStyleElement()

    return (
      <Html>
        <Head>
          {styleTags}
        </Head>
        <Body>{newChildren}</Body>
      </Html>
    )
  }
}
```

#### Using `glamorous`
To use `glamorous`, you'll need to:
1. define a custom `postRenderMeta` callback in your `static.config.js` to retrieve the glamorous styles from a every page:
  ```javascript
  module.exports = {
    ...
    postRenderMeta: async html => {
      return {
        glamorousData: renderStatic(html)
      }
    }
  }
  ```
2. define a custom `Html` component in your `static.config.js` that can utilize the `glamorousData` styles you returned in `postRenderMeta`:
  ```javascript
  import React, { Component } from 'react'
  import { renderStatic } from 'glamor/server'

  export default class CustomHtml extends Component {
    render () {
      const {
        Html,
        Head,
        Body,
        children,
        staticMeta: {
          glamorousData: {
            css
          }
        }
      } = this.props

      return (
        <Html>
          <Head>
            <style dangerouslySetInnerHTML={{ __html: css }} />
          </Head>
          <Body>{children}</Body>
        </Html>
      )
    }
  }
  ```

#### Using `redux`
There is nothing special about using redux, other than making sure your create your `store` in your entry file, and that it is used in both the static export and rendered component. Other than that, you could follow any online tutorial about setting up redux with hot-reloading.
