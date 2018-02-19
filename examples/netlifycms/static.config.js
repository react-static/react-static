import axios from 'axios'
const fs = require('fs');
const klaw = require('klaw')
const marked = require('marked');
const path = require('path')
const matter = require('gray-matter');
const moment = require('moment');

function getPosts() {
  const items = []

  // Filter function to retrieve .md files //

  let filterFn = function (item) {
    return path.extname(item) === ".md";
  }

  // Walk ("klaw") through posts directory and push file paths into posts array //

  return new Promise(resolve => {
    // Check if posts directory exists //
    if (fs.existsSync('./src/posts')) {
      klaw('./src/posts')
        .on('data', item => {
          // If markdown file, read contents //
          if (filterFn(item.path)) {
            let data = fs.readFileSync(item.path, 'utf8')
            // Convert to frontmatter object and markdown content //
            let dataObj = matter(data)
            dataObj.content = marked(dataObj.content)
            // Create slug for URL //
            dataObj.data.slug = dataObj.data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
            // Parse image file name from path //
            dataObj.data.thumbnail = dataObj.data.thumbnail.replace('/src/images/uploads/', '')
            // Push object into items array //
            items.push(dataObj)
          }
        })
        .on('error', e => {
          console.log(e)
        })
        .on('end', () => {
          // Resolve promise for async getRoutes request //
          // posts = items for below routes //
          resolve(items)
        })
    }
    // If src/posts directory doesn't exist, return items as empty array //
    else {
      resolve(items)
    }
  })
}


export default {

  getSiteData: () => ({
    title: 'React Static with Netlify CMS',
  }),

  getRoutes: async () => {

    var posts = await getPosts()

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
          path: `/post/${post.data.slug}`,
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
