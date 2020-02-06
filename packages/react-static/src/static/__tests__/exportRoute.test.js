import { getEmbeddedRouteInfoScript } from '../exportRoute'

describe('Embedded route info', () => {
  it('should assign to window.__routeInfo', () => {
    const res = getEmbeddedRouteInfoScript({})
    expect(res.script.startsWith('window.__routeInfo =')).toBeTruthy()
  })

  it('should include route info', () => {
    const info = 'my-route-info'
    const res = getEmbeddedRouteInfoScript({ routeInfo: info })
    expect(res.script.includes(info)).toBeTruthy()
  })

  it('should include hash algorithm as prefix', () => {
    const res = getEmbeddedRouteInfoScript({})
    expect(res.hash.startsWith('sha256-')).toBeTruthy()
  })

  it('should include hash as base64', () => {
    const res = getEmbeddedRouteInfoScript({})
    atob(res.hash.substr('sha256-'.length))
  })
})
