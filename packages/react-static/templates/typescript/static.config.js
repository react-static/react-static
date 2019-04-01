import axios from 'axios'
import path from 'path'

export default {
  entry: path.join(__dirname, 'src', 'index.tsx'),
  getSiteData: () => ({
    title: 'React Static',
  }),
  getRoutes: async () => {
    const { data: posts } = await axios.get(
      'https://jsonplaceholder.typicode.com/posts',
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
    'react-static-plugin-typescript',
    [
      require.resolve('react-static-plugin-source-filesystem'),
      {
        location: path.resolve('./src/pages'),
      },
    ],
  ],
}
