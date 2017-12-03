import { request } from 'graphql-request'

const GRAPHCMS_API = 'https://api.graphcms.com/simple/v1/starterBlog'

const query = `{
  allPosts {
    id
    slug
    title
    coverImage {
      handle
    }
    content
  }
  allAuthors {
    id
    name
    avatar {
      handle
    }
    bibliography
  }
}`

export default {
  getRoutes: async () => {
    const {
      allPosts,
      allAuthors,
    } = await request(GRAPHCMS_API, query)

    return [
      {
        path: '/',
        component: 'src/pages/Home',
        getProps: () => ({
          allPosts,
        }),
        children: allPosts.map(post => ({
          path: `/post/${post.slug}`,
          component: 'src/pages/Post',
          getProps: () => ({
            post,
          }),
        })),
      },
      {
        path: '/about',
        component: 'src/pages/About',
        getProps: () => ({
          allAuthors,
        }),
      },
      {
        is404: true,
        component: 'src/pages/404',
      },
    ]
  },
}
