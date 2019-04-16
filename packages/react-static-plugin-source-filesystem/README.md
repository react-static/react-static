# react-static-plugin-source-filesystem

A [React-Static](https://react-static.js.org) plugin that adds support for recursively importing routes from a directory

## Installation

In an existing react-static site run:

```bash
$ yarn add react-static-plugin-source-filesystem
```

Then add the plugin to your `static.config.js` with a valid `location` directory in the options:

```javascript
...
import path from 'path'
...
export default {
  plugins: [
    [
      'react-static-plugin-source-filesystem',
      {
        location: path.resolve('./src/pages'),
      },
    ],
  ],
}
```
