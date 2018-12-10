# react-static-plugin-css-modules

A [React-Static](https://react-static.js.org) plugin that adds loader and SSR support for [css modules](https://github.com/css-modules/css-modules)

## Installation

In an existing react-static site run:

```bash
$ yarn add react-static-plugin-css-modules
```

Then add the plugin to your `static.config.js`:

```javascript
export default {
  plugins: ["react-static-plugin-css-modules"]
};
```

## With Options

```javascript
export default {
  plugins: [
    [
      "react-static-plugin-css-modules",
      {
        includePaths: ["..."] // always includes `src/`
        // other options for the sass-loader
      }
    ]
  ]
};
```
