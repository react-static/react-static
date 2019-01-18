# react-static-plugin-mdx

A [React-Static](https://react-static.js.org) plugin that adds loader support for [mdx](https://github.com/mdx-js/mdx)

## Installation

- In an existing react-static site run:

```bash
$ yarn add react-static-plugin-mdx
```

- Then add the plugin to your `static.config.js`:

```javascript
export default {
  plugins: ["react-static-plugin-mdx"]
};
```

- You can now use `.md` or `.mdx` files in your `/pages` directory and route components.

## With Options

```javascript
export default {
  plugins: [
    [
      "react-static-plugin-mdx",
      {
        includePaths: ["..."], // Additional include paths on top of the default jsLoader paths
        extensions: ['.md', '.mdx'] // NOTE: these are the default extensions
      }
    ]
  ]
};
```
