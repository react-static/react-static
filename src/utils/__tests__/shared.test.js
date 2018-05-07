import { pathJoin, cleanPath, trimSlashes, cleanSlashes } from '../shared'

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
  describe('trimSlashes()', () => {
    it('should keep string with no slashes', () => {
      expect(trimSlashes('foo')).toEqual('foo')
    })
    it('should trim edge slashes', () => {
      expect(trimSlashes('/foo/')).toEqual('foo')
    })
    it('should only trim edge slashes', () => {
      expect(trimSlashes('/foo/bar/')).toEqual('foo/bar')
    })
    it('should return empty string for no input', () => {
      expect(trimSlashes()).toEqual('')
    })
    it('should return empty string for /', () => {
      expect(trimSlashes('/')).toEqual('')
    })
  })
  describe('cleanSlashes()', () => {
    it('should keep string with no slashes', () => {
      expect(cleanSlashes('foo')).toEqual('foo')
    })
    it('should replace // with /', () => {
      expect(cleanSlashes('//')).toEqual('/')
    })
    it('should replace slashes at beginning', () => {
      expect(cleanSlashes('//foo/bar/')).toEqual('/foo/bar/')
    })
    it('should replace slashes in middle', () => {
      expect(cleanSlashes('/foo//bar/')).toEqual('/foo/bar/')
    })
    it('should replace slashes at end', () => {
      expect(cleanSlashes('/foo/bar//')).toEqual('/foo/bar/')
    })
    it('should replace multiple slashes', () => {
      expect(cleanSlashes('///foo///bar///')).toEqual('/foo/bar/')
    })
    it('should return empty string for no input', () => {
      expect(cleanSlashes()).toEqual('')
    })
  })
})
