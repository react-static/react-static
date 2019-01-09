# react-static-plugin-mdx

A [React-Static](https://react-static.js.org) plugin that adds loader support for [mdx](https://github.com/mdx-js/mdx)

## Installation

In an existing react-static site run:

```bash
$ yarn add react-static-plugin-mdx
```

Then add the plugin to your `static.config.js`:

```javascript
export default {
  plugins: ["react-static-plugin-mdx"]
};
```

## With Options

```javascript
export default {
  plugins: [
    [
      "react-static-plugin-mdx",
      {
        includePaths: ["..."] // always includes `src/pages`
      }
    ]
  ]
};
```
