import { pathJoin, cleanPath } from '../shared'

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
    const basePath = process.env.REACT_STATIC_BASEPATH
    beforeEach(() => {
      process.env.REACT_STATIC_BASEPATH = 'base/path'
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
      process.env.REACT_STATIC_BASEPATH = basePath
    })
  })
})
