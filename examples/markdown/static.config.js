import jdown from 'jdown'

export default {
  getSiteData: () => ({
    title: 'React Static',
  }),
  getRoutes: async () => {
    const {posts, home, about} = await jdown('content');
    return [
      {
        path: '/',
        component: 'src/containers/Home',
				getData: () => ({
					...home,
				})
      },
      {
        path: '/about',
        component: 'src/containers/About',
				getData: () => ({
					about,
				})
      },
      {
        path: '/blog',
        component: 'src/containers/Blog',
        getData: () => ({
          posts,
        }),
        children: posts.map(post => ({
          path: `/post/${post.slug}`,
          component: 'src/containers/Post',
          getData: () => ({
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
}
