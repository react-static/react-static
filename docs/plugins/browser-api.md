## Browser Plugin API

## `Router`

Replace or decorate the Router component used in React Static's `Root` component.

- Must be a react or functional component that returns its contents wrapped in a `<React.Fragment>`.

#### Props

| Prop                 | Description                                                                                            | Required |
| -------------------- | ------------------------------------------------------------------------------------------------------ | -------- |
| children             | The children to be rendered in the router                                                              | true     |
| basepath             | The resolved basepath for the app as set in static.config.js                                           | true     |
| staticInfo: { path } | The static info for the route currently being exported. This is only available during the `node` stage | true     |

#### Example

For a more detailed example, see the [react-static-plugin-react-router](/packages/react-static-plugin-react-router) plugin. Below is a summarized and contrived example to show the overall API of this hook

```javascript
// browser.api.js

export default pluginOptions => ({
  Router: PreviousRouter => ({ children, basepath, staticInfo }) => (
    <MyCustomRouter basepath={basepath} location={staticInfo.path}>
      {children}
    </MyCustomRouter>
  ),
})
```
