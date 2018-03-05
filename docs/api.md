# API Reference

- [static.config.js](#staticconfigjs)
  - [getRoutes](#getroutes)
  - [route](#route)
  - [getSiteData](#getsitedata)
  - [siteRoot](#siteroot)
  - [stagingSiteRoot](#stagingsiteroot)
  - [basePath](#basepath)
  - [stagingBasePath](#stagingbasepath)
  - [devBasePath](#devbasepath)
  - [Document](#document)
  - [webpack](#webpack)
  - [devServer](#devserver)
  - [renderToHtml](#rendertohtml)
  - [paths](#paths)
  - [onStart](#onstart)
  - [onBuild](#onbuild)
  - [bundleAnalyzer](#bundleanalyzer)
  - [outputFileRate](#outputfilerate)
  - [prefetchRate](#prefetchrate)
- [CLI](#cli)
  - [react-static create](#react-static-create)
  - [react-static start](#react-static-start)
  - [react-static build](#react-static-build)
- [Node API](#node-api)
  - [create](#create)
  - [start](#start)
  - [build](#build)
- [Components](#components)
  - [Router](#router)
  - [Routes](#routes-react-static-routes)
  - [RouteData](#routedata)
  - [SiteData](#sitedata)
  - [Link](#link)
  - [Loading](#loading)
  - [Head](#head)
  - [Prefetch](#prefetch)
  - [PrefetchWhenSeen](#prefetchwhenseen)
  - [Prompt (react-router)](#prompt-react-router)
  - [Redirect (react-router)](#redirect-react-router)
  - [Route (react-router)](#route-react-router)
  - [Switch (react-router)](#switch-react-router)
  - [matchPath (react-router)](#matchpath-react-router)
  - [withRouter (react-router)](#withRouter-react-router)
- [Methods](#methods)
  - [onLoading](#onloading)
  - [prefetch](#prefetch-1)
  - [scrollTo](#scrollto)

# `static.config.js`
A `static.config.js` file is optional, but recommended at your project root to use react-static. If present, it must export a **default** object containing any of the following properties:

### `getRoutes`
An asynchronous function that should resolve an array of [**route**](#route) objects. You'll probably want to use this function to request any dynamic data or information that is needed to build all of the routes for your site. It is also passed an object containing a  `dev` boolean indicating whether its being run in a production build or not.

```javascript
// static.config.js
export default {
  getRoutes: async ({ dev }) => [...routes]
}
```

### `route`
A route is an `object` that represents a unique location in your site and is the backbone of every React-Static site.

It supports the following properties:
- `path: String` - The **path** of the URL to match for this route, **excluding search parameters and hash fragments, relative to your `siteRoot + basePath` (if this is a child route, also relative to this route's parent path)**
- `component: String` - The path of the component to be used to render this route. (Relative to the root of your project)
- `getData: async Function(resolvedRoute, { dev }) => Object` - An async function that returns or resolves an object of any necessary data for this route to render.
  - Arguments
    - `resolvedRoute: Object` - This is the resolved route this function is handling.
    - `flags: Object{}` - An object of flags and meta information about the build
      - `dev: Boolean` - Indicates whether you are running a development or production build.
- `is404: Boolean` - Set to `true` to indicate a route as the 404 handler for your site. Only one 404 route should be present in your site!
- `children: Array[Route]` - Routes can and should have nested routes when necessary. **Route paths are inherited as they are nested, so there is no need to repeat a path prefix in nested routes**.
- `noIndex: Boolean` - Set this to `true` if you do not want this route indexed in your automatically generated sitemap.xml. Defaults to `false`.
- `permalink: String` - You can optionally set this route to have a custom xml sitemap permalink by supplying it here.
- `lastModified: String(YYYY-MM-DD)` - A string representing the date when this route was last modified in the format of `YYYY-MM-DD`.
- `priority: Float` - An optional priority for the sitemap.xml. Defaults to `0.5`

Example:
```javascript

// static.config.js
export default {
  getRoutes: async ({ dev }) => [

    // A simple route
    {
      path: 'about',
      component: 'src/containers/About',
    },

    // A route with data
    {
      path: 'portfolio',
      component: 'src/containers/Portfolio',
      getData: async () => ({
        portfolio,
      }),
    },

    // A route with data and dynamically generated child routes
    {
      path: 'blog',
      component: 'src/containers/Blog',
      getData: async () => ({
        posts,
      }),
      children: posts.map(post => ({
        path: `post/${post.slug}`,
        component: 'src/containers/BlogPost',
        getData: async () => ({
          post,
        }),
      }))
    },

    // A 404 component
    {
      is404: true,
      component: 'src/containers/NotFound',
    }

  ]
}
```

### `getSiteData`
`getSiteData` is very similar to a route's `getData` function, but its result is made available to the entire site via the `SiteData` and `getSiteData` component/HOC. Any data you return here, although loaded once per session, will be embedded in every page that is exported on your site. So tread lightly ;)

Example:
```javascript
// static.config.js
export default {
  getSiteData: async ({dev}) => ({
    title: 'My Awesome Website',
    lastBuilt: Date.now()
  }),
}
```

### `siteRoot`
Your `siteRoot` in the format of `protocol://domain.com` is highly recommended and is necessary for many things related to SEO to function for your site. So far, this includes:
- Automatically generating a `sitemap.xml` on export
- Forcing absolute URLs in statically rendered links.
Make sure that you include `https` if you serve your site with it (which we highly recommend). **Any trailing slashes including the pathname will be removed automatically**. If you need to set a base path for your site (eg. if you're using github pages), you'll want to use the `basePath` option.

Example:
```javascript
// static.config.js
export default {
  siteRoot: 'https://mysite.com'
}
```

### `stagingSiteRoot`
Works exactly like `siteRoot`, but only when building with the `--staging` build flag.

### `basePath`
Your `basePath` in the format of `some/route` is necessary if you intend on hosting your app from a specific route on your domain (eg. When using Github Pages or for example: `https://mysite.com/blog` where `blog` would the `basePath`)
**All leading and trailing slashes are removed automatically**.

Example:
```javascript
// static.config.js
export default {
  basePath: 'blog'
}
```

### `stagingBasePath`
Works exactly like `basePath`, but only when building with the `--staging` build flag.

### `devBasePath`
Works exactly like `basePath`, but only when running the dev server.

### `Document`
It's never been easier to customize the root document of your website! `Document` is an optional (and again, recommended) react component responsible for rendering the root of your website.

Things you may want to place here:
- Custom `head` and/or `meta` tags
- Site-wide analytics scripts
- Site-wide stylesheets

Props
  - `Html: ReactComponent` - **Required** - An enhanced version of the default `html` tag.
  - `Head: ReactComponent` - **Required** - An enhanced version of the default `head` tag.
  - `Body: ReactComponent` - **Required** - An enhanced version of the default `body` tag.
  - `children: ReactComponent` - **Required** - The main content of your site, including layout, routes, etc.
  - `siteData: Object` - Any data optionally resolved via the `getSiteData` function in this config file.
  - `renderMeta: Object` - Any data optionally provided via the `renderToHtml` function in this config file.

```javascript
// static.config.js
export default {
  Document: ({ Html, Head, Body, children, siteData, renderMeta }) => (
    <Html lang="en-US">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>{children}</Body>
    </Html>
  ),
}
```

### `webpack`
An optional function or array of functions to transform the default React-Static webpack config. Each function will receive the previous webpack config, and expect a modified or new config to be returned. You may also return a "falsey" or `undefined` value if you do not want to modify the config at all.

**Function Signature**
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

- The `webpack` property's value can be an **array of functions** or a **single function**.
- Each function will receive the previous webpack config, and can return a modified or new config.
- Return any falsey value to cancel the transformation
- `args.stage` is a string of either `prod`, `dev` or `node`, denoting which stage react-static is building for.
- `args.defaultLoaders` - A convenience object containing the default react-static webpack rule functions:
  - `jsLoader` - The default loader for all `.js` files (uses babel)
  - `cssLoader` - The default style loader that supports importing `.css` files and usage of css modules.
  - `fileLoader` - The default catch-all loader for any other file that isn't a `.js` `.json` or `.html` file. Uses `url-loader` and `file-loader`

When `webpack` is passed an array of functions, they are applied in order from top to bottom and are each expected to return a new or modified config to use. They can also return a falsey value to opt out of the transformation and defer to the next function.

By default, React Static's webpack toolchain compiles `.js` and `.css` files. Any other file that is not a `.js` `.json` or `.html` file is also processed with the `fileLoader` (images, fonts, etc.) and will move to `./dist` directory on build. The source for all default loaders can be found in [react-static/lib/webpack/rules/](https://github.com/nozzle/react-static/blob/master/src/webpack/rules).

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

### `devServer`
An `Object` of options to be passed to the underlying `webpack-dev-server` instance used for developement.

Example:
```javascript
// static.config.js
export default {
  // An optional object for customizing the options for the
  devServer: {
    port: 3000,
    host: '127.0.0.1'
  },
}
```

### `renderToHtml`
An optional function that can be used to customize the static rendering logic.
- Arguments
  - `render: Function`: A function that renders a react component to an html string
  - `Component`: the final react component for your site that needs to be rendered to an HTML
  - `meta`, a **mutable** object that is exposed to the optional Document component as a prop
  - `webpackStats`, the webpack stats generated from the "prod" stage
- Returns an HTML string to be rendered into your `Document` component provided in your config (or the default one).

This also happens to be the perfect place for css-in-js integration (see [styled-components] and [glamorous] examples for more information)

Exmaple:
```javascript
// static.config.js
export default {
  renderToHtml: async (render, Component, meta, webpackStats) => {
    // Add meta you may want
    meta.hello = 'world'

    // Use any custom rendering logic
    return render(<Component />)
  },
}
```

### `paths`
An `object` of internal directories used by react-static that can be customized. Each path is relative to your project root and defaults to:
```javascript
// static.config.js
export default {
  paths: {
    src: 'src', // The source directory. Must include an index.js entry file.
    dist: 'dist', // The production output directory.
    devDist: 'dist', // The development scratch directory.
    public: 'public', // The public directory (files copied to dist during build)
  }
}
```

### `onStart`
A utility function that runs when the dev server starts up successfully. It provides you with the final, **readonly** devServer config object for your convenience.

Example:
```javascript
// static.config.js
export default {
  onStart: ({ devServerConfig }) => {
    console.log('The dev server is working!')
  },
}
```

### `onBuild`
A utility function that runs when the a build completes successfully.

Example:
```javascript
// static.config.js
export default {
  onBuild: async () => {
    console.log('Everything is done building!')
  },
}
```

### `bundleAnalyzer`
An optional `Boolean`. Set to true to serve the bundle analyzer on a production build.
```javascript
// static.config.js
export default {
  bundleAnalyzer: true,
}
```

### `outputFileRate`
An optional `Int`. The maximum number of files that can be concurrently written to disk during the build process.
```javascript
// static.config.js
export default {
  outputFileRate: 100,
}
```

### `prefetchRate`
An optional `Int`. The maximum number of inflight requests for preloading route data on the client.
```javascript
// static.config.js
export default {
  prefetchRate: 10,
}
```

---

# CLI

### `react-static create`
Creates a new react-static project.

- Prompts for a project name/location
- Prompts to select one of the templates located in this repository's `examples/` directory, or you may select `custom` and enter in a git reposity to use in the form of `owner/repo`.
- Optionally, you may pass in command line arguments to specify the project name and/or template up front.

- Arguments:
  - `--name=$PROJECT_NAME` where `$PROJECT_NAME` is the desired name for your project (no spaces).
  - `--template=$TEMPLATE_NAME` where `$TEMPLATE_NAME` can be:
    - The name of the template in the `examples` directory
    - The full URL of a public git repository
    - The full path to a local directory

### `react-static start`
Starts the development server.

- Arguments:
  - `--config=$config` where `$config` is the path to the `static.config.js` file to be used.

### `react-static build`
Builds your site for production. Outputs to a `dist` directory in your project.
- Arguments:
  - `--config=$config` where `$config` is the path to the `static.config.js` file to be used.
  - `--staging` - By setting this flag, no siteRoot replacement or path optimizations are performed, allowing a production build of your site to function on localhost more easily. Use this argument to test a production build locally.
  - `--debug` - By setting this flag, your build will **not** be `uglified` allowing you to debug production errors (as long as they are unrelated to minification or uglification)

---

# Node API
React Static also provides a Node Api for full programmatic control!

### Usage
To use the node API, import it like so:
```javascript
import { create, start, build } from 'react-static/node'
```

### `create`
Creates a new react-static project.
- Arguments
  - `name: string` - The name of your new project (relative to the current-working directory), or the full path to the new directory you wish to create
  - `location: string`
    - The name of the template in the `examples` directory
    - The full URL of a public git repository
    - The full path to a local directory
  - `silent: boolean: true` - Set to true to show standard logging as you would normally see in the CLI
- Returns a `Promise`

### `start`
Starts the development server.
- Arguments
  - `config: object || string` - The config object to use, or the path of the `static.config.js` file you wish to use.
  - `silent: boolean: true` - Set to true to show standard logging as you would normally see in the CLI
- Returns a `Promise` that will **never resolve**. The process must be exited by the user to stop the server.

### `build`
Builds your site for production. Outputs to a `dist` directory in your project.
- Arguments
  - `config: object || string` - The config object to use, or the path of the `static.config.js` file you wish to use.
  - `staging` - When `true`, no siteRoot replacement or absolute URL optimizations are performed, allowing a production build of your site to function on localhost more easily. Use this argument to test a production build locally.
  - `debug` - When `true`, your build will **not** be `uglified` allowing you to debug production errors (as long as they are unrelated to minification or uglification)
  - `silent: boolean: true` - Set to true to show standard logging as you would normally see in the CLI
- Returns a `Promise`

---

# Components
### `Router`

The `Router` component is required and is what makes static exporting easy! It will **automatically** handle both static and browser environments and is recommended to always be the root component of a react-static app.

Props:
- `type: one of:`
  - `browser` - Uses `history.createBrowserHistory`
  - `hash` - Uses `history.createHashHistory`
  - `memory` - Uses `history.createMemoryHistory`
- `autoScrollToTop: Boolean` - Set this to `false` to disable the automatic scroll-to-top when the site path changes. Defualts to `true`.
- `autoScrollToHash: Boolean` - Set this to `false` to disable the automatic scroll-to-hash when the location hash changes. Defaults to `true`.
- `scrollToTopDuration: Int` - The duration of the automatic scroll-to-top animation that happens on path changes. Defaults to `0`
- `scrollToHashDuration: Int` - The duration of the automatic scroll-to-hash animation that happens on hash changes. Defaults to `800`
- `scrollToHashOffset: Int` - The vertical offset of the automatic scroll-to-hash animation that happens on path changes. Defaults to `0`
- `history: History` - An optional history object (most-often used for things like react-router-redux). Provides a helper method to subscribe to loading events. Note that this will override the `type` prop above.

Example:

```javascript
// App.js
import { Router } from 'react-static'

// For standard component routing:
export default () => (
  <Router>
    ...
  </Router>
)
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
)

export default () => (
  <Router>
    // pass a component (class or SFC)
    <Routes
      component={RenderRoutes}
    />

    // or, pass a render function
    <Routes
      render={RenderRoutes}
    />

    // or, pass a function as a child
    <Routes>
      {RenderRoutes}
    </Routes>
  </Router>
)
```

**Render Props** - These special props are sent to your rendered component or render function
- `getTemplateForPath(pathname) => Component` - Takes a pathname and returns the component (if it exists) to render that path. Returns `false` if no template is found.
- `componentsByTemplateID{templateID: component}` - An object mapping templateIDs to Components
- `templateIDsByPath{path: templateID}` - A object mapping paths to their corresponding template ID.

### `RouteData`
`RouteData` and it's companion HOC `withRouteData` are what provide a component with the results of the currently matched route's `getData` function as defined in your `static.config.js`.

Props
  - `component: ReactComponent`
  - `render: Function`
  - `children: Function`

Here is a an example show all of the different syntaxes you can use:

**static.config.js**
```javascript
module.exports = {
  getRoutes: () => [{
    path: '/top-100-songs',
    getData: async () => ({
      songs: await SpotifyAPI.getTopSongs(100)
    })
  }]
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
    metaDescription: 'A progressive static-site framework for React',
  }),
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

- It can be used anywhere in your app.
- It can be used in muliple places at the same time.
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

Prefetch is a react component that accepts a `path` prop, and optional `only` prop and an optional single child to render. When this component is rendered, any data or template required to render the `path` will be prefetched. This ensures that if the user then navigates to that route , they will not have to wait for the required data to load.

Props:
- `path: String` **Required** - The path you want to prefetch.
- `type: String.oneOf(['data', 'template'])` - An optional string denoted whether to only load the `data` or `template` for the path.

Notes:
- If the path doesn't match a route, no data will be loaded.
- If the route has already been loaded in the session, the synchronous cache will be used instead.
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

### `Prompt (react-router)`
A direct proxy of the `Prompt` component from [`react-router-dom`](https://reacttraining.com/react-router/web/api/)

### `Redirect (react-router)`
A direct proxy of the `Redirect` component from [`react-router-dom`](https://reacttraining.com/react-router/web/api/)

### `Route (react-router)`
A direct proxy of the `Route` component from [`react-router-dom`](https://reacttraining.com/react-router/web/api/)

### `Switch (react-router)`
A direct proxy of the `Switch` component from [`react-router-dom`](https://reacttraining.com/react-router/web/api/)

### `matchPath (react-router)`
A direct proxy of the `matchPath` component from [`react-router-dom`](https://reacttraining.com/react-router/web/api/)

### `withRouter (react-router)`
A direct proxy of the `withRouter` component from [`react-router-dom`](https://reacttraining.com/react-router/web/api/)

---

# Methods

### `onLoading`

If you need to imperatively subscribe to React-Static's global loadin state, you can use `onLoading`. Via a callback, it gives you access to a `loading` value (a Boolean), which will be true when react-static is waiting on assets to load (this won't happen often, if at all). Use this to show a loading indicator if you'd like!

Example:
```javascript
import { onLoading } from 'react-static'

// Pass a callback that will fire whenever the loading state changes.
const unsubscribe = onLoading(loading => {
  console.log(`Currently loading: ${loading}`)
})

// Call the function it returns to unsubscribe!
unsubscribe()
```

### `prefetch`

`prefetch` is an imperative version of the `Prefetch` component that you can use anywhere in your code.

Example:

```javascript
import { prefetch } from 'react-static'

const myFunc = async () => {  
  const data = await prefetch('/blog')
  console.log('The preloaded data:', data)
}
```

### `scrollTo`

This **async** method can be used to scroll to any given height or DOMElement you pass it.

- Arguments
  - `height: int || DOMElement` - The height from the top of the page or dom element you would like to scroll to.
  - `options{}` - An optional settings object
    - `duration: Int` - The duration of the animation in milliseconds
    - `offset: Int` - The negative or positive offset in pixels
    - `context: DOMElement` - The container element that will be scrolled.  Defaults to `body` via `window.scrollTo`
- Returns a `Promise` that is resolved when the scrolling stops

Example:

```javascript
import { scrollTo } from 'react-static'

const scrollToElement = () => {  
  const element = document.getElementById('my-element')
  scrollTo(element)
}

const asyncScrollToHeight = async () => {  
  await scrollTo(100, {
    offset: -10,
    duration: 2000
  })
  console.log('Done scrolling!')
}
```
