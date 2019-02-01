# react-static-plugin-react-router

A [React-Static](https://react-static.js.org) plugin that adds support for [react-router](https://reacttraining.com/react-router/web/guides/quick-start)

## Installation

- Install this plugin and peer dependencies:

```bash
$ yarn add react-static-plugin-react-router react-router-dom
```

- Add the plugin to your `static.config.js`:

```javascript
export default {
  plugins: ['react-static-plugin-react-router'],
}
```

- Follow the [Dynamic Routes with React Router guide](/docs/guides/dynamic-routes-react-router.md) to configure your routes for both dynamic and static rendering

- (Optional) Configure the plugin:

```javascript
export default {
  plugins: [
    [
      'react-static-plugin-react-router',
      {
        RouterProps: {
          // These props will be passed to the underlying `Router` component
        },
      },
    ],
  ],
}
```
