import { createStore } from 'redux'

import reducer from './reducers'

if (typeof window === 'undefined') {
  global.window = {}
}

/* eslint-disable no-underscore-dangle */
const store = createStore(
  reducer,
  {}, // initial state
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
)
/* eslint-enable */

export default store
