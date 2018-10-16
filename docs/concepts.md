# Core Concepts

- [Overview](#overview)
- [CSS and CSS-in-JS](#css-and-css-in-js)
- [Code, Data, and Prop Splitting](#code-data-and-prop-splitting)
- [Writing universal, "node-safe" code](#writing-universal-node-safe-code)
- [Environment Variables](#environment-variables)
- [Building your site for production](#building-your-site-for-production)
- [Continuous Integration](#continuous-integration)
- [Hosting](#hosting)
- [Using a CMS](#using-a-cms)
- [Rebuilding your site with Webhooks](#rebuilding-your-site-with-webhooks)
- [404 Handling](#404-handling)
- [Non-Static Routing](#non-static-routing)
- [Webpack Customization and Plugins](#webpack-customization-and-plugins)
- [Using Preact in Production](#using-preact-in-production)
- [Pagination](#pagination)
- [Browser Support](#browser-support)
- [Using React-Static in AWS Lambda](#using-react-static-in-aws-lambda)

# Overview

React-Static is different from most React-based static-site generators. It follows a very natural flow from data all the way to static files, then finally a progressively enhanced react-app. Not only does this provide a safe separation of concern, but by keeping the data pipelining and react templating as separate as possible, your site can be visualized and built in a single pass as a "function of state" from the data you pass it.

### Dev Stage

1.  **All of the data your site needs to render** is gathered up-front in your `static.config.js` by any means you want. This data can come from markdown files, headless CMS's, graphql endpoints, etc.
2.  Using your data, you define or generate **every static route** for your site and supply the appropriate data to each one.
3.  Simultaneously, you provide each route with the component that should be used to render it.
4.  Using React-Static's components like `RouteProps` and `SiteProps` you can access the data for each route and use it to render your site!
5.  React-Static can then export every page in your site with tenacious speed and accuracy.
    preview

### Client Stage

1.  On first page load, only the bare minimum of assets are downloaded to show the content as quickly as possible. This includes the page specific HTML and CSS that were exported at build time.
2.  Simultaneously, only the necessary bootstrap code, template code and data needed to mount react for that particular route are **pushed** to the browser.
3.  React invisibly mounts over the rendered HTML
4.  The rest of the website is optimistically pre-cached
5.  All further navigation is seemingly instantaneous!

![Flow Chart](https://github.com/nozzle/react-static/raw/master/media/flow.png)

# CSS and CSS-in-JS

**React-Static ships with a built-in css style-loader,** frequently found in most webpack configurations. You can easily import `css` files and they will be automatically appended to the head of the document when that route is visited.

**React-Static supports all CSS-in-JS libraries.** Each library and solution usually requires a slightly different approach to server-side rendering, so we have provided ample hooks for you to integrate into.

### Existing Templates

The following templates contain the bare-minimum for each css approach to function properly with server-side rendering. You can start with these templates using the `react-static create` CLI command, or transfer the logic to an existin project (pay close attention to the `static.config.js` file if that is the case).

- [emotion](https://github.com/nozzle/react-static/tree/master/examples/emotion)
- [styled-components](https://github.com/nozzle/react-static/tree/master/examples/styled-components)
- [sass](https://github.com/nozzle/react-static/tree/master/examples/sass)
- [styled-jsx](https://github.com/nozzle/react-static/tree/master/examples/styled-jsx)
- [material-ui](https://github.com/nozzle/react-static/tree/master/examples/material-ui)
- [less-antdesign](https://github.com/nozzle/react-static/tree/master/examples/less-antdesign)
- [tailwind-css](https://github.com/nozzle/react-static/tree/master/examples/tailwind-css)

### Integrating New CSS-in-JS Libraries

Most, if not all, CSS-in-JS libraries require that you to **extract** the styles used in your app during the usage of `ReactDOMServer.renderToString` or `ReactDOMServer.renderToStaticMarkup`, then inject them into the head of your `index.html`.

React-Static allows you to decorate its HTML and Document rendering processes by using the static.config.js [`renderToHtml`](/docs/config/#rendertohtml) and [`Document`](/docs/config/#document) properties. Below are the relevant pieces used in the existing styled-components template:

```javascript
// examples/styled-components/static.config.js

import { ServerStyleSheet } from 'styled-components'

export default {
  renderToHtml: (render, Comp, meta) => {
    const sheet = new ServerStyleSheet()
    // The styles are collected from each page component
    const html = render(sheet.collectStyles(<Comp />))
    // The collected page styles are stored in `meta`
    meta.styleTags = sheet.getStyleElement()
    // Return the html string for the page
    return html
  },
  Document: ({ Html, Head, Body, children, renderMeta }) => (
    // `renderMeta.styleTags` contains the styles we need to inject
    // into the head of each page.
    <Html>
      <Head>{renderMeta.styleTags}</Head>
      <Body>{children}</Body>
    </Html>
  )
}
```

Each CSS-in-JS library is different so please consult the server-side rendering instructions of your specific library for more information.

# Code, Data, and Prop Splitting

React Static also has a very unique and amazing way of requesting the least amount of data to display any given page at just the right moment. React splits code and data based on these factors:

- **Routes** - Under the hood, React Static is automatically handling route splitting for you. Other than listing your routes in your `static.config.js`, you don't have to do anything!
- **Route Data & Shared Data** - Each route's `getData` function results in a separate data file for each route being stored (usually). While exporting this data however, each individual key of every data object is checked against each other for `===` equality. When a data key is found to be used in more than one route, it is promoted to a _shared data fragment_ and stored in its own file.
- **Manual Code Splitting with Universal** - React Static comes built in with support for [`react-universal-component`](https://github.com/faceyspacey/react-universal-component). This means aside from the automatic code splitting that React Static offers, you can also manually code split very large components if you choose to do so. See the ["About" page in the dynamic-imports example](https://github.com/nozzle/react-static/blob/master/examples/dynamic-imports/src/containers/About.js) to see how it works and how easy it is!

#### Why is all of this cool?

By bundling page templates and data into separate optimized files, your site avoids wastefully loading duplicate assets for pages that share some or all of their assets with others. This decreases the overall bandwidth your site uses and also considerably speeds up your site's ability to serve content as fast as possible!

#### Shared Route Data Example

Shared Route Data can be difficult to understand without an example. So, consider a dynamic menu structure that is present only on some of your pages, but not all of them. In this case, the menu data should only be loaded on the pages that use it, and only once per session (cached), instead of on every page individually.

```javascript
import axios from 'axios'

export default {
  getRoutes: async () => {
    const supportMenu = getMyDynamicMenu()
    return [
      {
        path: '/',
        component: 'src/containers/Home',
      },
      {
        path: '/docs',
        component: 'src/containers/Docs',
        getData: async () => ({
          supportMenu // Used once here
        })
      },
      {
        path: '/help',
        component: 'src/containers/Help',
        getData: async () => ({
          supportMenu, // Used again here! Since this `supportMenu` is equal `===` to the
          // `supportMenu` used in the docs route, both instances will be promoted to
          // a shared prop and only loaded once per session!
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

**An example of what not to do**
<br/>

```javascript
import axios from 'axios'

export default {
  getRoutes: async () => {
    const supportMenu = getMyDynamicMenuFromMyCMS()
    return [
      {
        path: '/',
        component: 'src/containers/Home'
      },
      {
        path: '/docs',
        component: 'src/containers/Docs',
        getData: async () => ({
          supportMenu
        })
      },
      {
        path: '/help',
        component: 'src/containers/Help',
        getData: async () => ({
          supportMenu: { ...supportMenu } // Even though this supportMenu object
          // is exactly the same as the original, it is not the actual original.
          // This would not work!
        })
      }
    ]
  }
}
```

# Writing universal, "node-safe" code

Because React-Static code is both used in the browser and node (during build), it's very, very important that your code be "universal" or in other words "node safe". Most of us are used to writing javascript from the browser's perspective, so there are some things to watch out for:

- Check before using `window`, `document` or browser only APIs. Since these objects do not technically exist in the node environment, make sure you check that they exist before attempting to use them. The easiest way to do this is to keep code that relies on them in `componentDidMount` or inside a condition, eg.

```javascript
if (typeof document !== 'undefined') {
  // use document
}
```

- Ensure any external libraries that rely on `window`, `document` or browser specific APIs are not imported in the node environment. Not all libraries that use these objects require them immediately, but some of them do. If you encounter one of these libraries, you'll see it error when you attempt to `build` your site for production. To fix these errors, you can stub and require the library conditionally:

```javascript
let CoolLibrary = {} // you can stub it to whatever you need to to make it run in node.
if (typeof document !== 'undefined') {
  CoolLibrary = require('cool-library').default
}
```

# Environment Variables

During your adventures, you may need to access specific environment variables. The following environment variables are available across all of react-static, including your app:

- `process.env.REACT_STATIC_ENV` can equal one of:
  - `production` - the environment is being built via webpack for **production**
  - `development` - the environment is being built via webpack for **development**
  - `node` - the environment is being built via **node** for **SSR**

# Building your site for production

Before you deploy your site to production, we suggest doing a few things:

- Enter a `siteRoot` in your `static.config.js`. A `siteRoot` allows React Static to optimize your assets and links for an absolute location. It also allows your site to function normally if you happen to host it in a non-root location like `https://mysite.com/my-static-site/`.
- Test your build locally. To do this, you can run `react-static build --staging`. This will build a production version of your site that is still able to run normally on `localhost`.
- If you find any bugs in production, you can turn off code uglification by also adding the `--debug` flag to your build command. This may help you track down any bugs.

Once you're ready to build, run the `react-static build` command to kick off a production build. The production files will be located in the `dist` directory (or the custom `dist` directory you've defined). Simply upload the contents of this directory to your host!

# Continuous Integration

If your static site has static content that is changing often, you may want to set up **continuous integration** through some sort of service. The most common pairing you'll see is [using Netlify with a linked Github repo](https://www.netlify.com/blog/2016/09/29/a-step-by-step-guide-deploying-on-netlify/). This allows your site to automatically rebuild whenever your code changes. How nice! If you have some type of custom hosting solution, you could also look into using [Travis CI](https://travis-ci.org/) to build and deploy your site to a custom location. The possibilities are endless!

# Hosting

Deploying a static site has never been easier on today's internet! There are so many solutions where you can host static files for very cheap, sometimes even for free. This is, in fact, one of the great benefits to hosting a static site: there is no server to maintain and scalability is less of a problem. Here is a list of static-site hosting solutions we recommend:

- [Netlify](https://netlify.com) (Our favorite!)
- [Github Pages](https://pages.github.com/)
- [Heroku](http://blog.teamtreehouse.com/deploy-static-site-heroku)
- [AWS (S3 + Cloudfront)](https://aws.amazon.com/getting-started/projects/host-static-website/)
- [Google Cloud Platform (GCS)](https://cloud.google.com/storage/docs/hosting-static-website)

# Using a CMS

A content management system (CMS) can greatly increase your ability to organize and contribute. At React Static, we love using [Contentful](https://contentful.com) and [GraphCMS](https://graphcms.com), but you can always visit [https://headlesscms.org/](https://headlesscms.org/) for help on picking the best one for you!

# Rebuilding your site with Webhooks

If you choose to use a CMS, you're probably going to ask yourself, "How will my site rebuild when content in my CMS changes?" The answer is **webhooks**! Most if not all modern CMS's provide webhooks. These are simply URL's that get pinged when something changes in the CMS. These could be any URL, but are used most productively when they are hooked up to a continuous integration or hosting service to achieve automatic rebuilds when anything in your CMS changes.

Examples:

- [Using Contentful Webhooks](https://www.contentful.com/developers/docs/concepts/webhooks/)
- [Using GraphCMS Webhooks](https://graphcms.com/docs/concepts/#webhooks)
- [Rebuilding on Netlify via Webhooks](https://www.netlify.com/docs/webhooks/)

# 404 Handling

Making a 404 page in React Static **is required** and extremely simple. Either (1) place a `404.js` file in the `pages` directory, or (2) define a route where `pathL '404'` and a `component` path to render that route. At both build-time and runtime, the rendered result of this `component` will be used for any routes that are not found. Most static-site servers also default to use the `/404.html` page when a static route cannot be found.

# Non-Static Routing

Sometimes you may want to handle routes (including sub-routes) that should not be statically rendered. In that case, you can treat `Routes` like any other `react-router` route and use any of the routing components you normally use with `react-router`. You can see this concept in action in the [`non-static-routing` example](https://github.com/nozzle/react-static/blob/master/examples/non-static-routing)

**Important Notes**

- React-Router components are available via the `react-static` import. There is no need to import them via `react-router`!
- Any custom React-Router components must be placed before `<Routes>` if you want them to match. The `<Routes>` component is a catch all `<Route path='*' />` handler, so anything below it will result in a 404!
- The `Routes` component is in fact a `react-router` `Route` component, so it can be placed and used normally within components like `<Switch>`!
- No `html` file is exported for non-static routes, which means the server won't have a file to serve and will most-likely default to serving the `404.html` file of your site. If this is the case (and it normally is), you should make your 404 route only render after mount. An example of this is shown in the [`non-static-routing` example](https://github.com/nozzle/react-static/blob/master/examples/non-static-routing/src/containers/NonStatic.js)

Example - Handling a non-static admin route:

```javascript
// App.js
import { Root, Routes, Route, Switch } from 'react-static'

import Admin from 'containers/Admin'

export default () => (
  <Root>
    <Switch>
      <Route path="/admin" component={Admin} /> // If /admin path is matched
      <Routes /> // Otherwise, fall back to static route handlers
    </Switch>
  </Root>
)
```

To learn more about how `react-router` components work, visit [React-Router's Documentation](https://reacttraining.com/react-router/web/guides/philosophy)

# Webpack Customization and Plugins

React-Static ships with a wonderful default webpack config, carefully tailored for react development. It should support a majority of use-cases on its own. But, in the case you do need to modify the webpack configuration, you can create a `node.api.js` file in your project and use the handy [webpack API](/docs/config.md/#webpack) to extend it!

# Using Preact in Production

Who wouldn't want to make their JS bundle as small as possible? Simply set `preact: true` in your `static.config.js` and React-Static will ship preact with your site instead of React. This can significantly reduce the size of your app and load times!

**Example**

```javascript
// static.config.js
export default {
  preact: true
}
```

**Note**: If updating a project not originally based on the `preact` template, you will need to update the render method of your app to always use `ReactDOM.render` and not `ReactDOM.hydrate`. [See the preact template for an example of this](https://github.com/nozzle/react-static/blob/master/examples/preact/src/index.js#L14)

**Important**
Due to the complexity of maintaining a fully tooled development experience, React is still used in development mode if `preact` is set to `true`. This ensures that stable hot-reloading tooling, dev tools, etc. are used. This is by no means permanent though! If you know what it takes to emulate React Static's development environment using Preact tooling, please submit a PR!

# Pagination

Pagination in react-static is no different than any other route, it's just a matter of how you get there. When exporting your routes, you are expected to create a separate route for each page if needed, and only pass data to that route for the items on it.

Here is a very simple proof of concept function that demonstrates how to do this:

```javascript
export default {
  getRoutes: async () => {
    const { data: posts } = await axios.get(
      'https://jsonplaceholder.typicode.com/posts'
    )
    return [
      {
        path: '/',
        component: 'src/containers/Home'
      },
      ...makePageRoutes({
        items: posts,
        pageSize: 10,
        pageToken: 'page',
        route: {
          path: '/blog',
          component: 'src/containers/Blog'
        },
        decorate: items => ({
          getData: () => ({
            posts: items
          })
        })
      })
    ]
  }
}

function makePageRoutes({
  items,
  pageSize,
  pageToken = 'page',
  route,
  decorate
}) {
  const itemsCopy = [...items] // Make a copy of the items
  const pages = [] // Make an array for all of the different pages

  while (itemsCopy.length) {
    // Splice out all of the items into separate pages using a set pageSize
    pages.push(itemsCopy.splice(0, pageSize))
  }

  // Move the first page out of pagination. This is so page one doesn't require a page number.
  const firstPage = pages.shift()

  const routes = [
    {
      ...route,
      ...decorate(firstPage) // and only pass the first page as data
    },
    // map over each page to create an array of page routes, and spread it!
    ...pages.map((page, i) => ({
      ...route, // route defaults
      path: `${route.path}/${pageToken}/${i + 2}`,
      ...decorate(page)
    }))
  ]

  return routes
}
```

To explain what is happening above, we are making an array of `10` posts for every page, including the first page of the blog. Each of these array's will be fed to the same `src/containers/Blog` component, but will be given a `.../page/2` or whatever number corresponds to that page of data. Since only the posts needed for that page are passed, we avoid duplicated data per page!

Of course, you're free to build your pagination routes however you'd like! This is just one possible solution.

# Browser Support

React-Static dually relies on lowest common browser support between React itself and your choice of Babel polyfills.

- All latest versions of modern browsers (Chrome, Firefox, Safari) are supported out of the box.
- Internet Explorer is supported, but requires using `babel-polyfill` to work (mainly relying on the `Promise` polyfill)

To extend `static.config.js` for compatibility with Internet Explorer, first install `babel-polyfill`:
`yarn add babel-polyfill`

Then add the following webpack object to the default export of `static.config.js` to extend the existing webpack configuration:

```javascript
webpack: (config, { stage }) => {
  if (stage === 'prod') {
    config.entry = ['babel-polyfill', config.entry]
  } else if (stage === 'dev') {
    config.entry = ['babel-polyfill', ...config.entry]
  }
  return config
},
```

# Using React-Static in AWS Lambda

You can run **React-Static** in **AWS-Lambda** without any modifications.

As the Filesystem is *readonly* in Serverless Environments we just have to configure the `paths` to write to `/tmp`.

```javascript
//static.config.js
const isBuild = process.env.NODE_ENV === "production";

let pathConfig = {};

if (isBuild) {
  pathConfig = {
    temp: os.tmpdir() + "/tmp",
    dist: os.tmpdir() + "/dist",
    devDist: os.tmpdir() + "/dev-server",
    assets: os.tmpdir() + "/dist"
  };
}

export default {
  paths: pathConfig,
  //...
}
```

You also need to set the Babel Cache Variable `BABEL_CACHE_PATH` to (e.g.) `/tmp/babel-cache.json`.

The most simple lambda function would look like this:

```javascript

//set the BABEL_CACHE_PATH as early as possible
process.env.BABEL_CACHE_PATH="/tmp/babel-cache.json"

const rs = require("react-static/lib/commands/build").default;

const handler = async (event, context) => {
  await rs();

  // upload "paths.dist" (/tmp/dist) to some S3 Bucket here
};
```