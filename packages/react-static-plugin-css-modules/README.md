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
         modules: true, // set true by default
         localIdentName: '[path][name]__[local]--[hash:base64:5]', // just an example
         // any other options you wish from css-loader
         // want to use sass? you can track it down in your webpack build and add the loader
         // otherwise open an issue tagging @ScriptedAlchemy. He will enhance the options if required 
       }
    ]
  ]
};
```
