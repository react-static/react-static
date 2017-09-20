# react-static

React Static turns your react app into a super-charged static website, optimized for extreme speed an instant user satisfaction.

## Features
- Static route generation
- Asynchronous routes
- Sitemap & RSS generation
- Preloading
- Dev server

## The Challenge
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

#### static.config.js
A `static.config.js` file is required. It must export an object with the following interface:
```javascript
module.exports = {
  componentPath: './src/App',
  // The location of your top-level
  // react component (not your index.js file)

  postRenderData: async staticHTML => {...}
  // An optional asynchronous function that is passed the statically
  // rendered HTML for each page and returns a javascript object
  // that will be made available to a custom Html component

  Html: ({ children, scripts, data }) => (
    <html>
      <head></head>
      <body>
        {children}
        {scripts}
      </body>
    </html>
  ), // An optional custom React component that renders the base
  // Html for every page, including the dev server. Must utilize
  // `children` and `scripts` for react-static to work. The optional
  // `data` prop refers to any data you potentially returned from
  // the `postRenderData` function.

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
  }]
  // getRoutes is a required, asynchronous function that should
  // resolve an array of route objects. It is also passed a `prod`
  // boolean indicating whether this is a production build or not.
}
```
