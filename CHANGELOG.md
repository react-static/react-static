# 5.5.9
#### Fixes
- Fixed a rare issue (in Gitdocs mostly) where a RouteData would not load even though routeInfo.allProps was synchronously accessible.

# 5.5.1-8
#### Fixes
- `.com` or any other suffix is no longer clipped from `siteRoot`.
- Absolute URL rewriting now takes into account `basePath` and also `src=''` attributes
- 404 component more reliably supports `RouteData` and is generally more stable.
- An `is404` prop is now available via `RouteData/withRouteData` if and when rendered on a 404 page, **regardless if it is the /404 route itself or any other route that results in a 404.**
- Fixed some hot-reloading side effects that were introduced with the new project architecture.
- Lost some weight on the node packaging. The docs and many other large files are now excluded from distribution.
- Improved the node API support with much more stability.
- Added a `key` prop to the rendered route in `react-static-routes.js` to avoid stale or mixed state for routes that happen to share the same top-level component.
- Removed complexity from the user by making the `<Routes>` component's `getComponentForPath` render prop more robust. (Check documentation if you use custom rendering for your `react-static-routes`)

# 5.5.0
#### Features
- Added a `Redirect` component and `route.redirect` option to routes.
#### Fixes
- `src='/'` paths are now also rewritten with siteRoot and basePath

# 5.4.0
#### Features
- Added Node API to React-Static via importing `react-static/node`
- Added the ability to use a custom `static.config.js` via the CLI
- Added `config.basePath` option for hosting and running react-static sites from a sub-route
- Added `config.stagingSiteRoot`, `config.stagingBasePath`, `config.devBasePath`. Used for overriding the above options in specific environments
- Added the ability to create projects using a local template location.

#### Fixes & Optimizations
- Entire repo has been reorganized and split for easier maintenance and project grokking ability.
- Template information and route data hashes are now automatically generated and collocated in a `routeInfo.js` for each route, instead of in a single location (give them massive sites some support, baby!)
- Fixed `config.siteRoot` to be more reliable, but must no longer contain a sub route (it will be stripped)
- React Router now uses `config.basePath` for its `basename` prop
- History instances now use `config.basePath` for the `basename` option
- Moved the codegen for `react-static-routes` to its own file
- Added `maximum-scale=1` to the default document component's viewport meta
- More reliable handling of path slashes throughout the codebase
- Added react `key` props to head scripts, links and preloads

# 5.2.0
#### Fixes & Optimizations
- Scrolling to a hash is now more accurate, especially if the page reflows during mid scroll.
- Added documentation website that is built with `gitdocs`. Still a few kinks to work out.
- Updated build-with site list
- All `.gitignore` files are now uniform to not include the `.` until copied during creation
- Fixed an import typo with the `sass` example
- Added a basic error logging handler for universally-code-split components
- Various upkeep items on the Netlify-CMS example
- CLI now uses `commander`
- Disabled code-splitting in dev mode. This fixes a majority of problems with react-hot-loader without requiring users to make a ton of changes to their exports.

#### Features
- CLI now supports using a `.git` address to clone for the template.

# 5.1.14
#### Fixes
- Fixed `component` style render props from not passing children

# 5.1.13
#### Features
- `Router.scrollToHashOffset` prop allows for setting an offset for hash scrolling now :)
- Added `netlify-cms` example.
#### Fixes & Optimizations
- Squashed some bugs

# 5.1.8
#### Fixes & Optimizations
- Removed the various `extract-hoc` related babel plugins in favor of the new `react-hot-loader` version 4.

# 5.1.0
#### Features
- Added `--staging` CLI argument to `react-static build` that does not perform build-time optimizations like siteRoot replacement on links assets, etc. If you are testing your site locally, you will likely want to use this option to allow your production site to be navigable on localhost.

# 5.0.0
#### Features
- Automatic Route Splitting. From here on out as long a project is using the automatic component-based static routing, all route templates will be automatically deduped and split into separate modules. These modules are statically-rendered into every page that uses them, are preloaded asynchronously with React-Static built-in prefetching utiliies, and are also loaded on demand if needed as the client navigates through your site. Carry on!
- Automatic prefetching of templates and assets. Any eligible `Link` component to a code/data-split destination will automatically queue a prefetch for the appropriate assets.
- Render prop versions of `withRouteData` and `withSiteData` are now available as `RouteData` and `SiteData`. These support inline access to their respective props, instead of having to set up an HOC. They also support all three major render prop syntaxes, so render those props however you want!. See the README for more information.
- Added a new `Loading` render prop component and a companion `withLoading` HOC component to easily display React-Static's loading state (that probably won't happen much, but still... ;).
- Added a new `Loading`/`withLoading` render prop / HOC component pair. You can render this component to gain access to the `loading` prop, which was previously only accessible via the `Router.subscribe` callback.
- Path changes now automatically scroll to the top of the page. Duration defaults to `0`ms, but can be modifed via the `scrollToTopDuration` prop on the `Router` component.
- Hash routing changes now automatically scroll to the element (or top of the page if the hash is removed but the path stays the same). Duration defaults to `800`ms, but can be modifed via the `scrollToHashDuration` prop on the `Router` component.
#### Breaking Changes
- In some previous scenarios the window's `location.search` would be taken into account when matching a path. That is now not the case. You could never previously rely on URL parameters for static paths, but now we're letting you know :)
- The `getRouteProps` and `getSiteData` HOC's have both been renamed to `withRouteData` and `withSiteData`. Using the old methods will result in a deprecation notice and a broken app. Luckily this is an easy find and replace :)
- `Router.subscribe` has been deprecated. Though, if you still need programmatic access to a loading event, you can use the new `onLoading` subscriber that functions the same way.
#### How to Upgrade
- In your components:
  - Replace all instances of `getRouteProps` with `withRouteData`
  - Replace all instances of `getSiteProps` with `withSiteData`
  - Replace all instances of `Router.subscribe` with `onLoading`, and import `onLoading`.
- In your `static.config.js`:
  - Replace all instances of `getProps` with `getData`
  - Replace `getSiteProps` with `getSiteData`
  - If you are using a custom `Document` be sure to replace the `siteProps` prop with `siteData`.
- Note: To take advantage of auto-code-splitting, you cannot use custom routing for your static routes. I suggest migrating to the automatic routing strategy asap.

# 4.8.2
#### Fixes & Optimizations
- `getRouteProps` was fixed to always have access to the router props, thus supporting `getRouteProps` as nested components instead of top-level page components.

# 4.8.1
#### Fixes & Optimizations
- Node version was rolled back to `<=6.10.0`, to allow some existing users continued usage.

# 4.8.0
#### Features
- Preact can now be used in production by setting `preact: true` in your `static.config.js`! Remember to use `ReactDOM.render` instead of `hydrate` in production too :)
- Added the `preact` example.

# 4.7.2
#### Fixes & Optimizations
- `getRouteProps` now functions as it should when it's wrapped component receives new props without remounting. (Thanks [@EmilTholin](https://github/EmilTholin)!)
- Node ~~>=7.5.0~~ `<=6.10.0` is now stated as required, instead of implied.
- When building for `node` stage, the `main` is now preferred in package imports, instead of `module`
- Better module resolution locations, which allows overriding react-static module versions by installing them locally.

# 4.7.1
#### Features
- Added Firebase Authentication example (Thanks [@deden](https://github/deden)!)
#### Fixes & Optimizations
- Better error logging for unhandled promise rejections
- Handle Routes with spaces (Thanks [@etimberg](https://github/etimberg)!)
- Add shouldPrefetch() method to avoid setting loading state  (Thanks [@chrisbrown-io](https://github/chrisbrown-io)!)
- Pass DOM props through in links (Thanks [@denis-sokolov](https://github/denis-sokolov)!)
- Pass additional CLI arguments through to getSiteData() (Thanks [@etimberg](https://github/etimberg)!)

# 4.7.0
#### Features
- Common props returned by `getRouteProps` (props that `===` one another) now promoted to **shared props** and only requested once per session. Learn more in the docs: [Automatic Data and Prop Splitting](https://github.com/nozzle/react-static#automatic-data-and-prop-splitting). Depending on your site, this may significantly decrease site bandwidth and increase both initial page load speed and subsequent page load performance.

# 4.6.0
#### Features
- `<Routes>` now accepts a render prop for custom rendering of automatic routes.
- Added `animated-routes` example.

#### Fixes & Optimizations
- `Link` and `NavLink` now properly render hash links and external links. (Thanks [@denis-sokolov](https://github/denis-sokolov)!)
- `sass` example now uses a proper webpack loader configuration for style extraction. (Thanks [@talves](https://github/talves)!)

# 4.5.1
#### Fixes & Optimizations
- `Link` and `NavLink` now properly render hash links and external links. (Thanks [@denis-sokolov](https://github/denis-sokolov)!)
- `sass` example now uses a proper webpack loader configuration for style extraction. (Thanks [@talves](https://github/talves)!)

# 4.5.0
#### Features
- Added `sass` example. (Thanks [@2metres](https://github/2metres)!)
- Added `glamorous-tailwind` example. (Thanks [@deden](https://github/deden)!)
- The `REACT_STATIC_ENV` environment variable is now used internally (and set deterministically via usage of the `start` and `build` commands) instead of `NODE_ENV`. This means you can finally set your own `NODE_ENV` variables and use tools like `cross-env`. Yay!
#### Fixes & Optimizations
- Fixed some misleading phrasing where a route component path could be assumed to be compatible with a class, function, or react component, when in fact it is the path to that. (Thanks [@Jonarod](https://github/Jonarod)!)
- `config.path.src` is now taken into account when constructing the `config.path.entry` path. (Thanks [@crubier](https://github/crubier)!)
- Added `manta.life` to list of sites built with React Static. (Thanks [@hql287](https://github/hql287)!)
- Updated the `graphql-request` example to use `react-markdown` instead of `dangerouslySetInnterHTML`. (Thanks [@hmeissner](https://github/hmeissner)!)

# 4.4.0
#### Features
- Added `graphql-request` example. (Thanks [@ChrisNLott](https://github/ChrisNLott)!)
#### Fixes & Optimizations
- Use ReactDOM.render instead of ReactDOM.hydrate in dev (Thanks [@EmilTholin](https://github.com/emiltholin)!)

# 4.3.4
#### Fixes & Optimizations
- Cordova example's `res` directory is no longer included in the npm distribution making releases and installations much faster.


# 4.3.3
#### Fixes & Optimizations
- Fixed a bug where windows users could not serve or build a project. (Thanks [@karland](https://github/karland)!)

# 4.3.2
#### Fixes & Optimizations
- Fixed a bug where some directories or files weren't being included in npm distributions


# 4.3.1
#### Fixes & Optimizations
- Fixed a bug where component names with numbers would not render propertly. (Thanks [@muloka](https://github.com/muloka)!)

# 4.3.0
#### Features
- `config.paths.devDist` can now be set to specify a different scratch output directory when in development mode.

#### Fixes & Optimizations
- `react-static-routes` imports are now relative, thus avoiding absolute path madness... hopefully? :)

# 4.2.0
#### Features
- Added Probot to the github repo! Hooray!
- Better yarn/npm colors in cli. [@cgmx](https://github.com/cgmx)
- Router now uses `componentDidCatch` to gracefully display runtime errors for you.

#### Fixes & Optimizations
- `react-static-routes` now uses dynamic template imports. [@EmilTholin](https://github.com/emiltholin)
- Helmet meta tags are more reliably extracted. [@EmilTholin](https://github.com/emiltholin)
- Config server is no longer served separately, but piggybacks on webpack dev server. [@rileylnapier](https://github.com/rileylnapier)

# 4.1.0
#### Features
- Added `config.paths`, which can now be used to customize `dist` folder location and other file locations used by react-static
- Added `onStart` hook. Fires after the first successful dev build when running `react-static start`
- Added `onBuild` hook. Fires after a successful production build when running `react-static build`
- Added `config.devServer`, which can be used to customize the configuration for the webpack-dev-server used in development. (Thanks [@rywils21](https://github.com/rywils21)!)
- Added TypeScript typings for React-Static core exports (Thanks [@D1no](https://github.com/D1no)!)
- Allow customization of dev server PORT and HOST via those environment variables. (Thanks [@rywils21](https://github.com/rywils21)!)
- `config.getRoutes` is no longer required and will default to exporting a single root path.
- Webpack configurations can now be exported and used externally. (Thanks [@crubier](https://github.com/crubier)!)
- `<Router>` component now supports a `type` prop that can be: `browser`, `hash`, or `memory`, which defines which type of `history` object to create and use internally. Useful for non-web environments or situations where your app will be accessed in a filesystem or nested domain as opposed to a web server.
- Added Redux example (Thanks [@crubier](https://github.com/crubier)!)
- Added Apollo GraphQL example (Thanks [@crubier](https://github.com/crubier)!)
- Added Redux + Apollo example (Thanks [@crubier](https://github.com/crubier)!)
- Added Typscript example (Thanks [@D1no](https://github.com/D1no)!)

#### Fixes & Optimization
- The `Document`'s `<title>` tag can now be used as a fallback to any `<title>` tag produced via the `<Head>` component. (Thanks [@EmilTholin](https://github.com/EmilTholin)!)
- Fixed a bug where not defining a 404 component resulted in an error during production build. (Thanks [@mplis](https://github.com/mplis)!)
- Fixed a bug where the webpack dev server would rebuild the app multiple times in a row when started up for the first time. (Thanks [@cgmx](https://github.com/cgmx)!)

# 4.0.0
#### Breaking Changes
- The `webpack` function in `static.config.js` has a new function signature.
  - Each function is now **not** required to return a new config object. If a falsey value is returned, the transformation will be ignored, and the next transformation will carry on as normal. Even so, avoid mutating the config object at all costs ;)
  - A new argument is now available in the `args` parameter called `defaultLoaders`:
  ```javascript
    webpack: (
      config, {
        defaultLoaders: {
          jsLoader,
          cssLoader,
          fileLoader
        }
      }
    ) => {...}
  ```
  These loaders are here for convenience. Please read the documentation for more information.

#### Features
- A dynamic code-splitting example and typescript example are now available! Huzzah!

#### Fixes & Optimizations
- Webpack files are now hashed for better cache invalidation. It's about time right?!


# 3.0.0
#### Breaking Changes
- Your `index.js` file must now export your app in NON-JSX form, eg. `export default App`, not `<App />`. With this change, builds can be faster, leaner, and have more control over the build pipeline.
- The optional `Html` component in `static.config.js` was renamed to `Document`.
- The `preRenderMeta` and `postRenderMeta` hooks in `static.config.js` have been deprecated in favor of the new `renderToHtml` hook. This is a very important change, so please check the readme if you are using these hooks!
- The new `renderToHtml` hook now uses a **mutable** meta object. This object is passed as a prop to the base `Document` component as `renderMeta` now, instead of the previous `staticMeta`.

#### Features
- New `PrefetchWhenSeen` component allows for prefetching when component becomes visible in the viewport.

#### Fixes & Optimizations
- Exporting is now up to 2x faster after switching from a dual pass to a single pass render strategy.
- Fixed a very elusive and angering bug where imported node_modules were not being shared between the node context and the node webpack build of the app used for exporting.

# 2.0.0
#### Breaking Changes
- The `webpack` function in `static.config.js` has a new function signature.
  - The new value can be an array of functions or a single function.
  - Each function passed will receive the previous resulting (or built-in) webpack config, and expect a modified or new config to be returned. See [Webpack Config and Plugins](#webpack-config-and-plugins)

#### Features
Now that the `webpack` callback accepts an array of transformer functions, the concept of plugins has been introduced. These transformer functions are applied in order from top to bottom and have total control over the webpack config. For more information see [Webpack Config and Plugins](#webpack-config-and-plugins)
```
webpack: [
  withCssLoader,
  withFileLoader
]
```

#### Fixes & Optimizations
All route exporting is now done via a node bundle that is packaged with webpack. This should dramatically increase reliability in customization and cross-platform usability.
