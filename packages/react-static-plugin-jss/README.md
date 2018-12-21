# react-static-plugin-jss

A [React-Static](https://react-static.js.org) plugin that adds CSS-in-JS/SSR support for [jss](https://cssinjs.org)

## Installation

- Install this plugin and peer dependencies:

```bash
$ yarn add react-static-plugin-jss react-jss
```

- Add the plugin to your `static.config.js`:

```javascript
export default {
  plugins: ['react-static-plugin-jss'],
}
```

- Configure it with options:

```javascript
export default {
  plugins: [
    [
      'react-static-plugin-jss',
      {
        providerProps: {
          // These props will be passed to the underlying `JssProvider` component instance
        }
      }
    ]
  ],
}
```
