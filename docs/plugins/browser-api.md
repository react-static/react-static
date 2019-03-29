## Browser Plugin API

## `Root`

Decorate the Root component used in React Static.

### Props

| Prop     | Description                         | Required |
| -------- | ----------------------------------- | -------- |
| children | The main app content to be rendered | true     |

### Example

For a more detailed example, see the [react-static-plugin-react-router](/packages/react-static-plugin-react-router) plugin. Below is a summarized and contrived example to show the overall API of this hook

```javascript
// browser.api.js

export default pluginOptions => ({
  Root: PreviousRoot => ({ children, ...rest }) => {
    return (
      // A wrapper div around the app Root!
      <div {...rest}>
        <PreviousRoot>{children}</PreviousRoot>
      </div>
    )
  },
})
```

## `Routes`

Decorate the Routes component used in React Static.

### Props

| Prop     | Description                              | Required |
| -------- | ---------------------------------------- | -------- |
| children | The current route content to be rendered | true     |

### Example

```javascript
// browser.api.js

export default pluginOptions => ({
  Routes: PreviousRoutes => ({ children, ...rest }) => {
    return (
      // A wrapper div around Routes!
      <div {...rest}>
        <PreviousRoutes>{children}</PreviousRoutes>
      </div>
    )
  },
})
```
