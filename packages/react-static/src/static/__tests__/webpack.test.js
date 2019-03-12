import { webpackConfig } from '../webpack'
import staticConfig from '../__mocks__/defaultConfigDevelopment.mock'

const createConfigWithWebpackHook = hook => {
  const hooks = { webpack: hook }
  return Object.assign({}, staticConfig, { plugins: [{ hooks }] })
}

describe('webpack', () => {
  describe('when called synchronously', () => {
    it('should return after executing plugin hooks sync', () => {
      const config = createConfigWithWebpackHook(wpConfig =>
        Object.assign(wpConfig, { mode: 'development' })
      )

      const myWebpackConfig = webpackConfig({
        config,
        stage: 'prod',
        sync: true,
      })

      expect(myWebpackConfig.mode).toBe('development')
    })

    it('should throw if plugin hooks execute async', () => {
      const config = createConfigWithWebpackHook(wpConfig =>
        Promise.resolve(Object.assign(wpConfig, { mode: 'development' }))
      )

      expect(() =>
        webpackConfig({
          config,
          stage: 'prod',
          sync: true,
        })
      ).toThrow('Cannot run async hooks in sync mode')
    })
  })

  describe('when called asynchronously', () => {
    it('should resolve after executing plugin hooks async', async () => {
      const config = createConfigWithWebpackHook(wpConfig =>
        Promise.resolve(Object.assign(wpConfig, { mode: 'development' }))
      )

      const myWebpackConfig = await webpackConfig({
        config,
        stage: 'prod',
      })

      expect(myWebpackConfig.mode).toBe('development')
    })
  })
})
