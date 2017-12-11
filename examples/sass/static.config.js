import axios from 'axios'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

const SASS_INCLUDE_PATHS = ['src/']

let sassUse = []
if (process.env.NODE_ENV === 'development') {
  sassUse = [
    { loader: 'style-loader' },
    { loader: 'css-loader' },
    { loader: 'sass-loader' },
  ]
} else {
  sassUse = ExtractTextPlugin.extract({
    use: [
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
          minimize: true,
          sourceMap: false,
        },
      },
      {
        loader: 'sass-loader',
        options: { includePaths: SASS_INCLUDE_PATHS },
      },
    ],
  })
}

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
  webpack: (config, { defaultLoaders }) => {
    config.module.rules = [{
      oneOf: [
        {
          test: /\.s(a|c)ss$/,
          use: sassUse,
        },
        defaultLoaders.cssLoader,
        defaultLoaders.jsLoader,
        defaultLoaders.fileLoader,
      ],
    }]
    return config
  },
}
