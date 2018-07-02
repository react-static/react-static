import {
  pathJoin,
  cleanPath,
  cleanSlashes,
  cutPathToRoot,
  trimLeadingSlashes,
  trimTrailingSlashes,
  trimDoubleSlashes,
} from '../shared'

describe('utils/shared', () => {
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

  describe('cleanPath()', () => {
    const basePath = process.env.REACT_STATIC_BASE_PATH
    beforeEach(() => {
      process.env.REACT_STATIC_BASE_PATH = 'base/path'
    })

    it('should return / for falsey path', () => {
      expect(cleanPath('')).toEqual('/')
    })

    it('should return / for /', () => {
      expect(cleanPath('/')).toEqual('/')
    })

    it('should strip basePath', () => {
      expect(cleanPath('base/path/foo/bar')).toEqual('foo/bar')
    })

    it('should trim slashes', () => {
      expect(cleanPath('/foo/bar/')).toEqual('foo/bar')
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
  })
})
