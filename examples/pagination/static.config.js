import React, { Component } from 'react'
import axios from 'axios'
import { ServerStyleSheet } from 'styled-components'
import { makePageRoutes } from 'react-static/node'

export default {
  getSiteData: () => ({
    title: 'React Static',
  }),
  getRoutes: async () => {
    // Fetch Posts
    const { data: posts } = await axios.get('https://jsonplaceholder.typicode.com/posts')
    // Fetch Users
    const { data: users } = await axios.get('https://jsonplaceholder.typicode.com/users')

    // Group posts by UserID
    const postsByUserID = {}
    posts.forEach(post => {
      postsByUserID[post.userId] = postsByUserID[post.userId] || []
      postsByUserID[post.userId].push(post)
    })

    return [
      // Make an index route for every 5 blog posts
      ...makePageRoutes({
        items: posts,
        pageSize: 5,
        pageToken: 'page', // use page for the prefix, eg. blog/page/3
        route: {
          // Use this route as the base route
          path: 'blog',
          component: 'src/pages/blog',
        },
        decorate: (posts, i, totalPages) => ({
          // For each page, supply the posts, page and totalPages
          getData: () => ({
            posts,
            currentPage: i,
            totalPages,
          }),
        }),
      }),
      // Make the routes for each blog post
      ...posts.map(post => ({
        path: `/blog/post/${post.id}`,
        component: 'src/containers/Post',
        getData: () => ({
          post,
          user: users.find(user => user.id === post.userId),
        }),
      })),
      {
        path: '/users',
        getData: () => ({
          users,
        }),
        children: users.map(user => ({
          path: `/${user.username}`,
          component: 'src/containers/User',
          getData: () => ({
            user,
            posts: postsByUserID[user.id],
          }),
        })),
      },
    ]
  },
  renderToHtml: (render, Comp, meta) => {
    const sheet = new ServerStyleSheet()
    const html = render(sheet.collectStyles(<Comp />))
    meta.styleTags = sheet.getStyleElement()
    return html
  },
  Document: class CustomHtml extends Component {
    render () {
      const {
        Html, Head, Body, children, renderMeta,
      } = this.props

      return (
        <Html>
          <Head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            {renderMeta.styleTags}
          </Head>
          <Body>{children}</Body>
        </Html>
      )
    }
  },
}
