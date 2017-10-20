export default function (config) {
  config.module.rules = config.module.rules.concat([
    {
      loader: 'url-loader',
      test: /\.(svg|jpg|jpeg|png|gif|mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
      query: {
        limit: 10000,
        name: 'static/[name].[hash:8].[ext]',
      },
    },
  ])
  return config
}
