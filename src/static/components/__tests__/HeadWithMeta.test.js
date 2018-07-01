import React from 'react'
import { mount } from 'enzyme'
import { makeHeadWithMeta } from '../HeadWithMeta'

describe('HeadWithMeta', () => {
  let data
  beforeEach(() => {
    process.env.REACT_STATIC_PUBLICPATH = 'public/path'
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
        <title>Document Title</title>
        <meta name="description" content="Helmet application" />
      </HeadWithMeta>
    )

    expect(headWithMeta).toMatchSnapshot()
  })

  test('when route has no helmet title', () => {
    const HeadWithMeta = makeHeadWithMeta({
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
