import React from 'react'
import { mount } from 'enzyme'
import { makeBodyWithMeta } from '../BodyWithMeta'

describe('BodyWithMeta', () => {
  test('when route is a static route', () => {
    process.env.REACT_STATIC_ASSETS_PATH = 'assets/path'
    const BodyWithMeta = makeBodyWithMeta({
      head: { bodyProps: { lang: 'en' } },
      route: { redirect: false },
      embeddedRouteInfo: {
        routeDate: 'here',
      },
      clientScripts: ['main.js', 'bootstrap.js'],
    })

    const bodyWithMeta = mount(
      <BodyWithMeta className="body">
        <div>static page</div>
      </BodyWithMeta>
    )

    expect(bodyWithMeta).toMatchSnapshot()
  })

  test('when route is a redirect route', () => {
    const BodyWithMeta = makeBodyWithMeta({
      head: { bodyProps: { lang: 'en' } },
      route: { redirect: true },
      embeddedRouteInfo: {
        routeDate: 'here',
      },
      clientScripts: ['main.js', 'bootstrap.js'],
      config: {},
    })

    const bodyWithMeta = mount(
      <BodyWithMeta className="body">
        <div>static page</div>
      </BodyWithMeta>
    )

    expect(bodyWithMeta).toMatchSnapshot()
  })
})
