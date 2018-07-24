import React from 'react'
//
import { loading, onLoading } from '../methods'

//

export default class Loading extends React.Component {
  state = {
    loading,
  }

  componentWillMount() {
    this.unsubscribe = onLoading(loading =>
      this.setState({
        loading,
      })
    )
  }

  render() {
    const { component, render, children, ...rest } = this.props
    const finalProps = {
      ...rest,
      loading: this.state.loading,
    }
    if (component) {
      return React.createElement(component, finalProps, children)
    }
    if (render) {
      return render(finalProps)
    }
    return children(finalProps)
  }
}

export function withLoading(Comp) {
  return function ConnectedLoading(props) {
    return <Loading component={Comp} {...props} />
  }
}
