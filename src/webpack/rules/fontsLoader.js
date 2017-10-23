export default function () {
  return [
    {
      loader: 'url-loader',
      test: /\.(png|woff|woff2|eot|ttf|svg)$/,
      query: {
        limit: 10000,
        name: 'static/[name].[hash:8].[ext]',
      },
    },
  ]
}
