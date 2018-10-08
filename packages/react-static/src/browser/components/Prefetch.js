import React from 'react'

import { cleanPath, unwrapArray } from '../../utils/shared'
import { prefetch } from '../'

export default class Prefetch extends React.Component {
  static defaultProps = {
    children: null,
    path: null,
    type: null,
    onLoad: () => {},
  }
  async componentDidMount() {
    const { path, onLoad, type } = this.props
    const cleanedPath = cleanPath(path)
    const data = await prefetch(cleanedPath, { type })
    onLoad(data, cleanedPath)
  }
  render() {
    return unwrapArray(this.props.children)
  }
}
