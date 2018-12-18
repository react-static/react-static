import { reloadRoutes } from 'react-static/node'
import fs from 'fs-extra'
import path from 'path'
import React, { Component } from 'react'
import { ServerStyleSheet } from 'styled-components'
import chokidar from 'chokidar'

chokidar.watch('../docs').on('all', () => reloadRoutes())

//

const packageFile = 'package.json' // Point this to your package.json file
const repoName = 'Blazing Awesome' // Change this
const repo = 'nozzle/react-static' // Change this
const repoURL = `https://github.com/${repo}`

try {
  // eslint-disable-next-line
  process.env.REPO_VERSION = require(path.resolve(packageFile)).version
} catch (err) {
  //
}

// These are the documentation pages. They can either use the `markdownSrc` to point
// to a markdown file, or they can use `component` to point to a react component
const docPages = [
  {
    path: '/',
    title: 'Readme',
    markdownSrc: 'README.md',
  },
  {
    path: 'overview',
    title: 'Overview',
    markdownSrc: 'docs/overview.md',
  },
]

// This is the side menu for the documentation section.
// You can nest items in `children` to create groups.
// If a group name has a `link` prop, it will also act as a link in addition to a header.
const menu = [
  {
    name: 'Readme',
    link: '/docs/',
  },
  {
    name: 'Overview',
    children: [{ name: 'Overview', link: '/docs/overview' }],
  },
]

// No need to touch any of this, unless you want to.
export default {
  getSiteData: () => ({
    menu,
    repo,
    repoURL,
    repoName,
  }),
  getRoutes: () =>
    docPages.map(page => ({
      path: `docs/${page.path}`,
      component: 'src/containers/Doc',
      getData: () => ({
        markdown: fs.readFileSync(path.resolve(page.markdownSrc), 'utf8'),
        editPath:
          repoURL + path.join('/blob/master/', __dirname.split('/').pop(), page.markdownSrc),
        title: page.title,
      }),
    })),
  renderToHtml: (render, Comp, meta) => {
    const sheet = new ServerStyleSheet()
    const html = render(sheet.collectStyles(<Comp />))
    meta.styleTags = sheet.getStyleElement()
    return html
  },
  Document: class CustomHtml extends Component {
    render () {
      const {
        Html, Head, Body, children, renderMeta,
      } = this.props

      return (
        <Html>
          <Head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link
              href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i"
              rel="stylesheet"
            />
            {renderMeta.styleTags}
            <title>{repoName}</title>
          </Head>
          <Body>{children}</Body>
        </Html>
      )
    }
  },
}
