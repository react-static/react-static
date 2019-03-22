import fsExtra from 'fs-extra'
import { getPermaLink, generateXML } from '../buildXML'

describe('getPermaLink', () => {
  it('should return a permalink', () => {
    const permalink = getPermaLink('/path/to/somewhere', '/blog/')
    expect(permalink).toEqual('/blog/path/to/somewhere/')
  })
})

describe('generateXML', () => {
  it('should return an xml string', () => {
    const xml = generateXML({
      config: {
        routes: [
          {
            path: '/path/to/somewhere',
          },
        ],
      },
      prefixPath: '/blog/',
    })

    expect(typeof xml).toEqual('string')
    expect(xml).toMatchSnapshot()
  })

  it('should require a siteRoot', () => {
    expect(() =>
      generateXML({
        config: {
          routes: [
            {
              path: '/path/to/somewhere',
            },
          ],
        },
      })
    ).toThrow()
  })

  it('should utilize custom sitemap properties', () => {
    const xml = generateXML({
      config: {
        routes: [
          {
            path: '/path/to/somewhere',
            sitemap: {
              lastmod: '10/10/2010',
              priority: '0.5',
            },
          },
        ],
      },
      prefixPath: '/blog/',
    })

    expect(xml).toMatchSnapshot()
  })

  it('should use encoding for XML-values', () => {
    const xml = generateXML({
      config: {
        routes: [
          {
            path: '/"官话"-is-chinese-\'ру́сский язы́к\'-is-russian',
          },
        ],
      },
      prefixPath: '/this-&-that/',
    })

    expect(xml).toMatchSnapshot()
  })

  it('should return a the XML without noindex and 404 routes ', () => {
    const xml = generateXML({
      config: {
        routes: [
          { path: '/path/to/article/' },
          { path: '/path/to/somewhere/', noindex: true },
          { path: '404' },
        ],
      },
      prefixPath: '/blog/',
    })

    expect(xml.split('<loc>').length).toEqual(2)
  })

  it('should support a custom getAttributes option ', () => {
    const xml = generateXML({
      config: {
        routes: [
          {
            path: '/path/to/somewhere',
          },
        ],
      },
      getAttributes: route => ({
        path: route.path,
      }),
      prefixPath: '/blog/',
    })

    expect(xml.includes('<path>/path/to/somewhere</path>')).toEqual(true)
  })
})
