import { reloadRoutes } from 'react-static/node'
import jdown from 'jdown'
import chokidar from 'chokidar'

let watcher

export default {
  onStart: () => {
    watcher = chokidar
      .watch('content', { ignoreInitial: true })
      .on('all', () => reloadRoutes())
  },
  onBuild: () => {
    if (watcher) watcher.close()
  },
  getSiteData: () => ({
    title: 'React Static',
  }),
  getRoutes: async () => {
    const { posts, home, about } = await jdown('content')
    return [
      {
        path: '/',
        getData: () => ({
          ...home,
        }),
      },
      {
        path: '/about',
        getData: () => ({
          about,
        }),
      },
      {
        path: '/blog',
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
    ]
  },
}
