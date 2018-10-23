import getConfig, {
  cutPathToRoot,
  trimLeadingAndTrailingSlashes,
  createNormalizedRoute,
  makeGetRoutes,
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

describe('createNormalizedRoute', () => {
  describe('when working route is provided', () => {
    it('should return a normalized route', async () => {
      const route = createNormalizedRoute({ path: '/path/' })

      expect(route).toEqual({
        hasGetProps: false,
        noindex: undefined,
        originalPath: 'path',
        path: 'path',
      })
    })

    describe('when noindex is true', () => {
      it('should return a normalized route with noindex as true', () => {
        const route = createNormalizedRoute({ path: '/path/', noindex: true })

        expect(route.noindex).toEqual(true)
      })
    })

    describe('when noIndex is true', () => {
      let spy

      beforeEach(() => {
        spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
      })

      it('should return a normalized route with noindex as true', () => {
        const route = createNormalizedRoute({ path: '/path/', noIndex: true })

        expect(route.noindex).toEqual(true)
      })

      it('should warns the user to use noIndex', () => {
        createNormalizedRoute({ path: '/path/', noIndex: true })

        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledWith(
          "=> Warning: Route /path/ is using 'noIndex'. Did you mean 'noindex'?"
        )
      })

      afterEach(() => {
        spy.mockRestore()
      })
    })

    describe('when path is not defined', () => {
      it('should throw an error', () => {
        const route = { component: '/no/path/', noIndex: true }

        expect(() => createNormalizedRoute(route)).toThrow(
          `No path defined for route: ${JSON.stringify(route)}`
        )
      })

      describe('when route is 404', () => {
        it('should not throw an error', () => {
          expect(() =>
            createNormalizedRoute({ component: '/no/path/', is404: true })
          ).not.toThrow()
        })
      })
    })

    describe('when parent route is provided', () => {
      it('should return a normalized route', () => {
        const route = createNormalizedRoute({ path: '/to/' }, { path: '/path/' })

        expect(route).toEqual({
          hasGetProps: false,
          noindex: undefined,
          originalPath: 'to',
          path: 'path/to',
        })
      })

      describe('when parent noindex is true', () => {
        it('should return a normalized route with noindex as true', () => {
          const route = createNormalizedRoute({ path: '/to/' }, { path: '/path/', noindex: true })

          expect(route.noindex).toEqual(true)
        })
      })
    })
  })
})

describe('makeGetRoutes', () => {
  describe('when getRoutes is defined on config', () => {
    it('should return routes', async () => {
      const config = { getRoutes: async () => [{ path: '/path' }] }

      const getRoutes = makeGetRoutes(config)
      const routes = await getRoutes()

      expect(routes).toEqual([
        {
          hasGetProps: false,
          noindex: undefined,
          originalPath: 'path',
          path: 'path',
        },
        {
          hasGetProps: false,
          is404: true,
          noindex: undefined,
          originalPath: '404',
          path: '404',
        },
      ])
    })

    it('should return routes', async () => {
      const config = {
        getRoutes: async () => [{ path: '/path' }, { is404: true, path: '404' }],
      }

      const getRoutes = makeGetRoutes(config)
      const routes = await getRoutes()

      expect(routes).toEqual([
        {
          hasGetProps: false,
          noindex: undefined,
          originalPath: 'path',
          path: 'path',
        },
        {
          hasGetProps: false,
          is404: true,
          noindex: undefined,
          originalPath: '404',
          path: '404',
        },
      ])
    })

    describe('when routes has children', () => {
      const routesWithChildren = [
        {
          path: '/path',
          children: [
            {
              path: 'to',
              children: [
                {
                  path: 'blog',
                },
                {
                  path: 'slug',
                },
              ],
            },
          ],
        },
      ]

      it('should return a flat Array of routes', async () => {
        const config = { getRoutes: async () => routesWithChildren }

        const getRoutes = makeGetRoutes(config)
        const routes = await getRoutes()

        expect(routes).toMatchSnapshot()
      })

      describe('when config.tree is defined', () => {
        it('should return a flat Array of routes', async () => {
          const config = {
            getRoutes: async () => routesWithChildren,
            tree: true,
          }

          const getRoutes = makeGetRoutes(config)
          const routes = await getRoutes()

          expect(routes).toMatchSnapshot()
        })
      })
    })
  })

  describe('when getRoutes is not defined on config', () => {
    it('should return default route', async () => {
      const config = {}

      const getRoutes = makeGetRoutes(config)
      const routes = await getRoutes()

      expect(routes).toEqual([
        {
          hasGetProps: false,
          noindex: undefined,
          originalPath: '/',
          path: '/',
        },
        {
          hasGetProps: false,
          noindex: undefined,
          originalPath: '404',
          is404: true,
          path: '404',
        },
      ])
    })
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
    reactStaticDisableRouteInfoWarning =
      process.env.REACT_STATIC_DISABLE_ROUTE_INFO_WARNING
    reactStaticDisableRoutePreFixing =
      process.env.REACT_STATIC_DISABLE_ROUTE_PREFIXING
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
    it('should return a configuration using default file', () => {
      // mapped by the moduleNameMapper in package.js -> src/static/__mocks__/static.config.js
      // default path is 'static.config.js'
      const configuration = getConfig()

      testConfiguration(configuration, {
        ...defaultConfigProduction,
        entry: 'path/to/entry/index.js',
      })
    })
  })

  describe('when provided a path to configuration', () => {
    it('should return a configuration using file provided', () => {
      // mapped by the moduleNameMapper in package.js -> src/static/__mocks__/static.config.js
      const configuration = getConfig('./path/to/static.config.js')

      testConfiguration(configuration, {
        ...defaultConfigProduction,
        entry: 'path/to/entry/index.js',
      })
    })
  })

  describe('when provided a configuration', () => {
    it('should return a merged configuration', () => {
      const configuration = getConfig({
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
