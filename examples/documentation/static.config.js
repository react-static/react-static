import React, { Component } from 'react'
import { reloadRoutes } from 'react-static/node'
import fs from 'fs-extra'
import nodePath from 'path'
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
// TODO: Build the menu and pages for the site
const pages = [
  {
    path: 'docs',
    title: 'Readme',
    markdownSrc: readmePath,
  },
  {
    path: 'docs',
    title: 'Documentation',
    // Without a component or markdownSrc, this will just be a group in the sidebar
    children: [
      {
        path: 'overview',
        title: 'Overview',
        markdownSrc: 'docs/overview.md',
      },
    ],
  },
]

// Watch markdown files you use and hot-load the changes
chokidar.watch(readmePath).on('all', () => reloadRoutes())
chokidar.watch(docsPath).on('all', () => reloadRoutes())
// Form the full repoURL
const repoURL = `https://github.com/${repo}`
// Set the version
// eslint-disable-next-line
process.env.REPO_VERSION = require(nodePath.resolve(packagePath)).version

export default {
  disableDuplicateRoutesWarning: true,
  getSiteData: () => ({
    // This is the sidebar menu on docs pages
    pages: pagesToRoutes(pages),
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
    ...pagesToRoutes(pages),
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

function pagesToRoutes (pages) {
  return pages.map(({
    path, component, markdownSrc, title, children = [],
  }) => ({
    title,
    path,
    component:
      component || // Use the defined component if it exists
      (markdownSrc && 'src/containers/Doc'), // Use the Doc template for markdown files
    getData: () => ({
      // Pass the page title
      title,
      // Parse the markdown
      markdown: markdownSrc && readFileContents(markdownSrc),
      // Construct the edit path
      editPath: nodePath.join(
        repoURL,
        'blob/master',
        __dirname.split('/').pop(),
        component || markdownSrc || ''
      ),
    }),
    children: pagesToRoutes(children),
  }))
}

function readFileContents (src) {
  return fs.readFileSync(nodePath.resolve(src), 'utf8')
}
