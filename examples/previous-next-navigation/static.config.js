import axios from 'axios'

export default {
  getSiteData: () => ({
    title: 'React Static',
  }),
  getRoutes: async () => {
    const { data: posts } = await axios.get('https://jsonplaceholder.typicode.com/posts')
    return [
      {
        path: '/blog',
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
      }
    ]
  },
}
