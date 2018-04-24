import { reloadRoutes } from 'react-static/node'
import fs from 'fs-extra'
import path from 'path'
import React, { Component } from 'react'
import { ServerStyleSheet } from 'styled-components'
import chokidar from 'chokidar'

//

// TODO: What is the name of your project?
const repoName = 'Blazing Awesome'
// TODO: Point this to your repo
const repo = 'blazing/awesome'
// TODO: Point this to your package.json
const packagePath = './package.json' // will probably be '../package.json'
// TODO: Point this to your README.md
const readmePath = './README.md' // will probably be '../README.md'
// TODO: Point this to your docs folder
const docsPath = './docs' // will probably be '../docs'
// TODO: Choose your smackdown settings for syntax highlighting
process.env.SMACKDOWN_SYNTAX = JSON.stringify({
  showLineNumbers: true,
  highlighter: 'hljs',
  theme: 'atom-one-light',
  languages: ['javascript'],
})
// TODO: Build the sidebar menu for the docs section
const menu = [
  {
    name: 'Readme',
    link: '/docs/',
  },
  {
    name: 'Documentation',
    // Without a link, this is just a group in the sidebar
    children: [
      {
        // This will be nested inside of the Documentation group
        name: 'Overview',
        link: '/docs/overview',
      },
    ],
  },
]
// TODO: Add the page sources for the docs
const docPages = [
  {
    path: 'docs/',
    title: 'Readme',
    markdownSrc: './README.md',
  },
  {
    path: 'docs/overview',
    title: 'Documentation Overview',
    markdownSrc: './docs/overview.md',
  },
]

// Watch markdown files you use and hot-load the changes
chokidar.watch(readmePath).on('all', () => reloadRoutes())
chokidar.watch(docsPath).on('all', () => reloadRoutes())
// Form the full repoURL
const repoURL = `https://github.com/${repo}`
// Set the version
// eslint-disable-next-line
process.env.REPO_VERSION = require(path.resolve(packagePath)).version

export default {
  getSiteData: () => ({
    // This is the sidebar menu on docs pages
    menu,
    repo,
    repoURL,
    repoName,
  }),
  getRoutes: () => [
    {
      path: '/',
      component: 'src/containers/Home',
    },
    // Make the docs routes
    ...docPages.map(page => ({
      // Nest these routes under the docs path
      path: page.path,
      component: 'src/containers/Doc', // Use the Doc template
      getData: () => ({
        // Pass the page title
        title: page.title,
        // Parse the markdown
        markdown: readFileContents(page.markdownSrc),
        // Construct the edit path
        editPath: path.join(repoURL, 'blob/master', __dirname.split('/').pop(), page.markdownSrc),
      }),
    })),
    {
      is404: true,
      component: 'src/containers/404',
    },
  ],
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

function readFileContents (src) {
  return fs.readFileSync(path.resolve(src), 'utf8')
}
