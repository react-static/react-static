import { chunkNameFromFile, absoluteToRelativeChunkName } from '../chunkBuilder'

describe('utils/chunkBuilder', () => {
  describe('chunkNameFromFile', () => {
    it('can generate chunkNames from relative files', () => {
      expect(chunkNameFromFile('bazz/component.jsx')).toBe('bazz-component')
    })

    it('can generate chunkNames from relative files on windows', () => {
      expect(chunkNameFromFile('bazz\\component.jsx')).toBe('bazz-component')
    })

    it('can generate chunkNames from absolute files', () => {
      expect(chunkNameFromFile('/bar/bazz/component.jsx')).toBe(
        'bar-bazz-component'
      )
    })

    it('can generate chunkNames from absolute files on windows', () => {
      expect(chunkNameFromFile('C:\\bar\\bazz\\component.jsx')).toBe(
        'bar-bazz-component'
      )
    })
  })

  describe('absoluteToRelativeChunkName', () => {
    it('can make absolute chunk names relative', () => {
      expect(
        absoluteToRelativeChunkName(
          '/foo/bar/bazz/',
          'foo-bar-bazz-src-component.jsx'
        )
      ).toBe('src-component')
    })

    it('can make absolute chunk names relative on windows', () => {
      expect(
        absoluteToRelativeChunkName(
          'C:\\foo\\bar\\bazz\\',
          'foo-bar-bazz-src-component.jsx'
        )
      ).toBe('src-component')
    })

    it('leaves relative chunk names untouched', () => {
      expect(absoluteToRelativeChunkName('/foo/bar/bazz/', 'src-bar')).toBe(
        'src-bar'
      )
    })

    it('leaves relative chunk names untouched on windows', () => {
      expect(
        absoluteToRelativeChunkName('C:\\foo\\bar\\bazz\\', 'src-bar')
      ).toBe('src-bar')
    })
  })
})
