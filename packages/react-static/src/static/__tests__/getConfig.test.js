import path from 'path'
import getConfig, { buildConfig } from '../getConfig'

const testConfiguration = (configuration, configurationMock) => {
  expect(configuration).toMatchObject(configurationMock)
  expect(configuration.getSiteData).toBeInstanceOf(Function)
  expect(configuration.getRoutes).toBeInstanceOf(Function)
}

const defaultConfig = {
  packageConfig: {},
}

describe('buildConfig', () => {
  let reactStaticEnviroment
  let reactStaticPrefetchRate
  let reactStaticDisableRoutePreFixing
  let spyProcess

  const defaultConfigDevelopment = require('../__mocks__/config.development.mock.js')
    .default
  const defaultConfigProduction = require('../__mocks__/config.production.mock.js')
    .default

  beforeEach(() => {
    reactStaticEnviroment = process.env.REACT_STATIC_ENV
    reactStaticPrefetchRate = process.env.REACT_STATIC_PREFETCH_RATE
    reactStaticDisableRoutePreFixing =
      process.env.REACT_STATIC_DISABLE_ROUTE_PREFIXING
    spyProcess = jest.spyOn(process, 'cwd').mockImplementation(() => './root/')
  })

  describe('default configuration', () => {
    test('when REACT_STATIC_ENV is development', () => {
      process.env.REACT_STATIC_ENV = 'development'

      const state = buildConfig({})

      testConfiguration(state.config, defaultConfigDevelopment)
    })

    it('when REACT_STATIC_ENV is production', () => {
      process.env.REACT_STATIC_ENV = 'production'

      const state = buildConfig({})

      testConfiguration(state.config, defaultConfigProduction)
    })
  })

  test('REACT_STATIC_PREFETCH_RATE is set by the prefetchRate (default)', () => {
    process.env.REACT_STATIC_PREFETCH_RATE = null

    buildConfig({})

    expect(process.env.REACT_STATIC_PREFETCH_RATE).toBe('5')
  })

  test('REACT_STATIC_PREFETCH_RATE is set by the prefetchRate (from config)', () => {
    process.env.REACT_STATIC_PREFETCH_RATE = null

    buildConfig({}, { prefetchRate: 10 })

    expect(process.env.REACT_STATIC_PREFETCH_RATE).toBe('10')
  })

  afterEach(() => {
    process.env.REACT_STATIC_ENV = reactStaticEnviroment
    process.env.REACT_STATIC_PREFETCH_RATE = reactStaticPrefetchRate
    process.env.REACT_STATIC_DISABLE_ROUTE_PREFIXING = reactStaticDisableRoutePreFixing

    spyProcess.mockRestore()
  })

  describe('assetsPath is correct', () => {
    test('when no user-supplied assetsPath exists', () => {
      const { config } = buildConfig({}, { assetsPath: undefined })

      expect(config.assetsPath).toBe('')
    })
    test('when relative user-supplied assetsPath exists without trailing slash', () => {
      const { config } = buildConfig({}, { assetsPath: '/relative-path' })

      expect(config.assetsPath).toBe('/relative-path/')
    })

    test('when relative user-supplied assetsPath exists with trailing slash', () => {
      const { config } = buildConfig({}, { assetsPath: '/relative-path/' })

      expect(config.assetsPath).toBe('/relative-path/')
    })

    test('when absolute user-supplied assetsPath exists without trailing slash', () => {
      const { config } = buildConfig(
        {},
        { assetsPath: 'https://example.com/assets' }
      )

      expect(config.assetsPath).toBe('https://example.com/assets/')
    })

    test('when absolute user-supplied assetsPath exists with trailing slash', () => {
      const { config } = buildConfig(
        {},
        { assetsPath: 'https://example.com/assets/' }
      )

      expect(config.assetsPath).toBe('https://example.com/assets/')
    })
  })

  describe('publicPath is absolute', () => {
    test('when user supplies a site root', () => {
      const { config } = buildConfig({}, { siteRoot: 'http://example.com' })
      expect(config.publicPath).toBe('http://example.com/')
    })

    test('when user supplies a basePath', () => {
      const { config } = buildConfig({}, { basePath: 'dist' })
      expect(config.publicPath).toBe('/dist/')
    })

    test('when user supplies a site root and a basePath', () => {
      const { config } = buildConfig(
        {},
        { siteRoot: 'http://example.com', basePath: 'dist' }
      )
      expect(config.publicPath).toBe('http://example.com/dist/')
    })
  })
})

describe('getConfig', () => {
  let spyProcess

  const defaultConfigProduction = require('../__mocks__/config.production.mock.js')
    .default

  beforeEach(() => {
    spyProcess = jest.spyOn(process, 'cwd').mockImplementation(() => './root/')
  })

  describe('when no path or configuration is not provided', () => {
    it('should return a configuration using default file', async () => {
      const state = await getConfig(defaultConfig)

      testConfiguration(state.config, defaultConfigProduction)
    })
  })

  describe('when provided a path to configuration', () => {
    it('should find the configuration file using any supported extension', async () => {
      const state = await getConfig({
        configPath: path.resolve(
          './src/static/__mocks__/static.config.jsx.mock.jsx'
        ),
      })

      testConfiguration(state.config, defaultConfigProduction)
      expect(state.config.Document).toBeInstanceOf(Function) // React component
    })

    it('should pass on plugin options to those plugins', async () => {
      await getConfig({
        configPath: path.resolve(
          './src/static/__mocks__/config.with-plugin.mock.js'
        ),
      })
    })
  })

  xdescribe('when called with an asynchronous plugin', () => {
    xit('should throw an error', () => {
      // TODO mock / inject a promise-plugin

      expect(() => getConfig(defaultConfig)).toReject(
        'Expected hook to return a value, but received promise instead. A plugin is attempting to use a sync plugin with an async function!'
      )
    })
  })

  afterEach(() => {
    spyProcess.mockRestore()
  })
})
