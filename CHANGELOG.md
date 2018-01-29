# 5.0.0
#### Features & Breaking
- Automatic Route Splitting. From here on out as long a project is using the automatic component-based static routing, all route templates will be automatically deduped and split into separate modules. These modules are statically-rendered into every page that uses them, are preloaded asynchronously with React-Static built-in prefetching utiliies, and are also loaded on demand if needed as the client navigates through your site. Carry on!
- Automatic prefetching of templates and assets. Any eligible `Link` component to a code/data-split destination will automatically queue a prefetch for the appropriate assets.
- Render prop versions of `withRouteProps` and `withSiteProps` are now available as `RouteProps` and `SiteProps`. These support inline access to their respective props, instead of having to set up an HOC. They also support all three major render prop syntaxes, so render those props however you want!. See the README for more information.
- Added a new `Loading` render prop component and a companion `withLoading` HOC component to easily display React-Static's loading state (that probably won't happen much, but still... ;).
- Added a new `Loading`/`withLoading` render prop / HOC component pair. You can render this component to gain access to the `loading` prop, which was previously only accessible via the `Router.subscribe` callback.
- Path changes now automatically scroll to the top of the page. Duration defaults to `0`ms, but can be modifed via the `scrollToTopDuration` prop on the `Router` component.
- Hash routing changes now automatically scroll to the element (or top of the page if the hash is removed but the path stays the same). Duration defaults to `800`ms, but can be modifed via the `scrollToHashDuration` prop on the `Router` component.
#### Breaking Changes
- The `getRouteProps` and `getSiteProps` HOC's have both been renamed to `withRouteProps` and `withSiteProps`. Using the old methods will result in a deprecation notice and a broken app. Luckily this is an easy find and replace :)
- `Router.subscribe` has been deprecated. Though, if you still need programmatic access to a loading event, you can use the new `onLoading` subscriber that functions the same way.

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
- Pass additional CLI arguments through to getSiteProps() (Thanks [@etimberg](https://github/etimberg)!)

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
