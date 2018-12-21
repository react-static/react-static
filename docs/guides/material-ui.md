# Material UI

To use Material-UI in React Static:

- Install Material UI and its dependencies
- Install the `react-static-plugin-jss` plugin
- Configure `react-static-plugin-jss` to use a Material UI's `createGenerateClassName` instance
- Use Material-UI as normal

```javascript
// static.config.js
import {
  createMuiTheme,
  createGenerateClassName,
} from '@material-ui/core/styles'

const generateClassName = createGenerateClassName()

export default {
  plugins: [
    [
      'react-static-plugin-jss',
      {
        providerProps: {
          generateClassName,
        },
      },
    ],
  ],
}
```
