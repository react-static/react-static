![React Static Logo](https://github.com/nozzle/react-static/raw/master/media/logo.png)

[![Travis CI Build Status](https://travis-ci.org/nozzle/react-static.svg?branch=master)](https://travis-ci.org/nozzle/react-static) [![David Dependancy Status](https://david-dm.org/nozzle/react-static.svg)](https://david-dm.org/nozzle/react-static) [![npm package v](https://img.shields.io/npm/v/react-static.svg)](https://www.npmjs.org/package/react-static) [![npm package dm](https://img.shields.io/npm/dm/react-static.svg)](https://npmjs.com/package/react-static) [![Join the community on Slack](https://img.shields.io/badge/slack-react--chat-blue.svg)](https://react-chat-signup.herokuapp.com/) [![Github Stars](https://img.shields.io/github/stars/nozzle/react-static.svg?style=social&label=Star)](https://github.com/nozzle/react-static) [![Twitter Follow](https://img.shields.io/twitter/follow/nozzleio.svg?style=social&label=Follow)](https://twitter.com/nozzleio)

<br>
<br>

# React Static

A **progressive static-site generator** for React.

[**Read the introduction article on Medium**](https://medium.com/@tannerlinsley/%EF%B8%8F-introducing-react-static-a-progressive-static-site-framework-for-react-3470d2a51ebc)

React-Static is a fast, lightweight, and powerful framework for building static-progressive React applications and websites. It's been carefully designed to meet the highest standards of **SEO, site performance, and user/developer experience**.

## Features

- ⚛️ 100% React (or Preact!)
- 🚀 Blazing fast builds and performance.
- 🚚 Data Agnostic. Supply your site with data from anywhere, **however you want**.
- 💥 Near-instant page views via [PRPL](https://developers.google.com/web/fundamentals/performance/prpl-pattern/) pattern.
- 🎯 Built for **SEO**.
- 🥇 React-first developer experience.
- 😌 Painless project setup & migration.
- 💯 Supports 100% of the React ecosystem. Including CSS-in-JS libraries, custom Query layers like GraphQL, and even Redux.
- 🔥 Hot Reloadable out-of-the-box. Edit React components & styles in real-time.
- 📲 LAN accessible dev environmentfor testing on other devices like phones and tablets.

## Videos & Tutorials

- [Get started in 5 minutes! (create-react-app template)](https://youtu.be/1pBzh7IM1s8) (5 min)
- [Introducing React-Static! How it works and why we built it!](https://www.youtube.com/watch?v=OqbJ5swVpDQ) (80 min)
- [Walkthrough - Installing and creating a new project with Styled Components](https://www.youtube.com/watch?v=KvlTVZPlmgs) (20 min)

## Sites Built with React-Static

- [Nozzle.io](https://nozzle.io)
- [Timber.io](https://timber.io)
- [Manta.life](https://manta.life)
- [Manticore Games](http://manticoregames.com)

## Examples and Templates

All of the following examples can be used as a template at project creation.

- [Basic](https://github.com/nozzle/react-static/tree/master/examples/basic)
- [Blank (Create-React-App)](https://github.com/nozzle/react-static/tree/master/examples/blank)
- [Preact](https://github.com/nozzle/react-static/tree/master/examples/preact)
- [Animated Routes](https://github.com/nozzle/react-static/tree/master/examples/animated-routes)
- [Custom Routing](https://github.com/nozzle/react-static/tree/master/examples/custom-routing)
- [Dynamic Imports (code-splitting)](https://github.com/nozzle/react-static/tree/master/examples/dynamic-imports)
- [Dynamic Imports (code-splitting with SSR)](https://github.com/nozzle/react-static/tree/master/examples/dynamic-imports-with-ssr)
- [Firebase Auth](https://github.com/nozzle/react-static/tree/master/examples/firebase-auth)
- [Glamorous & Tailwind CSS](https://github.com/nozzle/react-static/tree/master/examples/glamorous-tailwind)
- [Glamorous](https://github.com/nozzle/react-static/tree/master/examples/glamorous)
- [LESS & Antdesign](https://github.com/nozzle/react-static/tree/master/examples/less-antdesign)
- [Styled-Components](https://github.com/nozzle/react-static/tree/master/examples/styled-components)
- [Redux](https://github.com/nozzle/react-static/tree/master/examples/redux)
- [Apollo GraphQL](https://github.com/nozzle/react-static/tree/master/examples/apollo)
- [Apollo & Redux](https://github.com/nozzle/react-static/tree/master/examples/apollo-redux)
- [TypeScript](https://github.com/nozzle/react-static/tree/master/examples/typescript)
- [Cordova (Hybrid App)](https://github.com/nozzle/react-static/tree/master/examples/cordova)

Can't find an example? We invite you to write one! Simply copy the `basic` or `blank` templates and make the necessary changes. Then submit a PR including your new example directory and a new item in the list above. When merged, your example will automatically become a template in the CLI. How magical!

## Chat with us on Slack!

[Click here to sign up for the React-Tools slack Organization](https://react-chat-signup.herokuapp.com), and join us in the **#react-static** channel! We are constantly discussing implementation details, answering questions and planning features. :)

## Documentation

If you read these docs on `npmjs.com`, they correspond to the [published version on npm](https://www.npmjs.com/package/react-static#documentation). The latest, potentially not yet published docs (HEAD), correspond to the [README.md on github](https://github.com/nozzle/react-static#documentation).

- [Installation](#installation)
- [CLI](#cli)
  - [`react-static create`](#react-static-create)
  - [`react-static start`](#react-static-start)
  - [`react-static build`](#react-static-build)
- [Project Setup](#project-setup)
- [Configuration (`static.config.js`)](#configuration-staticconfigjs)
  - [Automatic Data and Prop Splitting](#automatic-data-and-prop-splitting)
  - [Webpack Config and Plugins](#webpack-config-and-plugins)
  - [Use Preact in Production](#use-preact-in-production)
- [Components & Tools](#components--tools)
  - [`<Router>`](#router)
  - [Automatic Routing with `<Routes>`](#automatic-routing-with--routes)
  - [Custom Routing](#custom-routing)
  - [404 Handling](#404-handling)
  - [Automatic Routing with Custom Render Props](#automatic-routing-with-custom-render-props)
  - [`<Link>` and `<NavLink>`](#link-and-navlink)
  - [Other Routing Utilities](#other-routing-utilities)
  - [`getRouteProps(Component)`](#getroutepropscomponent)
  - [`getSiteProps(Component)`](#getsitepropscomponent)
  - [`<Head>`](#head)
  - [`<Prefetch path=''/>`](#prefetch-path)
  - [`<PrefetchWhenSeen path=''/>`](#prefetchwhenseen-path)
  - [`prefetch(path)`](#prefetchpath)

## Installation

Install react-static globally:

```bash
$ yarn global add react-static
# or
$ npm install -g react-static
```

### New Project

To create a new project:

```bash
$ react-static create
```

### Existing Projects

To migrate an existing project, install `react-static` locally:

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
React Static requires a few directories and files to function out of the box:

- `static.config.js` - A javascript configuration file for react-static. [Click here to see an example](https://github.com/nozzle/react-static/blob/master/examples/basic/static.config.js)
- `public/` - Anything in this directory will be merged into your static `dist` directory. All files in this directory can be accessed at the root of your site.
- `src/` - a place for all of your code
  - `index.js` - the main entry for your app. This file should export your app as its default export and also handle the rendering of the app when using the development server. [Click here to see an example](https://github.com/nozzle/react-static/blob/master/examples/basic/src/index.js).

Some of these directories can be changed too! Read on to see how!

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
    component: 'src/containers/Home', // specify the path of a react component that will render this route
  }, {
    path: '/blog',
    component: 'src/containers/Blog',
    children: [{ // It can also contained nested routes
      path: '/post-1',
      component: 'src/containers/Post',
      // getProps is an asynchronous function that is passed the
      // resolved `route` object and a `dev` boolean indicating
      // whether this is a production build or not. This function
      // should resolve any data the route needs to render e.g. blog
      // posts, API data, etc.
      getProps: async ({route, dev}) => ({
        post: {...},
        otherProp: {...}
      })
      noindex: false, // Optional. Defaults to `false`. If `true`, will exclude this route from the sitemap XML
      permalink: '', // Optional. If not set, will default to (siteRoot + path)
      lastModified: '', // Optional. String('YYYY-MM-DD')
      priority: 0.5 // Optional.
    }, {
      // If using automatic routing, you can specify a component to render the
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
  // Document for every page, including the dev server. If used, it must utilize the
  // `Html`, `Head`, `Body` and `children` for react-static to work. The optional
  // `siteProps` prop will contain any data returned by `getSiteProps` in your config
  // and `renderMeta` prop refers to any data you potentially assigned to it during
  // the custom `renderToHtml` hook.
  Document: ({ Html, Head, Body, children, siteProps, renderMeta }) => (
    <Html lang="en-US">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>{children}</Body>
    </Html>
  ),

  // An optional function or array of functions to transform the webpack config.
  // Each function will receive the previous webpack config, and expect a
  // modified or new config to be returned (or undefined if you wish not to modify
  // the config)
  webpack: [(previousConfig, args) => newConfig],

  // An optional object for customizing the options for the webpack-dev-server
  devServer: {
    port: 8080,
    host: '127.0.0.1'
  },

  // An optional function to customize the server rendering logic. Receives:
  // - render: renders the JSX to and html string
  // - Component: the final react component to be rendered to HTML
  // - meta, a MUTABLE object that is exposed to the optional Document component as a prop
  // - webpackStats, the webpack stats generated from the "prod" stage
  // Expected to return an HTML string
  // This is the perfect place for css-in-js integration (see styled-components and glamorous examples for more information)
  renderToHtml: async (render, Component, meta, webpackStats) => {
    meta.hello = 'world'
    return render(<Component />)
  },

  // Internal directories used by react-static can be overwritten using this object.
  // Each path is relative to your project root and defaults to:
  paths: {
    src: 'src', // The source directory. Must include an index.js entry file.
    dist: 'dist', // The production output directory.
    devDist: 'dist', // The development scratch directory.
    public: 'public' // The public directory (files copied to dist during build)
  },

  // onStart and onBuild are utility hooks that run when the dev server starts up successfully
  // and after a build has completed.
  // onStart provides you with the final, READONLY devServer config object for convenience.
  // onBuild currently does NOT provide any parameters
  onStart: ({ devServerConfig }) => {...},
  onBuild: async () => {...},

  // Optional. Set to true to serve the bundle analyzer on a production build.
  bundleAnalyzer: false,
}
```

## Automatic Data and Prop Splitting
React Static has a very unique and clever way of requesting the least amount of data to display any given page at just the right moment.

#### How does it work?
When you return an object of props in a route's `getProps` function, each prop is compared to all other props for `===` equality. When a prop is found to be used in more than one location, it is promoted to a **shared prop** and stored in it's very own JSON file.

#### Why is that cool?
By storing common props in separate files, your site avoids wastefully serving duplicate data for pages that share some or all of their data with others. This decreases the overall bandwidth your site uses and also considerably speeds up your sites ability to serve data as fast as possible!

#### Example
Consider a dynamic menu structure that is present only on some of your pages, but not all of them. In this case, the menu data would only be loaded on those pages, and only once per session, instead of on every page.

```javascript
import axios from 'axios'

export default {
  getRoutes: async () => {
    const supportMenu = getMyDynamicMenuFromMyCMS()
    return [
      {
        path: '/',
        component: 'src/containers/Home',
      },
      {
        path: '/docs',
        component: 'src/containers/Docs',
        getProps: async () => ({
          supportMenu // Use it once here
        })
      },
      {
        path: '/help',
        component: 'src/containers/Help',
        getProps: async () => ({
          supportMenu, // since this `supportMenu` is equal `===` to the
          // `supportMenu` used in the docs route, both instances will be promoted to a shared prop
          // and only loaded once per session!
          helpStuff: {...} // All other props that are unique to the route are
          // still stored in their own JSON file.
        })
      },
    ]
  },
}
```

#### Important Notes
Automatic data and prop splitting is based on identity comparison `===`. If you break this referential integrity, React Static cannot detect that two props are the same.

**An example of what not do**
<br/>
```javascript
import axios from 'axios'

export default {
  getRoutes: async () => {
    const supportMenu = getMyDynamicMenuFromMyCMS()
    return [
      {
        path: '/',
        component: 'src/containers/Home',
      },
      {
        path: '/docs',
        component: 'src/containers/Docs',
        getProps: async () => ({
          supportMenu
        })
      },
      {
        path: '/help',
        component: 'src/containers/Help',
        getProps: async () => ({
          supportMenu { ...supportMenu } // Even though this supportMenu obejct
          // is exactly the same as the original, it is not the actual original.
          // This would not work!
        })
      },
    ]
  },
}
```


## Webpack Config and Plugins

To modify the webpack configuration, use the `webpack` option in your `static.config.js` file.

```javascript
webpack: []Function(
  previousConfig,
  args: {
    stage,
    defaultLoaders: {
      jsLoader,
      cssLoader,
      fileLoader
    }
  }
) => {
  return newConfig // or a falsey value to cancel transformation
}
```

- The value can be an array of functions or a single function.
- Each function will receive the previous webpack config, and can return a modified or new config.
- Return any falsey value to cancel the transformation
- `args.stage` is a string of either `prod`, `dev` or `node`, denoting which stage react-static is building for.
- `args.defaultLoaders` - A convenience object containing the default react-static webpack rule functions:

  - `jsLoader` - The default loader for all `.js` files (uses babel)
  - `cssLoader` - The default style loader that supports importing `.css` files and usage of css modules.
  - `fileLoader` - The default catch-all loader for any other file that isn't a `.js` `.json` or `.html` file. Uses `url-loader` and `file-loader`

When `webpack` is passed an array of functions, they are applied in order from top to bottom and are each expected to return a new or modified config to use. They can also return a falsey value to opt out of the transformation and defer to the next function.

By default, React Static's webpack toolchain compiles `.js` and `.css` files. Any other file that is not a `.js` `.json` or `.html` file is also processed with the `fileLoader` (images, fonts, etc.) and will move to `./dist` directory on build. The source for all default loaders can be found in [react-static/lib/webpack/rules/](./src/webpack/rules).

Our default loaders are organized like so:

```javascript
const webpackConfig = {
  ...
  module: {
    rules: [{
      oneOf: [
        jsLoader, // Compiles all .js files with babel
        cssLoader, // Supports basic css imports and css modules
        fileLoader // Catch-all url-loader/file-loader for anything else
    }]
  }
  ...
}
```

**Note:** Usage of the `oneOf` rule is not required, but recommended. This ensures each file is only handled by the first loader it matches, and not any loader. This also makes it easier to reutilize the default loaders, without having to fuss with `excludes`. Here are some examples of how to replace and modify the default loaders:

**Replacing all rules**

```javascript
// static.config.js

export default {
  webpack: (config) => {
    config.module.rules = [
      // Your own rules here...
    ]
    return config
  }
}
```

**Replacing a default loader for a different one**

```javascript
// static.config.js

export default {
  webpack: (config, { defaultLoaders }) => {
    config.module.rules = [{
      oneOf: [
        defaultLoaders.jsLoader,
        {
          // Use this special loader
          // instead of the cssLoader
        }
        defaultLoaders.fileLoader,
      ]
    }]
    return config
  }
}
```

**Adding a plugin**

```javascript
// static.config.js
import AwesomeWebpackPlugin from 'awesome-webpack-plugin'

export default {
  webpack: (config) => {
    config.plugins.push(new AwesomeWebpackPlugin())
    return config
  }
}
```

**Using multiple transformers**

```javascript
// static.config.js

export default {
  webpack: [
    (config, { defaultLoaders }) => {
      config.module.rules = [{
        oneOf: [
          defaultLoaders.jsLoader,
          defaultLoaders.cssLoader,
          {
            loader: 'file-loader',
            test: /\.(fancyFileExtension)$/,
            query: {
              limit: 10000,
              name: 'static/[name].[hash:8].[ext]',
            },
          },
          defaultLoaders.fileLoader,
        ]
      }]
      return config
    },
    config => {
      console.log(config.module.rules) // Log out the final set of rules
    }
  ]
}
```

**Using Custom devServer properties**

This project uses webpack-dev-server. The `devServer` config object can be used to customize your development server.

```javascript
// static.config.js

export default {
  devServer: {
    port: 8080,
    host: '127.0.0.1'
  }
}
```

## Use Preact in Production
Want to make your bundle even smaller? Simply set `preact: true` in your `static.config.js` and React-Static will ship preact with your site instead of React. This can significantly reduce the size of your app and load times!

**Example**
```javascript
// static.config.js
export default {
  preact: true,
  ...
}
```

**Note**: If updating a project not originally based on the `preact` template, you will need to update the render method of your app to always use `ReactDOM.render` and not `ReactDOM.hydrate`. [See the preact template for an example of this](https://github.com/nozzle/react-static/blob/master/examples/preact/src/index.js#L14)

**Important**
Due to the complexity of maintaining a fully tooled development experience, React is still used in development mode if `preact` is set to `true`. This ensures that stable hot-reloading tooling, dev tools, ect. are used. This is by no means permanent though! If you know what it takes to emulate React Static's development environment using Preact tooling, please submit a PR!

## Components & Tools

### `<Router>`

The `Router` component is required, and provides the underlying React-Router context to its children. It is recommended to always be the root component of a react-static app.

- `Router` automatically handles rendering both static and browser environments.
- Supports an optional `type` prop that can be one of:

  - `browser` - Uses `history.createBrowserHistory`
  - `hash` - Uses `history.createHashHistory`
  - `memory` - Uses `history.createMemoryHistory`

- It optionally accepts a `history` object (most-often used for things like react-router-redux), and also provides a helper method to subscribe to loading events. Note that this will override the `type` prop above.

Example:

```javascript
import { Router, Switch, Route } from 'react-static'
import Routes from 'react-static-routes'

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

To Subscribe to Router loading events, use `Router.subscribe(callback)`. This can be extremely useful when using a library like `nprogress` to show a loading status. The subscribe callback will fire whenever the loading state changes:

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

---
### Automatic Routing with `<Routes>`

React Static comes built in with a component router that automatically handles all of your routing for you. This is done by first, specifying a `component` **path** (relative to the root of your project) that should be used to render a route in your `static.config.js`.

`static.config.js` example:

```javascript
export default {
  getRoutes: async () => [{
    path: '/'
    component: 'src/containers/Home',
  }]
}
```

When your site is built (both in dev and production mode), the special `<Routes>` component will automatically handle all of your routing based on the paths you define in your `static.config.js`

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

To see an example of using , refer to our [`basic` example template](https://github.com/nozzle/react-static/blob/master/examples/basic)

---
### Custom Routing

If you end up needing more control than `<Routes />` offers, have no fear. React Static provides you with all of the custom routing components you are normally used to with `react-router`:

**NOTE: These components are available via the `react-static` import. There is no need to import them via `react-router`**

- `<Route>`
- `<Switch>`
- `<Redirect>`
- `<Prompt>`

To build your own custom routing, simply remove (or don't use) the `<Routes>` component in your app, and use the above components instead.
**Be careful**, by using your own custom routing, you will be responsible for maintaining route synchronization between automatic and custom routing: _automatic_ routing in `static.config.js` will generate pages **along with their respective `routeData.json` files !** no matter how _custom_ client routes are defined.

To see a working example, refer to our [`custom-routing` example template](https://github.com/nozzle/react-static/blob/master/examples/custom-routing)

To learn more about how `react-router` components work, visit [React-Router's Documentation](https://reacttraining.com/react-router/web/guides/philosophy)

---
### 404 Handling

Making a 404 page in React Static is extremely simple for both automatic and custom routing configurations.

##### With Automatic Routing

To define a 404 page using automatic routing, define a route with `is404` set to `true` and a `component` path to render the 404 page. Note that no `path` property is needed for a 404 route. At both build time and run time, the rendered result of this `component` will be used for any routes that are not found.

##### With Custom Routing

When using custom routing, there are 2 types of 404 pages:

- **Static 404 page** - At build time, React Static will automatically attempt to render a `/404` path in your app. Whatever renders as a result of this path will be exported to `404.html` and be used for pages not found on **first load**.
- **Dynamic 404 pages** - For `<Link>`s and in-app navigations that don't match your custom routing structure, you must handle those situations yourself. The best (and most thorough) way to handle this scenario is to make sure you use a catch all `<Route component={SomeComponent} />` at the end of **all** `<Switch>` statements in your app. Not all of them must point to the same 404 component, since you may want to show a custom 404 page for a post that isn't found, versus a page that isn't found.

---
### Automatic Routing with Custom Render Props
Occasionally, you may need to render the automatic `<Routes>` component in a custom way. The most common use-case is illustrated in the [animated-routes](https://github.com/nozzle/react-static/tree/master/examples/animated-routes) example transitions. To do this, utilize one of these three render prop formats:

**Render Prop Formats**
```javascript
import { Router } from 'react-static'
import Routes from 'react-static-routes'

export default () => (
  <Router>
    // pass a component
    <Routes
      component={RenderRoutes}
    />

    // or, pass a render function
    <Routes
      render={({ getTemplateForPath }) => (
        ...
      )}
    />

    // or, pass a function as a child
    <Routes>
      {({ getTemplateForPath }) => (
        ...
      )}
    </Routes>
  </Router>
)
```

**Render Props** - These special props are sent to your rendered component or function
- `getTemplateForPath(pathname) => Component` - Takes a pathname and returns the component (if it exists) to render that path. Returns `false` if no template is found.
<!-- - `templateMap{}` - An object mapping template ids to Components
- `templateTree{}` - A nested object structure mapping paths and their children to a template ID.
  - `c` - the children of the path
  - `t` - the template ID of the path -->

**Default Route Renderer**
Below is the default renderer for the `<Routes>` component. It will serve as a good starting point.

```javascript
import { Router } from 'react-static'
import Routes from 'react-static-routes'

export default () => (
  <Router>
    <Routes
      render={( getTemplateForPath ) => (
        // The default renderer uses a catch all route to recieve the pathname
        <Route path='*' render={props => {
          // The pathname is used to retrieve the component for that path
          let Comp = getComponentForPath(props.location.pathname)
          // The 404 component is used as a fallback
          if (!Comp) {
            Comp = getComponentForPath('404')
          }
          // The component is rendered!
          return Comp && <Comp {...props} />
        }} />
      )}
    />
  </Router>
)
```

---
### `<Link>` and `<NavLink>`

React Static also gives you access to `react-router`'s `<Link>` and `<NavLink>` components. Use these component to allow your users to navigate around your site!

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

For more information about `<Link>` and `<NavLink>`, see [React-Router's Documentation](https://reacttraining.com/react-router/web/guides/philosophy)

---
### Other Routing Utilities

For your convenience, React Static also exports the following utilities normally exported by `react-router`.

- `history`
- `matchPath`
- `withRouter`

---
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

**App.js (Class)**

```javascript

class TopHundredSongsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <ul>
                {this.props.songs.map(song => <li key={song}>{song}</li>)}
            </ul>

        );
    }
}

TopHundredSongsPage.propTypes = {
    songs: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default getRouteProps(TopHundredSongsPage);

...
<Route exact path="/top-100-songs" component={TopHundredSongsPage} />
...
```

---
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

---
### `<Head>`

`Head` is a react component for managing tags in the document's `head`. Use it to update meta tags, title tags, etc.

- It can be used anywhere in your app.
- If called more than once on a route, it will append and merge them together (and overwrite some tags with the latest tag used).
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

---
### `<Prefetch path=''/>`

Prefetch is a react component that accepts a `path` prop and an optional single child to render. When this component is rendered, any data resolved by the `path`'s corresponding `getProps` function will be prefetched. This ensures that if the user then navigates to that route in your site, they do not have to wait for the required data to load.

- If the path doesn't match a route, no data will be loaded.
- If the route has already been loaded in the session, the cache will be used instead.
- If multiple instances of the same `path` are prefetched at the same time, only a single request will be made for all instances.
- If used more often than needed, this component could result in fetching a lot of unused data. Be smart about what you prefetch.

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

---
### `<PrefetchWhenSeen path=''/>`

PrefetchWhenSeen is almost identical to the Prefetch component, except that it will not fire its prefetch until the component is visible in the view. If the user's browser doesn't support the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), it will work just like the Prefetch component.

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

---
### `prefetch(path)`

`prefetch` is an imperative version of the `Prefetch` component that you can use anywhere in your code.

Example:

```javascript
import { prefetch } from 'react-static'

const myFunc = async () => {  
  const data = await prefetch('/blog')
  console.log('The preloaded data:', data)
}
```

## Contributing

We are always looking for people to help us grow `react-static`'s capabilities and examples. If you have an issue, feature request, or pull request, let us know!

## License

React Static uses the MIT license. For more information on this license, [click here](https://github.com/nozzle/react-static/blob/master/LICENSE).
