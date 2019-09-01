# Core Concepts

- [Code and Data Splitting](#code-and-data-splitting)
- [Writing universal, "node-safe" code](#writing-universal-node-safe-code)
- [Environment Variables](#environment-variables)
- [Building your site for production](#building-your-site-for-production)
- [Continuous Integration](#continuous-integration)
- [Hosting](#hosting)
- [Using a CMS](#using-a-cms)
- [Rebuilding your site with Webhooks](#rebuilding-your-site-with-webhooks)
- [404 Handling](#404-handling)
- [Dynamic Routing](#dynamic-routing)
- [Webpack Customization and Plugins](#webpack-customization-and-plugins)
- [Pagination](#pagination)
- [Browser Support](#browser-support)

# Code and Data Splitting

React Static also has a very unique and amazing way of requesting the least amount of data to display any given page at just the right moment. React splits code and data based on these factors:

- **Route Templates** - Under the hood, React Static automatically code splits your route templates for you. Other than assigning templates to routes in your `static.config.js`, you don't have to do anything else! Magic!
- **Route Data** - Each route's `getData` function results in a separate data file for each route being stored as JSON next to the routes HTML on export. This covers the 90% use case for data splitting, but if you want even more control and want to optimize repeated data across routes, you can use the `sharedData` and `createSharedData` api explained below.
- **Site Data** - For data that is needed in every (or most) routes, you can pass it in the `config.getSiteData` function and make it accessible to any page in your entire site!.
- **Manual Code Splitting with Universal** - React Static comes built in with support for [`react-universal-component`](https://github.com/faceyspacey/react-universal-component). This means aside from the automatic code splitting that React Static offers, you can also manually code split very large components if you choose to do so. See the ["About" page in the dynamic-imports example](https://github.com/react-static/react-static/blob/master/examples/dynamic-imports/src/containers/About.js) to see how it works and how easy it is!

### Shared Route Data (Advanced)

**Most projects don't need shared route data**. There are cases where it won't make sense to place an individual copy of the same piece of data in every route's `getData` function, nor do you want to load that data into every page with `siteData`. To solve this issue, you can use the [**sharedData**](./api.md#createSharedData) api to share a single piece of data between many routes with only a single JSON file.

# Writing universal, "node-safe" code

Because React-Static code is both used in the browser during runtime and in node during build and export, it is very important that **ALL** your code be "universal" or in other words "node safe". Most of us are used to writing javascript from the browser's perspective, so there are some things to watch out for:

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

During your adventures, you may need to access specific React Static environment variables in your application. React Static uses the same `NODE_ENV` variable that other build systems use to determine what environment you are currently in. In addition, React Static also relies on the presence of `document` to determine whether production code is being executed in node or not.

### Detecting `development` and `production` modes

```javascript
if (process.env.NODE_ENV === 'development') {
  // Development mode (only executed in )
} else {
  // We are in production mode
}
```

### Detecting `browser` and `node` environments

```javascript
if (typeof document !== 'undefined') {
  // We are in a browser context
} else {
  // We are in a node context
}
```

# Building your site for production

Before you deploy your site to production, we suggest doing a few things:

- Test your build locally. To do this, you can run `react-static build --staging`. This will build a production version of your site that is still able to be served normally on `localhost`.
- If you find any bugs in production, you can also turn on debug mode adding the `--debug` flag to your build command. This will provide source-maps and better stack traces during testing.

Once you're ready to build for distribution, run the `react-static build` command to run a build in production mode. The distributable production files will be located in the `dist` directory. Then, simply upload the contents of this directory to your host!

# Continuous Integration

If your static site has static content that is changing often, you may want to set up **continuous integration** through some sort of service. The most common pairing you'll see is [using Netlify with a linked Github repo](https://www.netlify.com/blog/2016/09/29/a-step-by-step-guide-deploying-on-netlify/). This allows your site to automatically rebuild whenever your code changes. How nice! If you have some type of custom hosting solution, you could also look into using [Travis CI](https://travis-ci.org/) to build and deploy your site to a custom location. The possibilities are endless!

# Hosting

Deploying a static site has never been easier on today's internet! There are so many solutions where you can host static files for very cheap, sometimes even for free. This is, in fact, one of the great benefits to hosting a static site: there is no server to maintain and scalability is less of a problem. Here is a list of static-site hosting solutions we recommend:

- [Netlify](https://netlify.com) (Our favorite!)
- [Zeit now](https://zeit.co/now)
- [Github Pages](https://pages.github.com/)
- [Heroku](http://blog.teamtreehouse.com/deploy-static-site-heroku)
- [AWS (S3 + Cloudfront)](https://aws.amazon.com/getting-started/projects/host-static-website/)
- [Google Cloud Platform (GCS)](https://cloud.google.com/storage/docs/hosting-static-website)

# Using a CMS

A content management system (CMS) can greatly increase your ability to organize and contribute. At React Static, we love using [GraphCMS](https://graphcms.com), [Contentful](https://contentful.com) and [Netlify CMS](https://www.netlifycms.org/), but you can always visit [https://headlesscms.org/](https://headlesscms.org/) (built with React Static 😉) for help on picking the best one for you!

# Rebuilding your site with Webhooks

If you choose to use a CMS, you're probably going to ask yourself, "How will my site rebuild when content in my CMS changes?" The answer is **webhooks**! Most if not all modern CMSs provide webhooks. These are simply URLs that get pinged when something changes in the CMS. These could be any URL, but are used most productively when they are hooked up to a continuous integration or hosting service to achieve automatic rebuilds when anything in your CMS changes.

Examples:

- [Using Contentful Webhooks](https://www.contentful.com/developers/docs/concepts/webhooks/)
- [Using GraphCMS Webhooks](https://graphcms.com/docs/concepts/#webhooks)
- [Rebuilding on Netlify via Webhooks](https://www.netlify.com/docs/webhooks/)

# 404 Handling

Making a 404 page in React Static is extremely simple, but depending on your server can be served a few different ways:

- Define a route with the following:

```javascript
{
  path: '404',
  template: 'path/to/your/404/component.js'
}
```

- If using the [Source Filesystem plugin](https://github.com/react-static/react-static/tree/master/packages/react-static-plugin-source-filesystem), just place a `404.js` react component in the `pages` directory. No other configuration necessary!

**How is the 404 component used?**

- Your 404 component is exported to a root level `404.html` file at build time. Most servers will automatically use this for routes that don't exist.
- If the `<Routes />` component is rendered on a route with no matching static route or template, the 404 component will be displayed.

# Dynamic Routing

Sometimes you may want to handle routes (including sub-routes) that should not be statically rendered. In that case, you can treat `Routes` like any other component and only render if when no dynamic routes are matched. This can be seen in the [Dynamic Routes with Reach Router Guide](/docs/guides/dynamic-routes-reach-router.md), but should be possible with just about any client side react router.

# Webpack Customization and Plugins

React-Static ships with a wonderful default webpack config, carefully tailored for react development. It should support a majority of use-cases on its own. But, in the case you do need to modify the webpack configuration, you can create a `node.api.js` file in your project and use the handy [webpack API](/docs/config.md/#webpack) to extend it!

# Pagination

Please see our [Pagination Guide](/docs/guides/pagination.md)!

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
