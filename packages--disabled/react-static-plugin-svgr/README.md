# react-static-plugin-svgr

A [React-Static](https://react-static.js.org) plugin that adds [@svgr/webpack](https://github.com/gregberge/svgr/tree/main/packages/webpack) loader

## Installation

In an existing react-static site run:

```bash
$ yarn add react-static-plugin-svgr
```

Then add the plugin to your `static.config.js`:

```javascript
export default {
  plugins: ["react-static-plugin-svgr"]
};
```

## With Options

```javascript
export default {
  plugins: [
    [
      "react-static-plugin-svgr",
      {
        svgo: true,
        svgoOptions: {
          plugins: [
            {
              removeViewBox: false
            }
          ],
          memo: true
        // other options for the @svgr/webpack (https://react-svgr.com/docs/webpack)
      }
    ]
  ]
};
```

