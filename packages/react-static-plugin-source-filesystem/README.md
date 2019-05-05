# react-static-plugin-source-filesystem

A [React-Static](https://react-static.js.org) plugin that adds support for recursively importing routes from a directory

This means that any files in your projects `pages/` directory will be turned into static routes.

Example: 
- src/pages/index.js - would produce a route with the path of `/` and the template set to `src/pages/index.js`
- src/pages/about/us.js - would produce a route with the page of `/about/us` and the template set to `src/pages/about/us.js`

## Installation

In an existing react-static site run:

```bash
$ yarn add react-static-plugin-source-filesystem
```

Then add the plugin to your `static.config.js` with a valid `location` directory in the options:

```javascript
import path from 'path'

export default {
  plugins: [
    [
      'react-static-plugin-source-filesystem',
      {
        location: path.resolve('./src/pages'),
      },
    ],
  ],
}
```

The plugin also supports several other options if you want to fine-tune your routes and create additional ones, e.g. for pagination:

```javascript
import { makePageRoutes } from 'react-static/node'
import axios from 'axios'
import path from 'path'

export default {
  plugins: [
    'react-static-plugin-source-filesystem',
    {
      // required
      location: path.resolve('./src/posts'),
      // optional
      pathPrefix: '/blog/posts',
      createRoute: async ({ path, template, originalPath }) => ({
        // our blog post file names start with a date,
        // e.g. blog/posts/2018-10-03-hello-world
        // so let's remove those to generate simpler paths
        path: path.replace(/\d+-\d+-\d+-/, ''),
        template,
        originalPath,
        getData: async () => {
          const { joke } = await axios.get('https://icanhazdadjoke.com')
          return {
            dadJoke: joke,
          }
        },
      }),
      createGetRoutes: postRoutes => {
        return async function getRoutes() {
          return makePageRoutes({
            items: postRoutes,
            pageSize: 5,
            pageToken: 'page',
            route: {
              path: '/blog',
              template: 'src/pages/blog',
            },
            decorate: (items, pageIndex, totalPages) => ({
              getData: () => ({
                posts: items,
                currentPage: pageIndex,
                totalPages,
              }),
            }),
          })
        }
      },
    },
  ],
}
```
