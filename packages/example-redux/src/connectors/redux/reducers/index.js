import { combineReducers } from 'redux'

import counter from './counter'

const reducer = combineReducers({
  counter,
})

export default reducer
