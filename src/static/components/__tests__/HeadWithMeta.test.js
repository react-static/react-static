import React from 'react'
import { mount } from 'enzyme'
import { makeHeadWithMeta } from '../HeadWithMeta'

describe('HeadWithMeta', () => {
  let data
  beforeEach(() => {
    const inlineCSS = `
      body {
        display: block;
        width: 100%;
        height: 100%;
      }
    `
    data = {
      head: {
        base: '',
        title: [<title>React Static</title>],
        meta: '',
        link: '',
        noscript: '',
        script: '',
        style: '',
      },
      route: { redirect: false },
      embeddedRouteInfo: {
        routeDate: 'here',
      },
      clientScripts: [
        <script text="text/javascript" src="main.js" />,
        <script text="text/javascript" src="bootstrap.js" />,
      ],
      clientStyleSheets: [
        <script text="text/javascript" src="main.js" />,
        <script text="text/javascript" src="bootstrap.js" />,
      ],
      clientCss: <style>{inlineCSS}</style>,
      config: {
        publicPath: 'public/path',
        inlineCss: false,
      },
    }
  })

  test('when route is a static route', () => {
    const HeadWithMeta = makeHeadWithMeta(data)

    const headWithMeta = mount(
      <HeadWithMeta className="body">
        <meta name="description" content="Helmet application" />
      </HeadWithMeta>
    )

    expect(headWithMeta).toMatchSnapshot()
  })

  test('when route is a redirect route', () => {
    data.route.redirect = true
    const HeadWithMeta = makeHeadWithMeta(data)

    const headWithMeta = mount(
      <HeadWithMeta className="body">
        <meta name="description" content="Helmet application" />
      </HeadWithMeta>
    )

    expect(headWithMeta).toMatchSnapshot()
  })

  test('when route has inline CSS', () => {
    data.config.inlineCss = true
    const HeadWithMeta = makeHeadWithMeta(data)

    const headWithMeta = mount(
      <HeadWithMeta className="body">
        <meta name="description" content="Helmet application" />
      </HeadWithMeta>
    )

    expect(headWithMeta).toMatchSnapshot()
  })

  test('when route has title as child', () => {
    const HeadWithMeta = makeHeadWithMeta(data)

    const headWithMeta = mount(
      <HeadWithMeta className="body">
        <title>React Static New Title</title>
        <meta name="description" content="Helmet application" />
      </HeadWithMeta>
    )

    expect(headWithMeta).toMatchSnapshot()
  })
})
