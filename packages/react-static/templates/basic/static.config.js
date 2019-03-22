import path from 'path'
import axios from 'axios'
import { createSharedData } from 'react-static/node'

export default {
  siteRoot: 'https://tannerlinsley.com',
  getRoutes: async () => {
    const { data: posts } = await axios.get(
      'https://jsonplaceholder.typicode.com/posts'
    )

    const sharedPosts = createSharedData(posts)

    return [
      // {
      //   path: '/devblog',
      //   template: 'src/pages/blog',
      //   getData: () => ({
      //     posts,
      //   }),
      //   sharedData: {
      //     sharedPosts,
      //   },
      // },
      {
        path: '/blog',
        getData: () => ({
          posts,
        }),
        sharedData: {
          sharedPosts,
        },
        children: posts.map(post => ({
          path: `/post/${post.id}`,
          template: 'src/containers/Post',
          getData: () => ({
            post,
          }),
        })),
      },
    ]
  },
  plugins: [
    '../../../react-static-plugin-react-router',
    '../../../react-static-plugin-sitemap',
    [
      // Automatically uilds routes from a directory
      'react-static-plugin-source-directory',
      {
        location: path.resolve('./src/pages'),
      },
    ],
  ],
}
