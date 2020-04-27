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
    const xml = generateXML(
      {
        routes: [
          {
            path: '/path/to/somewhere',
          },
        ],
      },
      undefined,
      '/blog/'
    )

    expect(typeof xml).toEqual('string')
    expect(xml).toMatchSnapshot()
  })

  it('should require a siteRoot', () => {
    expect(() =>
      generateXML({
        routes: [
          {
            path: '/path/to/somewhere',
          },
        ],
      })
    ).toThrow()
  })

  it('should utilize custom sitemap properties', () => {
    const xml = generateXML(
      {
        routes: [
          {
            path: '/path/to/somewhere',
            sitemap: {
              lastmod: '10/10/2010',
              priority: '0.5',
              'image:image': {
                'image:loc': `https://raw.githubusercontent.com/react-static/react-static/master/media/react-static-logo-2x.png`,
                'image:caption': 'React Static',
              },
            },
          },
        ],
      },
      undefined,
      '/blog/'
    )

    expect(xml).toMatchSnapshot()
  })

  it('should use encoding for XML-values', () => {
    const xml = generateXML(
      {
        routes: [
          {
            path: '/"官话"-is-chinese-\'ру́сский язы́к\'-is-russian',
          },
        ],
      },
      undefined,
      '/this-&-that/'
    )

    expect(xml).toMatchSnapshot()
  })

  it('should return a the XML without noindex and 404 routes ', () => {
    const xml = generateXML(
      {
        routes: [
          { path: '/path/to/article/' },
          { path: '/path/to/somewhere/', noindex: true },
          { path: '404' },
        ],
      },
      undefined,
      '/blog/'
    )

    expect(xml.split('<loc>').length).toEqual(2)
  })

  it('should support a custom getAttributes option ', () => {
    const xml = generateXML(
      {
        routes: [
          {
            path: '/path/to/somewhere',
          },
        ],
      },
      {
        getAttributes: () => ({
          test: 'foobar',
        }),
      },
      '/blog/'
    )

    expect(xml.includes('<test>foobar</test>')).toEqual(true)
  })
})
