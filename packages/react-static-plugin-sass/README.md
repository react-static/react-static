# react-static-plugin-sass

A [React-Static](https://react-static.js.org) plugin that adds loader and SSR support for [sass](https://github.com/developit/sass)

## Installation

In an existing react-static site run:

```bash
$ yarn add react-static-plugin-sass
```

Then add the plugin to your `static.config.js`:

```javascript
export default {
  plugins: ["react-static-plugin-sass"]
};
```

## With Options

```javascript
export default {
  plugins: [
    [
      "react-static-plugin-sass",
      {
        includePaths: ["..."] // always includes `src/`
        cssLoaderOptions: {}, // options for the css-loader, like modules
        // other options for the sass-loader (https://github.com/sass/dart-sass#javascript-api)
      }
    ]
  ]
};
```

