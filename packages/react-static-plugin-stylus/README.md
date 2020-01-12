# react-static-plugin-stylus

A [React-Static](https://react-static.js.org) plugin that adds loader and SSR support for [stylus](http://stylus-lang.com/)

## Installation

In an existing react-static site run:

```bash
$ yarn add react-static-plugin-stylus
```

Then add the plugin to your `static.config.js`:

```javascript
export default {
  plugins: ["react-static-plugin-stylus"]
};
```

## With Options

```javascript
export default {
  plugins: [
    [
      "react-static-plugin-stylus",
      {
        cssLoaderOptions: {}, // options for the css-loader, like modules
        // other options for the stylus-loader
      }
    ]
  ]
};
```
