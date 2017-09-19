import { ROOT, NODE_MODULES } from './paths'

export default [
  {
    test: /\.(js|jsx)$/,
    include: ROOT,
    exclude: NODE_MODULES,
    use: [
      {
        loader: 'babel-loader',
      },
    ],
  },
]
