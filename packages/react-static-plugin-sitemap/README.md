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
        hreflang: [
          {language:'x-default', url: '/blog/post/1'},
          {language:'en', url: '/blog/post/1'},
          {language:'de-DE', url: '/de/blog/post/1'},
        ],
        lastmod: '10/10/2010',
        priority: 0.5,
        'image:image': {
          'image:loc': `https://raw.githubusercontent.com/react-static/react-static/master/media/react-static-logo-2x.png`,
          'image:caption': 'React Static',
        },
      },
    },
    {
      path: '/blog/draft/2',
      sitemap: {
        noindex: true // Excludes route from sitemap.xml
      },
    },
  ]
  ```

  Would result in the following XML:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://hello.com/blog/post/1/</loc>
    <lastmod>10/10/2010</lastmod>
    <priority>0.5</priority>
    <image:image>
      <image:loc>https://raw.githubusercontent.com/react-static/react-static/master/media/react-static-logo-2x.png</image:loc>
      <image:caption>React Static</image:caption>
    </image:image>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://hello.com/blog/post/1/" />
    <xhtml:link rel="alternate" hreflang="en" href="https://hello.com/blog/post/1/" />
    <xhtml:link rel="alternate" hreflang="de-DE" href="https://hello.com/de/blog/post/1/" />
  </url>
</urlset>
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
