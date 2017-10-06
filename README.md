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

## Lifecycle Overview

<div align="center">
  <img src="https://github.com/nozzle/react-static/raw/master/media/flow.png" width="600"/>
</div>

<br />
<br />

<a target='\_blank' rel='nofollow' href='https://app.codesponsor.io/link/zpmS8V9r31sBSCeVzP7Wm6Sr/nozzle/react-static'>
  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/zpmS8V9r31sBSCeVzP7Wm6Sr/nozzle/react-static.svg' />
</a>

## Documentation
These docs are for version `1.x.x`

- [Quick Start](#quick-start)
- [Installation](#installation)
- [CLI](#cli)
  - [`react-static create`](#react-static-create-project-name)
  - [`react-static start`](#react-static-start)
  - [`react-static build`](#react-static-build)
- [Project Setup](#project-setup)
- [Configuration (`static.config.js`)](configuration-staticconfigjs)
- [Components & Tools](#components--tools)
  - [`<Router />`](#router-)
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
```bash
$ yarn add react-static
# or
$ npm install react-static --save
```

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
    path: '/' // A route object only requires a `path` string
  }, {
    path: '/blog',
    children: [{ // It can also contained nested routes
      path: '/post-1',
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
      changeFreq: 60000, // Optional.
      lastModified: '', // Optional. String('YYYY-MM-DD')
      priority: 0.5 // Optional.
    }],
  }],

  siteRoot: 'https://mysite.com', // Optional, but necessary for the sitemap.xml

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

#### Routing Components
`react-static` also provides you with all other necessary routing components and utils via `react-router`.

These include:
- <Link>
- <NavLink>
- <Prompt>
- <Redirect>
- <Route>
- <Switch>
- history
- matchPath
- withRouter

To learn how these `react-router` components work, visit [React-Router-Web's documentation](https://reacttraining.com/react-router/web/guides/philosophy)

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

#### `<Prefetch path=''/>`
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

#### `prefetch(path)`
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
