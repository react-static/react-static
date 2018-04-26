import React, { Component } from 'react'
import { reloadRoutes, normalizeRoutes } from 'react-static/node'
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
// TODO: Build the sidebar menu
const menu = [
  {
    path: '/',
    title: 'Home',
    component: 'src/containers/Home',
  },
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
    pages: JSON.parse(JSON.stringify(menuToRoutes(menu))),
    repo,
    repoURL,
    repoName,
  }),
  getRoutes: () => [
    // Make the routes for the menu pages
    ...menuToRoutes(menu),
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

function menuToRoutes (items) {
  // Normalize the routes with react-static's normalizer. Make sure it still returns
  // a tree, so we can use it as the sidebar structure. This will also
  // give us routes with full paths at each nesting level we can use in the menu
  const normalizedRoutes = normalizeRoutes(items, {
    tree: true,
    force404: false,
    disableDuplicateRoutesWarning: true,
  })

  // Now we need to use the title, markdown and component info to set up the right
  // components and routeData
  const mapWithComponentsAndData = items =>
    items.map(({
      path, originalPath, component, markdownSrc, title, children = [], ...rest
    }) => ({
      ...rest,
      fullPath: path,
      title,
      path: originalPath,
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
      children: mapWithComponentsAndData(children),
    }))

  return mapWithComponentsAndData(normalizedRoutes)
}

function readFileContents (src) {
  return fs.readFileSync(nodePath.resolve(src), 'utf8')
}
