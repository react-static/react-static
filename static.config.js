import React from 'react'
import reactTreeWalker from 'react-tree-walker'
//

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
  componentPath: './src/App',
  // An optional custom root component.
  // You can use things like react-helmet here :)
  Html: ({ children, scripts }) =>
    (<html lang="en">
      <head />
      <body>
        <div id="root">
          {children}
        </div>
        {scripts}
      </body>
    </html>),
  preBuild: async () =>
    // copyFromDir('./content')
    [
      {
        path: '/',
        props: {},
      },
      {
        path: '/blog/',
        props: {
          posts: [
            {
              title: 'post1',
              body: 'Well hello there post1!',
            },
            {
              title: 'post2',
              body: 'Well hello there post2!',
            },
            {
              title: 'post3',
              body: 'Well hello there post3!',
            },
          ],
        },
        children: [
          {
            path: '/post1',
            props: {
              post: {
                title: 'Post 1!',
                body: 'Well hello there Post 1!',
              },
            },
          },
          {
            path: '/post2',
            props: {
              post: {
                title: 'Post 2!',
                body: 'Well hello there Post 2!',
              },
            },
          },
          {
            path: '/post3',
            props: {
              post: {
                title: 'Post 3!',
                body: 'Well hello there Post 3!',
              },
            },
          },
        ],
      },
    ],
  // preRoute: async ({ component }) => {
  //   let initialProps
  //   const perNode = async (element, instance) => {
  //     if (instance && typeof instance.getInitialProps === 'function') {
  //       initialProps = await instance.getInitialProps()
  //     }
  //     return true
  //   }
  //
  //   await reactTreeWalker(component, perNode)
  //   return initialProps
  // },
}
