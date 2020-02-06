import {
  pathJoin,
  getRoutePath,
  cleanSlashes,
  cutPathToRoot,
  isAbsoluteUrl,
  trimLeadingSlashes,
  trimTrailingSlashes,
  trimDoubleSlashes,
  makePathAbsolute,
  getFullRouteData,
} from '..'

describe('browser/utils', () => {
  describe('pathJoin()', () => {
    it('should strip slashes', () => {
      expect(pathJoin('/foo/bar/')).toEqual('foo/bar')
    })
    it('should join paths and trim slashes', () => {
      expect(pathJoin('foo', 'bar')).toEqual('foo/bar')
    })
    it('should return / for no path', () => {
      expect(pathJoin()).toEqual('/')
    })
    it('should return / for no path', () => {
      expect(pathJoin('')).toEqual('/')
    })
    it('should return / for /', () => {
      expect(pathJoin('')).toEqual('/')
    })
  })

  describe('getRoutePath()', () => {
    const basePath = process.env.REACT_STATIC_BASE_PATH
    beforeEach(() => {
      process.env.REACT_STATIC_BASE_PATH = 'base/path'
    })

    it('should return / for falsey path', () => {
      expect(getRoutePath('')).toEqual('/')
    })

    it('should return / for /', () => {
      expect(getRoutePath('/')).toEqual('/')
    })

    it('should return / for basePath without leading / without trailing /', () => {
      expect(getRoutePath('base/path')).toEqual('/')
    })

    it('should return / for basePath without leading / with trailing /', () => {
      expect(getRoutePath('base/path/')).toEqual('/')
    })

    it('should return / for basePath with leading / without trailing /', () => {
      expect(getRoutePath('/base/path')).toEqual('/')
    })

    it('should return / for basePath with leading / with trailing /', () => {
      expect(getRoutePath('/base/path/')).toEqual('/')
    })

    it('should strip basePath', () => {
      expect(getRoutePath('base/path/foo/bar')).toEqual('foo/bar')
    })

    it('should trim slashes', () => {
      expect(getRoutePath('/foo/bar/')).toEqual('foo/bar')
    })

    afterEach(() => {
      process.env.REACT_STATIC_BASE_PATH = basePath
    })
  })

  describe('cutPathToRoot', () => {
    it('should return a root of the path', () => {
      expect(cutPathToRoot('./root/path/to/')).toBe('./root')
    })
  })

  describe('trimLeadingSlashes', () => {
    it('should return a string with the leading slash trimmed', () => {
      expect(trimLeadingSlashes('/path/to/')).toBe('path/to/')
    })
  })

  describe('trimTrailingSlashes', () => {
    it('should return a string with the trailing slash trimmed', () => {
      expect(trimTrailingSlashes('/path/to/')).toBe('/path/to')
    })
  })

  describe('trimDoubleSlashes', () => {
    it('should return a string with double slashes trimmed', () => {
      expect(trimDoubleSlashes('/path//to/')).toBe('/path/to/')
    })
  })

  describe('cleanSlashes()', () => {
    it('should keep string with no slashes', () => {
      expect(cleanSlashes('foo')).toEqual('foo')
    })
    it('should replace double slashes', () => {
      expect(cleanSlashes('//')).toEqual('')
    })
    it('should trim leading and trailing slashes', () => {
      expect(cleanSlashes('/foo/bar/')).toEqual('foo/bar')
    })
    it('should replace multiple slashes', () => {
      expect(cleanSlashes('/foo///bar/')).toEqual('foo/bar')
    })
    it('should return empty string for no input', () => {
      expect(cleanSlashes()).toEqual('')
    })
    it('should work for absolute path', () => {
      expect(cleanSlashes('https://example.com/foo//bar/')).toEqual(
        'https://example.com/foo/bar'
      )
    })
  })
  describe('isAbsoluteUrl()', () => {
    it('should work for http', () => {
      expect(isAbsoluteUrl('http://example.com')).toBeTruthy()
    })
    it('should work for https', () => {
      expect(isAbsoluteUrl('https://example.com')).toBeTruthy()
    })
    it('should work for mailto', () => {
      expect(isAbsoluteUrl('mailto://example.com')).toBeTruthy()
    })
    it('should work for file', () => {
      expect(isAbsoluteUrl('file://example.com')).toBeTruthy()
    })
    it('shouldnt work for non url', () => {
      expect(isAbsoluteUrl('/foo/bar')).toBeFalsy()
    })
    it('shouldnt work for empty input', () => {
      expect(isAbsoluteUrl('')).toBeFalsy()
    })
    it('shouldnt work for undefined input', () => {
      expect(isAbsoluteUrl()).toBeFalsy()
    })
  })
  describe('makePathAbsolute()', () => {
    it('should return / if no input', () => {
      expect(makePathAbsolute()).toEqual('/')
    })
    it('should return if already absolute', () => {
      expect(makePathAbsolute('http://example.com')).toEqual(
        'http://example.com'
      )
    })
    it('should make path absolute', () => {
      expect(makePathAbsolute('foo/bar')).toEqual('/foo/bar')
    })
  })
  describe('getFullRouteData', () => {
    it('should return the data merged with the shared data', () => {
      const routeInfo = {
        data: { foo: 'foo' },
        sharedData: { bar: 'bar' },
      }
      const expected = { foo: 'foo', bar: 'bar' }
      expect(getFullRouteData(routeInfo)).toEqual(expected)
    })
    it('should return the data when no shared data was available', () => {
      const routeInfo = {
        data: { foo: 'foo' },
      }
      const expected = { foo: 'foo' }
      expect(getFullRouteData(routeInfo)).toEqual(expected)
    })
    it('should override the shared data with the route data for duplicate keys', () => {
      const routeInfo = {
        data: { foo: 'foo' },
        sharedData: { foo: 'bar', bar: 'bar' },
      }
      const expected = { foo: 'foo', bar: 'bar' }
      expect(getFullRouteData(routeInfo)).toEqual(expected)
    })
  })
})
