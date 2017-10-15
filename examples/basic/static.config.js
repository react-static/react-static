import axios from 'axios'
import React, { Component } from 'react'

export default {
  getSiteProps: () => ({
    title: 'React Static',
  }),
  getRoutes: async () => {
    const { data: posts } = await axios.get('https://jsonplaceholder.typicode.com/posts')
    return [
      {
        path: '/',
        component: 'src/containers/Home',
      },
      {
        path: '/about',
        component: 'src/containers/About',
      },
      {
        path: '/blog',
        component: 'src/containers/Blog',
        getProps: () => ({
          posts,
        }),
        children: posts.map(post => ({
          path: `/post/${post.id}`,
          component: 'src/containers/Post',
          getProps: () => ({
            post,
          }),
        })),
      },
      {
        is404: true,
        component: 'src/containers/404',
      },
    ]
  },
  Html: class CustomHtml extends Component {
    render () {
      const { Html, Head, Body, children } = this.props
      return (
        <Html lang="en-US">
          <Head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="stylesheet" href="/app.css" />
          </Head>
          <Body>{children}</Body>
        </Html>
      )
    }
  },
}
