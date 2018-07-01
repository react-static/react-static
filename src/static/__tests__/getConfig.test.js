import getConfig, {
  cutPathToRoot,
  trimLeadingAndTrailingSlashes,
  buildConfigation,
} from '../getConfig'

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

describe('cutPathToRoot', () => {
  it('should return a root of the path', () => {
    expect(cutPathToRoot('./root/path/to/')).toBe('./root')
  })
})

describe('trimLeadingAndTrailingSlashes', () => {
  it('should return a String with the leading and trailing slash trimmed', () => {
    expect(trimLeadingAndTrailingSlashes('/path/to/')).toBe('path/to')
  })
})

describe('buildConfigation', () => {
  let reactStaticEnviroment
  let reactStaticPrefetchRate
  let reactStaticDisableRouteInfoWarning
  let reactStaticDisableRoutePreFixing
  let spyProcess

  beforeEach(() => {
    reactStaticEnviroment = process.env.REACT_STATIC_ENV
    reactStaticPrefetchRate = process.env.REACT_STATIC_PREFETCH_RATE
    reactStaticDisableRouteInfoWarning = process.env.REACT_STATIC_DISABLE_ROUTE_INFO_WARNING
    reactStaticDisableRoutePreFixing = process.env.REACT_STATIC_DISABLE_ROUTE_PREFIXING
    spyProcess = jest.spyOn(process, 'cwd').mockImplementation(() => './root/')
  })

  describe('default configuration', () => {
    test('when REACT_STATIC_ENV is development', () => {
      process.env.REACT_STATIC_ENV = 'development'

      const configuration = buildConfigation()

      testConfiguration(configuration, defaultConfigDevelopment)
    })

    it('when REACT_STATIC_ENV is production', () => {
      process.env.REACT_STATIC_ENV = 'production'

      const configuration = buildConfigation()

      testConfiguration(configuration, defaultConfigProduction)
    })
  })

  test('REACT_STATIC_PREFETCH_RATE is set by the prefetchRate (default)', () => {
    process.env.REACT_STATIC_PREFETCH_RATE = null

    buildConfigation()

    expect(process.env.REACT_STATIC_PREFETCH_RATE).toBe('3')
  })

  test('REACT_STATIC_PREFETCH_RATE is set by the prefetchRate (from config)', () => {
    process.env.REACT_STATIC_PREFETCH_RATE = null

    buildConfigation({ prefetchRate: 10 })

    expect(process.env.REACT_STATIC_PREFETCH_RATE).toBe('10')
  })

  test('REACT_STATIC_DISABLE_ROUTE_INFO_WARNING is set by the disableRouteInfoWarning (default)', () => {
    process.env.REACT_STATIC_DISABLE_ROUTE_INFO_WARNING = null

    buildConfigation()

    expect(process.env.REACT_STATIC_DISABLE_ROUTE_INFO_WARNING).toBe('false')
  })

  test('REACT_STATIC_DISABLE_ROUTE_INFO_WARNING is set by the disableRouteInfoWarning (from config)', () => {
    process.env.REACT_STATIC_DISABLE_ROUTE_INFO_WARNING = null

    buildConfigation({ disableRouteInfoWarning: true })

    expect(process.env.REACT_STATIC_DISABLE_ROUTE_INFO_WARNING).toBe('true')
  })

  test('REACT_STATIC_DISABLE_ROUTE_PREFIXING is set by the disableRouteInfoWarning (default)', () => {
    process.env.REACT_STATIC_DISABLE_ROUTE_PREFIXING = null

    buildConfigation()

    expect(process.env.REACT_STATIC_DISABLE_ROUTE_PREFIXING).toBe('false')
  })

  test('REACT_STATIC_DISABLE_ROUTE_PREFIXING is set by the disableRouteInfoWarning (from config)', () => {
    process.env.REACT_STATIC_DISABLE_ROUTE_PREFIXING = null

    buildConfigation({ disableRoutePrefixing: true })

    expect(process.env.REACT_STATIC_DISABLE_ROUTE_PREFIXING).toBe('true')
  })

  afterEach(() => {
    process.env.REACT_STATIC_ENV = reactStaticEnviroment
    process.env.REACT_STATIC_PREFETCH_RATE = reactStaticPrefetchRate
    process.env.REACT_STATIC_DISABLE_ROUTE_INFO_WARNING = reactStaticDisableRouteInfoWarning
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

      testConfiguration(configuration, {
        ...defaultConfigProduction,
        entry: 'path/to/entry/index.js',
      })
    })
  })

  describe('when provided a path to configuration', () => {
    it('should return a configuration using file provided', async () => {
      // mapped by the moduleNameMapper in package.js -> src/static/__mocks__/static.config.js
      const configuration = await getConfig('./path/to/static.config.js')

      testConfiguration(configuration, {
        ...defaultConfigProduction,
        entry: 'path/to/entry/index.js',
      })
    })
  })

  describe('when provided a configuration', () => {
    it('should return a merged configuration', async () => {
      const configuration = await getConfig({
        entry: 'another/path/to/entry/index.js',
      })

      testConfiguration(configuration, {
        ...defaultConfigProduction,
        entry: 'another/path/to/entry/index.js',
      })
    })
  })

  afterEach(() => {
    spyProcess.mockRestore()
  })
})
