import { reloadRoutes } from 'react-static/node'
import fs from 'fs-extra'
import path from 'path'
import React, { Component } from 'react'
import { ServerStyleSheet } from 'styled-components'
import chokidar from 'chokidar'

chokidar.watch('../docs').on('all', () => reloadRoutes())

//

const repo = 'https://github.com/nozzle/react-static'

try {
  // eslint-disable-next-line
  process.env.REPO_VERSION = require(path.resolve('../package.json')).version
} catch (err) {
  //
}

process.env.SMACKDOWN_SYNTAX = JSON.stringify({
  showLineNumbers: true,
  highlighter: 'hljs',
  theme: 'atom-one-light',
  languages: ['javascript'],
})

const pages = [
  {
    path: '/',
    title: 'Readme',
    markdownSrc: '../README.md',
  },
  {
    path: 'concepts',
    title: 'Concepts',
    markdownSrc: '../docs/concepts.md',
  },
  {
    path: 'config',
    title: 'Config',
    markdownSrc: '../docs/config.md',
  },
  {
    path: 'cli',
    title: 'CLI',
    markdownSrc: '../docs/cli.md',
  },
  {
    path: 'node-api',
    title: 'Node API',
    markdownSrc: '../docs/node-api.md',
  },
  {
    path: 'components',
    title: 'Components',
    markdownSrc: '../docs/components.md',
  },
  {
    path: 'methods',
    title: 'Methods',
    markdownSrc: '../docs/methods.md',
  },
  {
    path: 'changelog',
    title: 'Changelog',
    markdownSrc: '../CHANGELOG.md',
  },
  {
    path: 'contributing',
    title: 'Contributing',
    markdownSrc: '../CONTRIBUTING.md',
  },
]

const menu = [
  {
    name: 'Readme',
    link: '/docs/',
  },
  {
    name: 'Core Concepts',
    children: [
      { name: 'Overview', link: '/docs/concepts' },
      {
        name: 'CSS and CSS-in-JS',
        link: '/docs/concepts#css-and-css-in-js',
      },
      {
        name: 'Code, Data, and Prop Splitting',
        link: '/docs/concepts#code-data-and-prop-splitting',
      },
      {
        name: 'Writing universal, "node-safe" code',
        link: '/docs/concepts/#writing-universal-node-safe-code',
      },
      { name: 'Environment Variables', link: '/docs/concepts/#environment-variables' },
      {
        name: 'Building your site for production',
        link: '/docs/concepts/#building-your-site-for-production',
      },
      { name: 'Continuous Integration', link: '/docs/concepts/#continuous-integration' },
      { name: 'Hosting', link: '/docs/concepts/#hosting' },
      { name: 'Using a CMS', link: '/docs/concepts/#using-a-cms' },
      {
        name: 'Rebuilding your site with Webhooks',
        link: '/docs/concepts/#rebuilding-your-site-with-webhooks',
      },
      { name: '404 Handling', link: '/docs/concepts/#404-handling' },
      { name: 'Non-Static Routing', link: '/docs/concepts/#non-static-routing' },
      {
        name: 'Webpack Customization and Plugins',
        link: '/docs/concepts/#webpack-customization-and-plugins',
      },
      {
        name: 'Using Preact in Production',
        link: '/docs/concepts/#using-preact-in-production',
      },
      { name: 'Pagination', link: '/docs/concepts/#pagination' },
      { name: 'Browser Support', link: '/docs/concepts/#browser-support' },
    ],
  },
  {
    name: 'API Reference',
    children: [
      {
        name: 'Config (static.config.js)',
        link: '/docs/config',
      },
      {
        name: 'CLI',
        link: '/docs/cli',
      },
      {
        name: 'Node API',
        link: '/docs/node-api',
      },
      {
        name: 'Components',
        link: '/docs/components',
      },
      {
        name: 'Methods',
        link: '/docs/methods',
      },
    ],
  },
  {
    name: 'Changelog',
    link: '/docs/changelog',
  },
  {
    name: 'Contributing',
    link: '/docs/contributing',
  },
]

export default {
  getSiteData: () => ({
    menu,
  }),
  getRoutes: () => [
    {
      path: '/',
      component: 'src/containers/Home',
    },
    ...pages.map(page => ({
      path: `docs/${page.path}`,
      component: 'src/containers/Doc',
      getData: () => ({
        markdown: fs.readFileSync(path.resolve(page.markdownSrc), 'utf8'),
        editPath: path.join(repo, 'blob/master', __dirname.split('/').pop(), page.markdownSrc),
        title: page.title,
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
            <title>React Static</title>
          </Head>
          <Body>{children}</Body>
        </Html>
      )
    }
  },
}
