import React from 'react'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'

const cache = createCache({
  key: 'react-static-styles',
  speedy: false,
})

export default () => ({
  beforeRenderToElement: App => props => (
    <CacheProvider value={cache}>
      <App {...props} />
    </CacheProvider>
  ),
})
