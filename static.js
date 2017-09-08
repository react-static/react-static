import React from 'react'
//
import App from './src/App'

export default {
  // A very sane way of defining all possible routes, easily macro'd
  routes: [
    {
      path: '/',
    },
    {
      path: '/blog/',
      // also serves as an interface for things like a sitemap.xml
      nofollow: true,
      noindex: true,
      queries: [
        {
          param: 'page',
          value: '1',
        },
        {
          param: 'page',
          value: '2',
        },
      ],
      // you can also define these routes at the root level as absolute routes,
      // the `children` syntax just happens to be more convenient in most cases
      children: [
        {
          path: '/post1',
        },
        {
          path: '/post2',
        },
        {
          path: '/post3',
        },
      ],
    },
  ],
  // the entry component for your App
  component: App,
  // An optional custom root component.
  // You can use things like react-helmet here :)
  Html: ({ children, scripts }) =>
    (<html lang="en">
      <head />
      <body>
        {children}
        {scripts}
      </body>
    </html>),
}
