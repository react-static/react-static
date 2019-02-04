# Incremental Builds

Incremental builds for extremely large sites can be very valuable. They allow you to update only a portion of your site that has changed, remove content, and even switch route templates around (as long as the templates were previously bundled in the app)

Incremental builds allow you to:

- Remove Routes
- Add New Routes (only existing templates can be used)
- Update Existing Routes (only existing templates can be used)

### Requirements

If you are using either **source control** or **a hosting service that idempotently or deterministically updates your site** (eg. Netlify, or any other non-imperative file-upload service):

- You must commit your projects `dist` directory. Not only do you need to store your site as a cache, but these directories also contain build artifacts that are necessary for incremental builds to function correctly (eg. app bundles, templates, plugins, etc)

To perform an incremental build:

- Ensure your `dist` directory and any other build artifacts are up to date with the latest version of your site
- Detect the incremental build in your config and only return the routes you would like to add, update, or remove.
- Perform an export with the `incremental` flag:

```sh
react-static export --incremental
```

### Example

Below is a basic example that:

- Updates the `blog` route to not have any `posts` data (and updates the exported html)
- Adds a new blog post at `blog/post/boom`
- Removes the `blog/post/3` route

```javascript
import axios from 'axios'

const boomPost = {...}

export default {
  getSiteData: () => ({
    title: 'React Static',
  }),
  getRoutes: async ({ incremental }) => {
    // Detect incremental mode
    if (incremental) {
      return [
        {
          path: '/blog',
          getData: () => ({
            posts: [], // Update the posts data
          }),
          children: [
            {
              path: '/post/boom'
              component: 'src/containers/Post',
              getData: () => ({
                post: boomPost,
              }),
            }
            {
              path: '/post/3',
              remove: true, // Flag for removal
            },
          ],
        },
      ]
    }

    const { data: posts } = await axios.get(
      'https://jsonplaceholder.typicode.com/posts'
    )

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
```
