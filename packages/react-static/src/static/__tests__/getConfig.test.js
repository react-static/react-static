// Usually imports should go first, but mocks should precede imports:
/* eslint-disable import/first */
const mockPlugin = jest.fn()
// When it can't find the plugin file and NODE_ENV === 'test',
// the plugin directory will be set to `mock-plugin`
jest.mock('mock-plugin/node.api.js', () => ({ default: mockPlugin }), {
  virtual: true,
})
jest.mock('fs-extra', () => {
  const fsExtra = require.requireActual('fs-extra')
  return Object.assign({}, fsExtra, {
    pathExistsSync: path => {
      // We've mocked this plug-in, so even though it does not exist according to `fs-extra`,
      // it can be require()d. Thus, make fs-extra say that it does exist:
      if (path === 'mock-plugin/node.api.js') {
        return true
      }

      return fsExtra.pathExistsSync(path)
    },
  })
})

import getConfig, { buildConfig } from '../getConfig'
import defaultConfigDevelopment from '../__mocks__/defaultConfigDevelopment.mock'
import defaultConfigProduction from '../__mocks__/defaultConfigProduction.mock'

jest.mock('path', () => ({
  resolve: (stringOne = '/', stringTwo = '') => `${stringOne}${stringTwo}`,
  join: (stringOne, stringTwo) => `${stringOne}/${stringTwo}`,
  dirname: () => 'root/',
}))

jest.mock('../../utils/getDirname', () => () => './dirname/')

const testConfiguration = (configuration, configurationMock) => {
  expect(configuration).toMatchObject(configurationMock)
  expect(configuration.getSiteData).toBeInstanceOf(Function)
  expect(configuration.renderToHtml).toBeInstanceOf(Function)
  expect(configuration.getRoutes).toBeInstanceOf(Function)
}

describe('buildConfig', () => {
  let reactStaticEnviroment
  let reactStaticPrefetchRate
  let reactStaticDisableRoutePreFixing
  let spyProcess

  beforeEach(() => {
    reactStaticEnviroment = process.env.REACT_STATIC_ENV
    reactStaticPrefetchRate = process.env.REACT_STATIC_PREFETCH_RATE
    reactStaticDisableRoutePreFixing =
      process.env.REACT_STATIC_DISABLE_ROUTE_PREFIXING
    spyProcess = jest.spyOn(process, 'cwd').mockImplementation(() => './root/')
  })

  describe('default configuration', () => {
    test('when REACT_STATIC_ENV is development', async () => {
      process.env.REACT_STATIC_ENV = 'development'

      const configuration = await buildConfig()

      testConfiguration(configuration, defaultConfigDevelopment)
    })

    it('when REACT_STATIC_ENV is production', async () => {
      process.env.REACT_STATIC_ENV = 'production'

      const configuration = await buildConfig()

      testConfiguration(configuration, defaultConfigProduction)
    })
  })

  test('REACT_STATIC_PREFETCH_RATE is set by the prefetchRate (default)', async () => {
    process.env.REACT_STATIC_PREFETCH_RATE = null

    await buildConfig()

    expect(process.env.REACT_STATIC_PREFETCH_RATE).toBe('5')
  })

  test('REACT_STATIC_PREFETCH_RATE is set by the prefetchRate (from config)', async () => {
    process.env.REACT_STATIC_PREFETCH_RATE = null

    await buildConfig({ prefetchRate: 10 })

    expect(process.env.REACT_STATIC_PREFETCH_RATE).toBe('10')
  })

  afterEach(() => {
    process.env.REACT_STATIC_ENV = reactStaticEnviroment
    process.env.REACT_STATIC_PREFETCH_RATE = reactStaticPrefetchRate
    process.env.REACT_STATIC_DISABLE_ROUTE_PREFIXING = reactStaticDisableRoutePreFixing

    spyProcess.mockRestore()
  })
})

describe('getConfig', () => {
  let spyProcess

  beforeEach(() => {
    spyProcess = jest.spyOn(process, 'cwd').mockImplementation(() => './root/')
  })

  describe('when no path or configuration is not provided', () => {
    it('should return a configuration using default file', async () => {
      // mapped by the moduleNameMapper in package.js -> src/static/__mocks__/static.config.js
      // default path is 'static.config.js'
      const configuration = await getConfig()

      testConfiguration(configuration, defaultConfigProduction)
    })
  })

  describe('when provided a path to configuration', () => {
    it('should return a configuration using file provided', async () => {
      // mapped by the moduleNameMapper in package.json -> src/static/__mocks__/static.config.js
      const configuration = await getConfig('./path/to/static.config.js')

      testConfiguration(configuration, {
        ...defaultConfigProduction,
        entry: 'path/to/entry/index.js',
      })
    })

    it('should pass on plugin options to those plugins', async () => {
      mockPlugin.mockReset()
      // mapped by the moduleNameMapper in package.json -> src/static/__mocks__/configWithPluginWithOptions.mock.js
      await getConfig('./path/to/configWithPluginWithOptions.mock.js')

      expect(mockPlugin.mock.calls[0]).toEqual([{ mockOption: 'some-option' }])
    })
  })

  afterEach(() => {
    spyProcess.mockRestore()
  })
})
