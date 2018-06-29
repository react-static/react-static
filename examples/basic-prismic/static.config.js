import fetchData from './src/prismic/fetch'

export default {
  getSiteData: () => ({
    title: 'React Static Prismic',
  }),
  getRoutes: async () => {
    const posts = await fetchData()
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
      {
        path: '404',
        component: 'src/containers/404',
      },
    ]
  },
}
