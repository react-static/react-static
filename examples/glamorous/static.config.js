/* eslint-disable react/no-danger */
import axios from 'axios'
import React, { Component } from 'react'
import { renderStatic } from 'glamor/server'

export default {
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
  postRenderMeta: async html => ({
    glamorousData: renderStatic(() => html),
  }),
  Html: class CustomHtml extends Component {
    render () {
      const {
        Html,
        Head,
        Body,
        children,
        staticMeta: { glamorousData: { css } = {} } = {},
      } = this.props

      return (
        <Html>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <style dangerouslySetInnerHTML={{ __html: css }} />
          </Head>
          <Body>{children}</Body>
        </Html>
      )
    }
  },
}
