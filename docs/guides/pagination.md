# Pagination

Pagination in React Static is no different than any other route, it's just a matter of how you get there. When exporting your routes, you are expected to create a separate route for each page if needed, and only pass data to that route for the items on it.

Here is a very simple proof of concept function that demonstrates how to do this:

```javascript
import axios from 'axios'
import { makePageRoutes } from 'react-static/node'

export default {
  getSiteData: () => ({
    title: 'React Static',
  }),
  getRoutes: async () => {
    // Fetch Posts
    const { data: posts } = await axios.get(
      'https://jsonplaceholder.typicode.com/posts'
    )
    // Fetch Users
    const { data: users } = await axios.get(
      'https://jsonplaceholder.typicode.com/users'
    )

    // Group posts by UserID
    const postsByUserID = {}
    posts.forEach(post => {
      postsByUserID[post.userId] = postsByUserID[post.userId] || []
      postsByUserID[post.userId].push(post)
    })

    return [
      // Make an index route for every 5 blog posts
      ...makePageRoutes({
        items: posts,
        pageSize: 5,
        pageToken: 'page', // use page for the prefix, eg. blog/page/3
        route: {
          // Use this route as the base route
          path: 'blog',
          template: 'src/pages/blog',
        },
        decorate: (posts, i, totalPages) => ({
          // For each page, supply the posts, page and totalPages
          getData: () => ({
            posts,
            currentPage: i,
            totalPages,
          }),
        }),
      }),
      // Make the routes for each blog post
      ...posts.map(post => ({
        path: `/blog/post/${post.id}`,
        template: 'src/containers/Post',
        getData: () => ({
          post,
          user: users.find(user => user.id === post.userId),
        }),
      })),
    ]
  },
}
```

To explain what is happening above, we are making an array of `10` posts for every page, including the first page of the blog. Each of these array's will be fed to the same `src/containers/Blog` component, but will be given a `.../page/2` or whatever number corresponds to that page of data. Since only the posts needed for that page are passed, we avoid duplicated data per page!

Of course, you're free to build your pagination routes however you'd like! This is just one possible solution.
