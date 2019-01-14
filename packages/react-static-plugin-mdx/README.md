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

You can now import `.md` or `.mdx` files in your pages.

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

## Automatically generate routes
If you want React Static to generate routes for every `.md` or `.mdx` file in your `/pages` directory, you can add the extensions to the configuration:

```javascript
extensions: ['.js', '.jsx', '.md', '.mdx'],
```
