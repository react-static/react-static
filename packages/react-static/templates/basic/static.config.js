import axios from 'axios'

export default {
  getSiteData: () => ({
    title: 'React Static',
  }),
  getRoutes: async ({ stage, incremental }) => {
    const { data: posts } = await axios.get(
      'https://jsonplaceholder.typicode.com/posts'
    )
    return incremental
      ? [
          {
            path: '/blog',
            getData: () => ({
              posts: [{}],
            }),
          },
        ]
      : [
          {
            path: '/blog',
            getData: () => ({
              posts,
            }),
            children: posts.map(post => ({
              path: `/post/${post.id}`,
              component: 'src/containers/Post',
              getData: () => ({
                post,
              }),
            })),
          },
        ]
  },
}
