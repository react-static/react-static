import path from 'path'
import axios from 'axios'
import { createSharedData, makePageRoutes } from 'react-static/node'

//

const routeSize = Number(process.env.REACT_STATIC_TEST_SIZE || 100000)

if (!process.env.REACT_STATIC_THREAD) {
  console.log()
  console.log(`Testing ${routeSize} routes`)
}

export default {
  // maxThreads: 1,
  getRoutes: async () => {
    const { data: posts } = await axios.get(
      'https://jsonplaceholder.typicode.com/posts'
    )

    const allPosts = []

    const sidebarInfo = createSharedData({
      foo: 'bar',
    })

    let i = 0
    while (i < routeSize) {
      i++
      const post = posts[i % posts.length]
      allPosts.push({
        ...post,
        id: i,
        body: `${post.body} ${i}`,
      })
    }

    return [
      ...(!process.env.PAGINATION
        ? [
            {
              path: 'blog',
              getData: () => ({
                posts: allPosts,
              }),
              sharedData: {
                sidebarInfo,
              },
            },
          ]
        : makePageRoutes({
            items: allPosts,
            pageSize: 50,
            pageToken: 'page', // use page for the prefix, eg. blog/page/3
            route: {
              // Use this route as the base route
              path: 'blog',
              template: 'src/pages/blog', // template is required, since we are technically generating routes
            },
            decorate: (posts, i, totalPages) => ({
              // For each page, supply the posts, page and totalPages
              getData: () => ({
                posts,
                currentPage: i,
                totalPages,
              }),
              sharedData: {
                sidebarInfo,
              },
            }),
          })),
      // Make the routes for each blog post
      ...allPosts.map(post => ({
        path: `blog/post/${post.id}`,
        template: 'src/containers/Post',
        getData: () => ({
          post,
        }),
        sharedData: {
          sidebarInfo,
        },
      })),
    ]
  },
  plugins: [
    require.resolve('react-static-plugin-reach-router'),
    process.env.STYLE_SYSTEM === 'emotion' &&
      require.resolve('react-static-plugin-emotion'),
    process.env.STYLE_SYSTEM === 'styled-components' &&
      require.resolve('react-static-plugin-styled-components'),
    [
      require.resolve('react-static-plugin-source-filesystem'),
      {
        location: path.resolve('./src/pages'),
      },
    ],
  ].filter(Boolean),
}
