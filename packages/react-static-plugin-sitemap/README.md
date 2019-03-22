# react-static-plugin-sitemap

A [React-Static](https://react-static.js.org) plugin for exporting sitemap information.

## Installation

In an existing react-static site run:

```bash
$ yarn add react-static-plugin-sitemap
```

Then add the plugin to your `static.config.js`:

```javascript
export default {
  plugins: ['react-static-plugin-sitemap'],
}
```

## Usage

- A `config.siteRoot` is required for this plugin to work properly, since sitemap's are required to use full
- Each route in your site will createt a `<url>` item in the sitemap
- By default, the url's `<loc>` tag will be set to the prefixed path of each route.
- All property/value pairs under a route's `sitemap` object will be used as xml tags for that route, eg.

  ```javascript
  export default {
    siteRoot: 'https://hello.com'
  }
  const routes = [
    {
      path: '/blog/post/1',
      sitemap: {
        lastmod: '10/10/2010',
        priority: 0.5,
      },
    },
  ]

  // Would result in the <url>:

  <url>
    <loc>https://hello.com/blog/post/1</loc>
    <lastmod>10/10/2010</lastmod>
    <priority>0.5</priority>
  </url>
  ```

## With Options

```javascript
export default {
  plugins: [
    [
      'react-static-plugin-sitemap',
      {
        getAttributes: route => ({
          customXmlAttribute: route.customProperty,
        }),

        // Given a route where route.customProperty === 40,
        // This would create a <customXmlAttribute></customXmlAttribute>
        // in that routes <url></url> tag
      },
    ],
  ],
}
```
