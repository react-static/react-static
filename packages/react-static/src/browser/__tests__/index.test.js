import { isPrefetchableRoute } from ".."

describe('browser', () => {
  describe('isPrefetchableRoute', () => {
    let originalDocumentDescriptor
    let getDocumentMock

    beforeEach(() => {
      originalDocumentDescriptor = Object.getOwnPropertyDescriptor(
        global,
        'document'
      )

      getDocumentMock = jest.fn()

      Object.defineProperty(global, 'document', {
        get: getDocumentMock,
      })
    })

    afterEach(() => {
      Object.defineProperty(global, 'document', originalDocumentDescriptor)
    })

    it('should return false during SSR', () => {
      getDocumentMock.mockReturnValue(undefined)

      expect(isPrefetchableRoute('/foo')).toBe(false)
    })
    it('should return false for script links', () => {
      getDocumentMock.mockReturnValue({ location: {} })

      // eslint-disable-next-line no-script-url
      expect(isPrefetchableRoute('javascript:foo')).toBe(false)
    })
    it('should return false for links with a different protocol', () => {
      getDocumentMock.mockReturnValue({ location: {} })

      expect(isPrefetchableRoute('mailto:foo')).toBe(false)
    })
    it('should return false for links with a different port', () => {
      getDocumentMock.mockReturnValue({
        location: {
          href: 'http://foo:1337/foo',
          host: 'foo',
          protocol: 'http:',
        },
      })

      expect(isPrefetchableRoute('http://foo:1337/bar')).toBe(false)
    })
    it('should return false for links with the same port', () => {
      getDocumentMock.mockReturnValue({
        location: {
          href: 'http://foo:1337/foo',
          host: 'foo:1337',
          protocol: 'http:',
        },
      })

      expect(isPrefetchableRoute('http://foo:1337/bar')).toBe(true)
    })
    it('should return true for relative paths', () => {
      getDocumentMock.mockReturnValue({
        location: {
          href: 'http://foo',
          host: 'foo',
          protocol: 'http:',
        },
      })

      expect(isPrefetchableRoute('foo')).toBe(true)
    })
    it('should return true for relative paths on the current level', () => {
      getDocumentMock.mockReturnValue({
        location: {
          href: 'http://foo',
          host: 'foo',
          protocol: 'http:',
        },
      })

      expect(isPrefetchableRoute('./foo')).toBe(true)
    })
    it('should return true for relative paths one level up', () => {
      getDocumentMock.mockReturnValue({
        location: {
          href: 'http://foo',
          host: 'foo',
          protocol: 'http:',
        },
      })

      expect(isPrefetchableRoute('../foo')).toBe(true)
    })
    it('should return true for absolute paths', () => {
      getDocumentMock.mockReturnValue({
        location: {
          href: 'http://foo',
          host: 'foo',
          protocol: 'http:',
        },
      })

      expect(isPrefetchableRoute('/foo')).toBe(true)
    })
    it('should return false for absolute URLs without protocol', () => {
      getDocumentMock.mockReturnValue({
        location: {
          href: 'http://foo',
          host: 'foo',
          protocol: 'http:',
        },
      })

      expect(isPrefetchableRoute('//www.example.com')).toBe(false)
    })
  })
})
