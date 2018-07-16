import axios from 'axios'

export default {
  getSiteData: () => ({
    title: 'React Static',
  }),
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
        getData: () => ({
          posts,
        }),
        children: posts.map((post, index) => ({
          path: `/post/${post.id}`,
          component: 'src/containers/Post',
          getData: () => ({
            previousPost: { 
              title: posts[index - 1] ? posts[index - 1].title : '',
              path: (post.id < 1) ? '' : `/blog/post/${post.id - 1}`
            },
            nextPost: { 
              title: posts[index + 1] ? posts[index + 1].title : '',
              path: `/blog/post/${post.id + 1}`
            }, 
            post
          })
        })) 
      },
      { 
        is404: true,
        component: 'src/containers/404'
      }
    ]
  },
}
