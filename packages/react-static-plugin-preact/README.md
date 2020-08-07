# react-static-plugin-preact

A [React-Static](https://react-static.js.org) plugin that adds support for [preact](https://github.com/developit/preact)

## Installation

In an existing react-static site run:

```bash
$ yarn add react-static-plugin-preact
```

Then add the plugin to your `static.config.js`:

```javascript
export default {
  plugins: ["react-static-plugin-preact"]
};
```

As final step, depending on the template you started with, you might need to remove the React Hot Reload component from `index.js`. Change:

```
  const render = Comp => {
    renderMethod(
      <AppContainer>
        <Comp />
      </AppContainer>,
      target
    )
  }
```

to:

```
  const render = Comp => {
    renderMethod(
      <Comp />,
      target
    )
  }
```
