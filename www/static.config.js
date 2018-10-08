import { reloadRoutes } from 'react-static/node'
import fs from 'fs-extra'
import path from 'path'
import React, { Component } from 'react'
import chokidar from 'chokidar'

chokidar.watch('../docs').on('all', () => reloadRoutes())

//

const repoName = 'React Static'
const repo = 'nozzle/react-static'
const repoURL = `https://github.com/${repo}`

try {
  // eslint-disable-next-line
  process.env.REPO_VERSION = require(path.resolve('../packages/react-static/package.json')).version
} catch (err) {
  //
}

const docPages = [
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
    path: 'plugins',
    title: 'Plugins',
    markdownSrc: '../docs/plugins.md',
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
    path: 'browser',
    title: 'Browser',
    markdownSrc: '../docs/browser.md',
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
    link: '/docs/concepts',
  },
  {
    name: 'Plugins',
    link: '/docs/plugins',
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
        link: '/docs/browser',
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
  plugins: ['react-static-plugin-styled-components'],
  getSiteData: () => ({
    menu,
    repoName,
  }),
  getRoutes: () => [
    ...docPages.map(page => ({
      path: `docs/${page.path}`,
      component: 'src/containers/Doc',
      getData: () => ({
        markdown: fs.readFileSync(path.resolve(page.markdownSrc), 'utf8'),
        editPath:
          repoURL + path.join('/blob/master/', __dirname.split('/').pop(), page.markdownSrc),
        title: page.title,
      }),
    })),
  ],
  Document: class CustomHtml extends Component {
    render () {
      const {
        Html, Head, Body, children,
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
            <title>{repoName}</title>
          </Head>
          <Body>{children}</Body>
        </Html>
      )
    }
  },
}
