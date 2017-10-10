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
      },
      {
        path: '/about',
      },
      {
        path: '/blog',
        getProps: () => ({
          posts,
        }),
        children: posts.map(post => ({
          path: `/post/${post.id}`,
          getProps: () => ({
            post,
          }),
        })),
      },
    ]
  },
  Html: class CustomHtml extends Component {
    render () {
      const { Html, Head, Body, children } = this.props
      return (
        <Html lang="en-US">
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="stylesheet" href="/app.css" />
          </Head>
          <Body>{children}</Body>
        </Html>
      )
    }
  },
}
