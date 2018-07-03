import fsExtra from 'fs-extra'
import buildXMLandRSS, {
  getPermaLink,
  makeGenerateRouteXML,
  generateXML,
  getSiteRoot,
} from '../buildXML'

describe('getPermaLink', () => {
  it('should return a permalink', () => {
    const permalink = getPermaLink({
      path: '/path/to/somewhere',
      prefixPath: '/blog/',
    })

    expect(permalink).toEqual('/blog/path/to/somewhere/')
  })
})

describe('makeGenerateRouteXML', () => {
  it('should return the XML for route', () => {
    const generateRouteXML = makeGenerateRouteXML({ prefixPath: '/blog/' })
    const route = { path: '/path/to/somewhere' }
    const routeXML = generateRouteXML(route)

    expect(routeXML).toEqual(
      '<url><loc>/blog/path/to/somewhere/</loc><priority>0.5</priority></url>'
    )
  })

  describe('when custom properties are defined', () => {
    it('should return the XML for route', () => {
      const generateRouteXML = makeGenerateRouteXML({ prefixPath: '/blog/' })
      const route = {
        path: '/path/to/somewhere',
        lastModified: '10/10/2010',
        priority: 0.2,
      }

      const routeXML = generateRouteXML(route)

      expect(routeXML).toMatchSnapshot()
    })
  })

  it('should use encoding for XML-values', () => {
    const generateRouteXML = makeGenerateRouteXML({ prefixPath: '/this-&-that/' })
    const route = {
      path: '/"官话"-is-chinese-\'ру́сский язы́к\'-is-russian',
    }
    const routeXML = generateRouteXML(route)
    expect(routeXML).toMatchSnapshot()
  })
})

describe('generateXML', () => {
  it('should return the XML for route', () => {
    const xml = generateXML({
      routes: [{ path: '/path/to/somewhere' }],
      prefixPath: '/blog/',
    })

    expect(xml).toMatchSnapshot()
  })

  describe('when noindex defined and route is 404', () => {
    it('should return a the XML with `/best-lib/` route ', () => {
      const xml = generateXML({
        routes: [
          { path: '/path/to/article/' },
          { path: '/path/to/somewhere/', noindex: true },
          { path: '404' },
        ],
        prefixPath: '/blog/',
      })

      expect(xml).toMatchSnapshot()
    })
  })
})

describe('getSiteRoot', () => {
  const oldProcessEnv = [...process.env]

  afterEach(() => {
    process.env = [...oldProcessEnv]
  })

  describe('when enviroment is staging', () => {
    it('should return the siteRoot', () => {
      process.env = { REACT_STATIC_STAGING: undefined }
      const config = {
        siteRoot: 'www.example.com',
        stagingSiteRoot: 'www.staging.example.com',
      }

      const siteRoot = getSiteRoot(config)

      expect(siteRoot).toEqual('www.example.com')
    })
  })

  describe('when enviroment is staging', () => {
    it('should return the stagingSiteRoot for siteRoot', () => {
      process.env.REACT_STATIC_STAGING = 'true'

      const config = {
        siteRoot: 'www.example.com',
        stagingSiteRoot: 'www.staging.example.com',
      }

      const siteRoot = getSiteRoot(config)

      expect(siteRoot).toEqual('www.staging.example.com')
    })
  })
})

describe('when custom properties are defined', () => {
  const oldProcessEnv = [...process.env]

  afterEach(() => {
    process.env = [...oldProcessEnv]
  })

  beforeEach(() => {
    process.env = { REACT_STATIC_STAGING: undefined }
  })

  describe('when siteRoot is not defined', () => {
    it('should not write a sitemap', () => {
      const spy = jest.spyOn(fsExtra, 'writeFile').mockImplementation(() => {})

      buildXMLandRSS({ config: {} })

      expect(spy).not.toHaveBeenCalled()
    })
  })

  it('should return the XML site', () => {
    const fn = jest.fn()
    const spy = jest.spyOn(fsExtra, 'writeFile').mockImplementation(fn)

    const config = {
      siteRoot: 'www.example.com/',
      disableRoutePrefixing: true,
      routes: [
        {
          path: '/path/to/somewhere',
          lastModified: '10/10/2010',
          priority: 0.2,
        },
      ],
      paths: {
        DIST: 'path/to/dist',
      },
    }

    buildXMLandRSS({ config })

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn.mock.calls[0][0]).toBe('path/to/dist/sitemap.xml')
    expect(fn.mock.calls[0][1]).toMatchSnapshot()
    spy.mockRestore()
  })
})
