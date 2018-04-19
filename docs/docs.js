module.exports = {
  name: 'react-static',
  favicon: 'favicon.ico',
  cover: 'cover.png',
  repository: 'https://github.com/nozzle/react-static',
  license: 'MIT',
  root: './docs',
  logo: './logo.png',
  title: 'react-static',
  defaultDepth: 3,
  syntax: {
    showLineNumbers: true,
    highlighter: 'hljs',
    theme: 'atom-one-light',
    languages: ['javascript'],
  },
  sidebar: {
    items: [
      {
        name: 'Introduction',
        src: '../README.md',
      },
      {
        name: 'Core Concepts',
        expanded: true,
        children: [
          { name: 'Overview', src: 'concepts.md' },
          {
            name: 'CSS and CSS-in-JS',
            src: 'concepts.md#css-and-css-in-js',
          },
          {
            name: 'Code, Data, and Prop Splitting',
            src: 'concepts.md#code-data-and-prop-splitting',
          },
          {
            name: 'Writing universal, "node-safe" code',
            src: 'concepts.md#writing-universal-node-safe-code',
          },
          { name: 'Environment Variables', src: 'concepts.md#environment-variables' },
          {
            name: 'Building your site for production',
            src: 'concepts.md#building-your-site-for-production',
          },
          { name: 'Continuous Integration', src: 'concepts.md#continuous-integration' },
          { name: 'Hosting', src: 'concepts.md#hosting' },
          { name: 'Using a CMS', src: 'concepts.md#using-a-cms' },
          {
            name: 'Rebuilding your site with Webhooks',
            src: 'concepts.md#rebuilding-your-site-with-webhooks',
          },
          { name: '404 Handling', src: 'concepts.md#404-handling' },
          { name: 'Non-Static Routing', src: 'concepts.md#non-static-routing' },
          {
            name: 'Webpack Customization and Plugins',
            src: 'concepts.md#webpack-customization-and-plugins',
          },
          {
            name: 'Using Preact in Production',
            src: 'concepts.md#using-preact-in-production',
          },
          { name: 'Pagination', src: 'concepts.md#pagination' },
          { name: 'Browser Support', src: 'concepts.md#browser-support' },
        ],
      },
      {
        name: 'API Reference',
        expanded: true,
        children: [
          {
            name: 'Config (static.config.js)',
            src: 'config.md',
          },
          {
            name: 'CLI',
            src: 'cli.md',
          },
          {
            name: 'Node API',
            src: 'node-api.md',
          },
          {
            name: 'Components',
            src: 'components.md',
          },
          {
            name: 'Methods',
            src: 'methods.md',
          },
        ],
      },
      {
        name: 'Changelog',
        src: '../CHANGELOG.md',
      },
      {
        name: 'Contributing',
        src: '../CONTRIBUTING.md',
      },
    ],
  },
}
