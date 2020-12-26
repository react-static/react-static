# Material UI

To use Material UI's server-side rendering (SSR) with React Static:

1. Install Material UI and its dependencies
1. Add the plugin file below and modify your config as shown
1. Use Material UI as normal

```js
// your_app/plugins/jss-provider/node.api.js

import { ServerStyleSheets } from '@material-ui/core/styles';

export default () => ({
  beforeRenderToHtml: (App, { meta }) => {
    meta.muiSheets = new ServerStyleSheets();
    return meta.muiSheets.collect(App);
  },

  headElements: (elements, { meta }) => [
    ...elements,
    meta.muiSheets.getStyleElement(),
  ],
});

```

```js
// your_app/static.config.js

export default {
  plugins: ['jss-provider'],
};
```

Note the above is not required for your app to work; it simply enables including MUI's JSS in your static bundle. Read more [here](https://material-ui.com/guides/server-rendering/).
