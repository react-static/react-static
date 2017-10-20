import { NODE_MODULES } from '../paths'

export default function () {
  return [
    {
      test: /\.(js|jsx)$/,
      exclude: NODE_MODULES,
      use: [
        {
          loader: 'babel-loader',
        },
      ],
    },
  ]
}
