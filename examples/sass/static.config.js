import axios from 'axios'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

export default {
  getSiteProps: () => ({
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
        getProps: () => ({
          posts,
        }),
        children: posts.map(post => ({
          path: `/post/${post.id}`,
          component: 'src/containers/Post',
          getProps: () => ({
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
  webpack: (config, { stage, defaultLoaders }) => {
    const extractSass = new ExtractTextPlugin({
      filename: 'styles.[hash:8].css',
      disable: stage === 'dev',
    })
    config.module.rules = [{
      oneOf: [
        defaultLoaders.jsLoader,
        {
          test: /\.s(a|c)ss$/,
          use: extractSass.extract({
            // use style-loader in development
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  minimize: stage === 'prod',
                },
              },
              {
                loader: 'sass-loader',
                options: { includePaths: ['src/'] },
              },
            ],
          }),
        },
        defaultLoaders.fileLoader,
      ],
    }]
    config.plugins.push(extractSass)
    return config
  },
}
