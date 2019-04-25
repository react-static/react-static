import React from 'react'
import { mount } from 'enzyme'
import makeHeadWithMeta from '../HeadWithMeta'

describe('HeadWithMeta', () => {
  let data
  beforeEach(() => {
    process.env.REACT_STATIC_ASSETS_PATH = 'assets/path'
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
        title: [<title>Helmet Title</title>],
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
      clientScripts: ['main.js', 'bootstrap.js'],
      clientStyleSheets: ['main.css', 'bootstrap.css'],
      clientCss: <style>{inlineCSS}</style>,
      config: {
        inlineCss: false,
      },
      plugins: [],
    }
  })

  test('when route is a static route', async () => {
    const HeadWithMeta = await makeHeadWithMeta(data)

    const headWithMeta = mount(
      <HeadWithMeta className="body">
        <meta name="description" content="Helmet application" />
      </HeadWithMeta>
    )

    expect(headWithMeta).toMatchSnapshot()
  })

  test('when route is a redirect route', async () => {
    data.route.redirect = true
    const HeadWithMeta = await makeHeadWithMeta(data)

    const headWithMeta = mount(
      <HeadWithMeta className="body">
        <meta name="description" content="Helmet application" />
      </HeadWithMeta>
    )

    expect(headWithMeta).toMatchSnapshot()
  })

  test('when route has inline CSS', async () => {
    data.config.inlineCss = true
    const HeadWithMeta = await makeHeadWithMeta(data)

    const headWithMeta = mount(
      <HeadWithMeta className="body">
        <meta name="description" content="Helmet application" />
      </HeadWithMeta>
    )

    expect(headWithMeta).toMatchSnapshot()
  })

  test('when route has title as child', async () => {
    const HeadWithMeta = await makeHeadWithMeta(data)

    const headWithMeta = mount(
      <HeadWithMeta className="body">
        <title>Document Title</title>
        <meta name="description" content="Helmet application" />
      </HeadWithMeta>
    )

    expect(headWithMeta).toMatchSnapshot()
  })

  test('when route has no helmet title', async () => {
    const HeadWithMeta = await makeHeadWithMeta({
      ...data,
      head: {
        ...data.head,
        title: [],
      },
    })

    const headWithMeta = mount(
      <HeadWithMeta className="body">
        <title>Document Title</title>
        <meta name="description" content="Helmet application" />
      </HeadWithMeta>
    )

    expect(headWithMeta).toMatchSnapshot()
  })
})
