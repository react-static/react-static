// import path from 'path'

// import getConfig from '../getConfig'
// import getRoutes, { normalizeRoute } from '../getRoutes'
import { normalizeRoute } from '../getRoutes'

describe('normalizeRoute', () => {
  describe('when working route is provided', () => {
    it('should return a normalized route', () => {
      const route = normalizeRoute({ path: '/path/' }, undefined, d => d)

      expect(route).toEqual({
        path: 'path',
      })
    })

    describe('when noindex is true, but a child route is noindex: false', () => {
      it('should return a normalized route with noindex as true', () => {
        const route = normalizeRoute(
          {
            path: '/path/',
            noindex: true,
            children: [
              {
                path: 'child',
                noindex: false,
              },
            ],
          },
          undefined,
          d => d
        )

        expect(route.noindex).toEqual(true)
        expect(route.children[0].noindex).toEqual(false)
      })
    })

    describe('when noIndex (camelCase) is true', () => {
      let spy

      beforeEach(() => {
        spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
      })

      it('should warns the user to use noIndex', () => {
        normalizeRoute({ path: '/path/', noIndex: true }, undefined, d => d)

        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledWith(
          "Warning: Route /path/ is using 'noIndex'. Did you mean 'noindex'?"
        )
      })

      afterEach(() => {
        spy.mockRestore()
      })
    })

    describe('when path is not defined', () => {
      it('should throw an error', () => {
        const route = { template: '/no/path/', noIndex: true }

        expect(() => normalizeRoute(route, undefined, d => d)).toThrow(
          `No path defined for route: ${JSON.stringify(route)}`
        )
      })

      describe('when route is 404', () => {
        it('should not throw an error', () => {
          expect(() =>
            normalizeRoute(
              { template: '/no/path/', path: '404' },
              undefined,
              d => d
            )
          ).not.toThrow()
        })
      })
    })

    describe('when parent route is provided', () => {
      it('should return a normalized route', () => {
        const route = normalizeRoute(
          { path: '/to/' },
          { path: '/path/' },
          d => d
        )

        expect(route).toEqual({
          path: 'path/to',
        })
      })
    })

    describe('when path is not normalised', () => {
      it('should throw an error', () => {
        const route = { template: 'windows\\path' }

        expect(() => normalizeRoute(route, undefined, d => d)).toThrow(Error)
      })
    })
  })
})
