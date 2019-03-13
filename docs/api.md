# API

React-Static is packed with awesome components and hooks to help you be productive. Some are required for React-Static to work properly, others are available merely for your convenience:

- [Routes](#routes)
- [useRouteData](#useroutedata)
- [useSiteData](#usesitedata)
- [useScroller](#usescroller)
- [Head](#head)
- [Prefetch](#prefetch)
- [prefetch](#prefetch-)
- [scrollTo](#scrollto)

## `Routes`

React Static handles all of your routing for you using `react-router` under the hood. All you need to do is import `Routes` and specify where you want to render them:

```javascript
// App.js
import { Root, Routes } from 'react-static'

export default () => (
  <Root>
    <Routes />
  </Root>
)
```

The routes that will be rendered are the **routes** returned by the `getRoutes` function of this config.

##### Custom `Routes` Rendering

Occasionally, you may need to render the automatic `<Routes>` component in a custom way. The most common use-case is illustrated in the [animated-routes](https://github.com/nozzle/react-static/tree/master/examples/animated-routes) example transitions. To do this, utilize a render prop:

```javascript
import { Root, Routes } from 'react-static'

// This is the default renderer for `<Routes>`
const RenderRoutes =

export default () => (
  <Root>
    <Routes>
      {({ getComponentForPath }) => {
        // The pathname is used to retrieve the component for that path
        let Comp = getComponentForPath(window.location.href)
        // The component is rendered!
        return <Comp />
      }}
    </Routes>
  </Root>
)
```

**Render Props** - These special props are sent to your rendered component or render function:

- `getComponentForPath(pathname) => Component` - Takes a pathname and returns the component (if it exists) to render that path. Returns `false` if no component is found.

## `useRouteData`

Via suspense, the `useRouteData` hook asynchronously provides the results of a **routes's** `getData` function as defined in your `static.config.js`.

These examples show all of the different syntaxes you can use.

**static.config.js**

```javascript
module.exports = {
  getRoutes: () => [
    {
      path: '/top-100-songs',
      getData: async () => ({
        songs: await SpotifyAPI.getTopSongs(100),
      }),
    },
  ],
}
```

**TopSongs.js**

```javascript
import { useRouteData } from 'react-static'

export default () => {
  const { songs } = useRouteData()
  return (
    <div>
      <h1>Top 100 Spotify Songs</h1>
      <ul>
        {songs.map(song => (
          <li key={song.id}>{song.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

## `useSiteData`

Via suspense, the `useSiteData` hook asynchronously provides the results of the `getSiteData` function as defined in your `static.config.js`.

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
import { useSiteData } from 'react-static'

export default () => {
  const { siteTitle, metaDescription } = useSiteData()

  return (
    <div>
      Welcome to {siteTitle}! {metaDescription}
    </div>
  )
}
```

## `useScroller`

- Automatically smooth-scrolls to hash links
- Automatically scrolls to the top of the page on route changes

#### Options

| Property               | type         | Default       | description                                                       |
| ---------------------- | ------------ | ------------- | ----------------------------------------------------------------- |
| `context`              | `DOMelement` | document.body | The dom element to scroll                                         |
| `disabled`             | `bool`       | false         | Toggles all scrolling behavior                                    |
| `autoScrollToTop`      | `bool`       | true          | Toggles scroll-to-top behavior                                    |
| `autoScrollToHash`     | `bool`       | true          | Toggles scroll-to-hash behavior                                   |
| `scrollToTopDuration`  | `integer`    | 0             | The duration in ms for the scroll-to-top animation                |
| `scrollToHashDuration` | `integer`    | 800           | The duration in ms for the scroll-to-hash animation               |
| `scrollToHashOffset`   | `integer`    | 0             | The vertical offset of the top of the window from the hash target |

#### Example

```javascript
// App.js
import { useScroller, Routes } from 'react-static'

export default () => {
  useScroller()

  return (
    <div>
      <Routes />
    </div>
  )
}
```

## `Head`

`Head` is a react component for managing tags in the document's `head`. Use it to update meta tags, title tags, etc.

- It can be used anywhere in your app.
- It can be used in multiple places at the same time.
- For more information, see the [React-Helmet library](https://github.com/nfl/react-helmet) that React Static uses to accomplish this.

#### Example

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

## `usePrefetch`

The `usePrefetch` hook binds the prefetching of a specific `path`'s assets to the visibility of an element. When the ref's element becomes visible in the viewport, the template and data required to render the route for the `path` will be prefetched.

This increases the chance that if the user then navigates to that route, they will not have to wait for the required data to load.

```javascript
import { useRef } from 'react'
import { usePrefetch } from 'react-static'

export default () => {
  // Use it to create a ref
  const myRef = usePrefetch('/blog')

  // or pass your own ref
  const myRef = useRef()
  usePrefetch('./blog', myRef)

  return (
    <Link to="/blog" ref={myRef}>
      Go to blog
    </Link>
  )
}
```

Note: It's critical that the `ref.current` value passed to `usePrefetch` resolves to an actual dom element. Otherwise an error will be thrown.

## `prefetch`

`prefetch` is an imperative version of the `usePrefetch` hook that you can use anywhere in your code.

Example:

```javascript
import { prefetch } from 'react-static'

const myFunc = async () => {
  const data = await prefetch('/blog')
  console.log('The preloaded data:', data)
}
```

## `scrollTo`

This **async** method can be used to scroll to any given height or DOMElement you pass it.

- Arguments
  - `height: int || DOMElement` - The height from the top of the page or dom element you would like to scroll to.
  - `options{}` - An optional settings object
    - `duration: Int` - The duration of the animation in milliseconds
    - `offset: Int` - The negative or positive offset in pixels
    - `context: DOMElement` - The container element that will be scrolled. Defaults to `body` via `window.scrollTo`
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
    duration: 2000,
  })
  console.log('Done scrolling!')
}
```
