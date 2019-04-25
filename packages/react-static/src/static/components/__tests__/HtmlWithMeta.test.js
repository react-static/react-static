import React from 'react'
import { mount } from 'enzyme'
import makeHtmlWithMeta from '../HtmlWithMeta'

describe('HtmlWithMeta', () => {
  test('when route is a static route', async () => {
    const HtmlWithMeta = await makeHtmlWithMeta({
      head: { htmlProps: { lang: 'en' } },
      plugins: [],
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
