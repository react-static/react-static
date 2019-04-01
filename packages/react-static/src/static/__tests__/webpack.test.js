import makeWebpackConfig from '../webpack/makeWebpackConfig'
import staticConfig from '../__mocks__/defaultConfigDevelopment.mock'

describe('webpack', () => {
  it('should return after executing plugin hooks synchronously', () => {
    const myWebpackConfig = makeWebpackConfig({
      config: staticConfig,
      stage: 'prod',
      plugins: [
        {
          hooks: {
            webpack: wpConfig => ({
              ...wpConfig,
              mode: 'development',
            }),
          },
        },
      ],
    })

    expect(myWebpackConfig.mode).toBe('development')
  })

  it('should throw if plugin hooks execute async', () => {
    expect(() =>
      makeWebpackConfig({
        config: staticConfig,
        stage: 'prod',
        plugins: [
          {
            hooks: {
              webpack: wpConfig =>
                Promise.resolve({ ...wpConfig, mode: 'development' }),
            },
          },
        ],
      })
    ).toThrow(
      'Expected hook to return a value, but received promise instead. A plugin is attempting to use a sync plugin with an async function!'
    )
  })
})
