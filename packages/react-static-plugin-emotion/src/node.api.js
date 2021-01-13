import React from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import createEmotionServer from '@emotion/server/create-instance';

const cache = createCache({
  key: 'react-static-styles',
});

const { renderStylesToString } = createEmotionServer(cache);

export default () => ({
  beforeRenderToElement: (App) => (props) => (
    <CacheProvider value={cache}>
      <App {...props} />
    </CacheProvider>
  ),
  // Tap into the beforeHtmlToDocument hook and use emotion-server
  // to critically inline the styles from the original
  // html into the a new html string
  beforeHtmlToDocument: renderStylesToString,
});
