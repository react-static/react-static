# react-static-plugin-reach-router

A [React-Static](https://react-static.js.org) plugin that adds support for [@reach/router](https://reach.tech/router)

## Installation

- Install this plugin and peer dependencies:

```bash
$ yarn add react-static-plugin-reach-router @reach/router
```

- Add the plugin to your `static.config.js`:

```javascript
export default {
  plugins: ['react-static-plugin-reach-router'],
}
```

- Follow the [Dynamic Routes with Reach Router guide](/docs/guides/dynamic-routes-reach-router.md) to configure your routes for both dynamic and static rendering

- (Optional) Configure the plugin:

```javascript
export default {
  plugins: [
    [
      'react-static-plugin-reach-router',
      {
        RouterProps: {
          // These props will be passed to the underlying `Router` component
        },
      },
    ],
  ],
}
```
