import path from 'path'
import axios from 'axios'

export default {
  siteRoot: 'https://tannerlinsley.com',
  // maxThreads: 1,
  getRoutes: async () => {
    const { data: posts } = await axios.get(
      'https://jsonplaceholder.typicode.com/posts'
    )

    return [
      {
        path: '/blog',
        getData: () => ({
          posts,
        }),
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
      'react-static-plugin-source-directory',
      {
        location: path.resolve('./src/pages'),
      },
    ],
  ],
}
