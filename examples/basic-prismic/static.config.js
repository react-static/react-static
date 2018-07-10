import fetchData from './src/prismic/fetch'

export default {
  getSiteData: () => ({
    title: 'React Static Prismic',
  }),
  getRoutes: async () => {
    const posts = await fetchData()
    return [
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
