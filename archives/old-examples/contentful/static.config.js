import fetchPosts from './src/contenful/fetchPosts'

export default {

  getSiteData: () => ({
    title: 'React Static with Contentful CMS',
  }),
  getRoutes: async () => {
    const posts = await fetchPosts()
    
    return [
      {
        path: '/blog',
        getData: () => ({
          posts
        }),
        children: posts.map(post => ({
          path: `/post/${post.slug}`,
          component: 'src/components/Post',
          getData: () => ({
            post,
          }),
        })),
      },
    ]
  },
}
