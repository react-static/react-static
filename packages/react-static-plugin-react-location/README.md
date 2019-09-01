# react-static-plugin-react-location

A [React-Static](https://react-static.js.org) plugin that adds support for [react-location](https://github.com/react-static/react-static/tree/master/packages/react-static-plugin-react-location)

## Installation

- Install this plugin and peer dependencies:

```bash
$ yarn add react-static-plugin-react-location react-location
```

- Add the plugin to your `static.config.js`:

```javascript
export default {
  plugins: ['react-static-plugin-react-location'],
}
```

- Follow the [Dynamic Routes with React Location guide](/docs/guides/dynamic-routes-react-location.md) to configure your routes for both dynamic and static rendering

- (Optional) Configure the plugin:

```javascript
export default {
  plugins: [
    [
      'react-static-plugin-react-location',
      {
        LocationProviderProps: {
          // These props will be passed to the underlying `LocationProviderProps` component
        },
      },
    ],
  ],
}
```
