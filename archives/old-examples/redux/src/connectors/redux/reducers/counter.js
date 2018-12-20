const initialState = {
  count: 0,
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + 1,
      }
    case 'RESET':
      return {
        ...state,
        count: 0,
      }
    default:
      return state
  }
}
