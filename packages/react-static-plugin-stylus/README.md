# react-static-plugin-less

A [React-Static](https://react-static.js.org) plugin that adds loader and SSR support for [less](https://github.com/developit/less)

## Installation

In an existing react-static site run:

```bash
$ yarn add react-static-plugin-less
```

Then add the plugin to your `static.config.js`:

```javascript
export default {
  plugins: ["react-static-plugin-less"]
};
```

## With Options

```javascript
export default {
  plugins: [
    [
      "react-static-plugin-less",
      {
        includePaths: ["..."] // always includes `src/`
        // other options for the less-loader
      }
    ]
  ]
};
```
