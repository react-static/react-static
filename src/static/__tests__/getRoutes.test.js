// import path from 'path'

// import getConfig from '../getConfig'
// import getRoutes, { normalizeRoute } from '../getRoutes'
import { normalizeRoute } from '../getRoutes'

jest.mock('../../utils/getDirname', () => () => './dirname/')

describe('normalizeRoute', () => {
  describe('when working route is provided', () => {
    it('should return a normalized route', async () => {
      const route = normalizeRoute({ path: '/path/' })

      expect(route).toEqual({
        hasGetProps: false,
        noindex: undefined,
        originalPath: 'path',
        path: 'path',
      })
    })

    describe('when noindex is true', () => {
      it('should return a normalized route with noindex as true', () => {
        const route = normalizeRoute({ path: '/path/', noindex: true })

        expect(route.noindex).toEqual(true)
      })
    })

    describe('when noIndex is true', () => {
      let spy

      beforeEach(() => {
        spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
      })

      it('should return a normalized route with noindex as true', () => {
        const route = normalizeRoute({ path: '/path/', noIndex: true })

        expect(route.noindex).toEqual(true)
      })

      it('should warns the user to use noIndex', () => {
        normalizeRoute({ path: '/path/', noIndex: true })

        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledWith(
          "=> Warning: Route /path/ is using 'noIndex'. Did you mean 'noindex'?"
        )
      })

      afterEach(() => {
        spy.mockRestore()
      })
    })

    describe('when path is not defined', () => {
      it('should throw an error', () => {
        const route = { component: '/no/path/', noIndex: true }

        expect(() => normalizeRoute(route)).toThrow(
          `No path defined for route: ${JSON.stringify(route)}`
        )
      })

      describe('when route is 404', () => {
        it('should not throw an error', () => {
          expect(() => normalizeRoute({ component: '/no/path/', path: '404' })).not.toThrow()
        })
      })
    })

    describe('when parent route is provided', () => {
      it('should return a normalized route', () => {
        const route = normalizeRoute({ path: '/to/' }, { path: '/path/' })

        expect(route).toEqual({
          hasGetProps: false,
          noindex: undefined,
          originalPath: 'to',
          path: 'path/to',
        })
      })

      describe('when parent noindex is true', () => {
        it('should return a normalized route with noindex as true', () => {
          const route = normalizeRoute({ path: '/to/' }, { path: '/path/', noindex: true })

          expect(route.noindex).toEqual(true)
        })
      })
    })
  })
})

// TODO: bring back these tests. Not sure how to mock file system for `pages` directory
// describe('getRoutes', () => {
//   describe('when getRoutes is defined on config', () => {
//     it('should return routes', async () => {
//       const config = await getConfig({
//         paths: {
//           pages: path.resolve(__dirname, '../_mocks_/pages/'),
//         },
//         getRoutes: async () => [{ path: '/' }, { path: '404' }],
//       })

//       const routes = await getRoutes({ config })

//       expect(routes).toEqual([
//         {
//           hasGetProps: false,
//           noindex: undefined,
//           originalPath: '/',
//           path: '/',
//         },
//         {
//           hasGetProps: false,
//           noindex: undefined,
//           originalPath: '404',
//           path: '404',
//         },
//       ])
//     })

//     describe('when routes has children', () => {
//       const routesWithChildren = [
//         {
//           path: '/',
//           children: [
//             {
//               path: 'to',
//               children: [
//                 {
//                   path: 'blog',
//                 },
//                 {
//                   path: 'slug',
//                 },
//               ],
//             },
//           ],
//         },
//       ]

//       it('should return a flat Array of routes', async () => {
//         const config = { getRoutes: async () => routesWithChildren }

//         const routes = await getRoutes({ config })

//         expect(routes).toMatchSnapshot()
//       })

//       describe('when config.tree is defined', () => {
//         it('should return a flat Array of routes', async () => {
//           const config = {
//             getRoutes: async () => routesWithChildren,
//             tree: true,
//           }

//           const routes = await getRoutes({ config })

//           expect(routes).toMatchSnapshot()
//         })
//       })
//     })
//   })

//   describe('when getRoutes is not defined on config', () => {
//     it('should return default route', async () => {
//       const config = {}

//       const routes = await getRoutes({ config })

//       expect(routes).toEqual([
//         {
//           hasGetProps: false,
//           noindex: undefined,
//           originalPath: '/',
//           path: '/',
//         },
//       ])
//     })
//   })
// })
