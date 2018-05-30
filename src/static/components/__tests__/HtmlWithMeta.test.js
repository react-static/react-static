import React from 'react'
import { mount } from 'enzyme'
import { makeHtmlWithMeta } from '../HtmlWithMeta'

describe('HtmlWithMeta', () => {
  test('when route is a static route', () => {
    const HtmlWithMeta = makeHtmlWithMeta({
      head: { htmlProps: { lang: 'en' } },
    })

    const htmlWithMeta = mount(
      <HtmlWithMeta className="body">
        <head>
          <title>React Static</title>
        </head>
      </HtmlWithMeta>
    )

    expect(htmlWithMeta).toMatchSnapshot()
  })
})
