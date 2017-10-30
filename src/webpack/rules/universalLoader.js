export default function () {
  return [
    {
      loader: 'url-loader',
      query: {
        limit: 10000,
        name: 'static/[name].[hash:8].[ext]',
      },
    },
  ]
}
