# Configuration (`static.config.js`)

A `static.config.js` file is optional, but recommended at your project root to use react-static to its fullest potential. If present, it must `default export` an object optionally containing any of the following properties:

- [getRoutes](#getroutes)
- [route](#route)
- [getSiteData](#getsitedata)
- [siteRoot](#siteroot)
- [stagingSiteRoot](#stagingsiteroot)
- [basePath](#basepath)
- [stagingBasePath](#stagingbasepath)
- [devBasePath](#devbasepath)
- [extractCssChunks](#extractcsschunks)
- [inlineCss](#inlinecss)
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
- [disableDuplicateRoutesWarning](#disableDuplicateRoutesWarning)
- [disableRoutePrefixing](#disablerouteprefixing)
- [babelExcludes](#babelExcludes)

### `getRoutes`

An asynchronous function that should resolve an array of [**route**](#route) objects. You'll probably want to use this function to request any dynamic data or information that is needed to build all of the routes for your site. It is also passed an object containing a `dev` boolean indicating whether its being run in a production build or not.

```javascript
// static.config.js
export default {
  getRoutes: async ({ dev }) => [...routes],
}
```

**Awesome Tip: Changes made to `static.config.js` while the development server is running will automatically run `getRoutes` again and any changes to routes or routeData will be hot-reloaded instantly! Don't want to edit/resave your config file? Try using [`reloadRoutes`](/docs/node-api.md/#reloadRoutes)!**

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
- `children: Array[Route]` - Routes can and should have nested routes when necessary. **Route paths are inherited as they are nested, so there is no need to repeat a path prefix in nested routes**.
- `redirect: URL` - Setting this to a URL will perform the equivalent of a 301 redirect (as much as is possible within a static site) using `http-equiv` meta tags, canonicals, etc. **This will force the page to render only the bare minimum to perform the redirect and nothing else**.
- `noindex: Boolean` - Set this to `true` if you do not want this route or its children indexed in your automatically generated sitemap.xml. Defaults to `false`.
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
      })),
    },

    // A 404 component
    {
      path: '404',
      component: 'src/containers/NotFound',
    },
  ],
}
```

### `getSiteData`

`getSiteData` is very similar to a route's `getData` function, but its result is made available to the entire site via the `SiteData` and `getSiteData` component/HOC. Any data you return here, although loaded once per session, will be embedded in every page that is exported on your site. So tread lightly ;)

Example:

```javascript
// static.config.js
export default {
  getSiteData: async ({ dev }) => ({
    title: 'My Awesome Website',
    lastBuilt: Date.now(),
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
  siteRoot: 'https://mysite.com',
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
  basePath: 'blog',
}
```

### `stagingBasePath`

Works exactly like `basePath`, but only when building with the `--staging` build flag.

### `devBasePath`

Works exactly like `basePath`, but only when running the dev server.

### `assetsPath`

Your `assetsPath` determines where your bundled JS and CSS will be loaded from. This is helpful if you want to host your assets in an external location such as a CDN.

### `extractCssChunks`

`extractCssChunks` replaces default `ExtractTextPlugin` with `ExtractCssChunks`. It enables automatic CSS splitting into separate files by routes as well as dynamic components (using `react-universal-component`). More information about the [plugin](https://github.com/faceyspacey/extract-css-chunks-webpack-plugin) and [why it is useful as a part of CSS delivery optimisation](https://github.com/faceyspacey/extract-css-chunks-webpack-plugin#what-about-glamorous-styled-components-styled-jsx-aphrodite-etc). Defaults to `false`.

### `inlineCss`

By using `extractCssChunks` option and putting code splitting at appropriate places, your page related CSS file can be minimal. This option allows you to inline your page related CSS in order to speed up your application by reducing the number of requests required for a first paint. Default to `false`.

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
- `routeInfo: Object` - All of the current route's information, including any `routeData`.
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

To configure webpack, extend the build system, or make modifications, see the [Plugin API section](#plugin-api)

### `devServer`

An `Object` of options to be passed to the underlying `webpack-dev-server` instance used for development.

Example:

```javascript
// static.config.js
export default {
  // An optional object for customizing the options for the
  devServer: {
    port: 3000,
    host: '127.0.0.1',
  },
}
```

### `renderToElement`

An optional function that can be used to override the process of rendering the base app component to an element

- Arguments
  - `App`: The final react-component for your app to be rendered
  - options{}: an options object
    - meta: The render meta for this page.
- Returns a JSX element, eg. `return <App />`

Default:

```javascript
// static.config.js
export default {
  renderToElement: async (App, { meta, clientStats }) => {
    return <App />
  },
}
```

### `renderToHtml`

An optional function that can be used to customize the process of rendering your apps final react element to HTML.

- Arguments
  - `render: Function`: A function that renders a react component to an html string
  - `JSXElement`: the final react element (that has already been rendered via `<Comp />`) for your site that needs to be rendered to an HTML
  - options{}: an options object
    - `meta`, a **mutable** object that is exposed to the optional Document component as a prop
    - `clientStats`, the webpack client stats generated from the "prod" stage
- Returns an HTML string to be rendered into your `Document` component provided in your config (or the default one).

Default:

```javascript
// static.config.js
export default {
  renderToHtml: async (render, app, { meta, clientStats }) => {
    return render(app)
  },
}
```

### `paths`

An `object` of internal directories used by react-static that can be customized. Each path is relative to your project root and defaults to:

```javascript
// static.config.js
export default {
  paths: {
    root: process.cwd(), // The root of your project. Don't change this unless you know what you're doing.
    src: 'src', // The source directory. Must include an index.js entry file.
    temp: 'tmp', // Temp output directory for build files not to be published.
    dist: 'dist', // The production output directory.
    devDist: 'tmp/dev-server', // The development scratch directory.
    public: 'public' // The public directory (files copied to dist during build)
    assets: 'dist' // The output directory for bundled JS and CSS
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

### `disableDuplicateRoutesWarning`

An optional `Boolean`. Set to `true` to disable warnings of duplicate routes during builds.

```javascript
// static.config.js
export default {
  disableDuplicateRoutesWarning: true,
}
```

### `disableRoutePrefixing`

An optional `Boolean`. Set to `true` to disable prefixing link href values and the browser history with `config.basePath`.
Useful if you are using a variable basePath such as /country/language/basePath.

```javascript
// static.config.js
export default {
  disableRoutePrefixing: true,
}
```

### `maxThreads`

An optional `Number` of maximum threads to use when exporting your site's pages. By default this is set to `Infinity` to use all available threads on the machine React Static is running on.

NOTE: This only affects the process that are rendering your pages to html files, not the initial bundling process.

```javascript
// static.config.js
export default {
  maxThreads: 1, // Will only use one thread to export your site
}
```

### `minLoadTime`

An optional `Number` of milliseconds to show the loading spinner when templates, siteData or routeData are not immediately available. If you are preloading aggressively, you shouldn't see a loader at all, but if a loader is shown, 's a good user experience to make is as un-flashy as possible.

```javascript
// static.config.js
export default {
  minLoadTime: 200,
}
```

### `disablePreload`

Set this boolean to `true` to disable all preloading. This is mostly meant for debugging at this point, but the internal mechanics could soon be converted into a condition to either preload or not based on the client (mobile, slow-connection, etc)

```javascript
// static.config.js
export default {
  disablePreload: true,
}
```

### `babelExcludes`

We are running Babel seperatly for your own sources and externals. The Babel configuration for your own sources can be manipulated the normal way. The one for `node_modules` can not, since its a bit special. We try to compile them with a bare minimum, but sometimes some modules gives you trouble (e.g. [mapbox-gl](https://github.com/mapbox/mapbox-gl-js/issues/3422))
This option gives you the ability to exclude some modules from babelifying.
See https://webpack.js.org/configuration/module/#condition for more details. To exclude e.g. `mapboxgl` simply pass the following

```javascript
// static.config.js
export default {
  babelExcludes: [/mapbox-gl/],
}
```

---

## Plugin Api

React Static has tons of other customization possibilities available through the Plugin system that are not possible through the configuration file. Some of thse include:

- Webpack customizations
- Rendering pipeline customizations and transformations for React components, elements, the Document wrapper, etc.
- Head tag injection

Every React Static project can utilize the plugin API locally without needing to create a plugin by creating either `node.api.js` or `browser.api.js` files in the root of your project. See the [Plugin Documentation](https://github.com/nozzle/react-static/blob/master/docs/plugins.md) for more information!
