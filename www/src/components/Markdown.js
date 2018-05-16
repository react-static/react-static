import React, { PureComponent } from 'react'
import { Link } from 'react-static'
import { Markdown as Smackdown } from 'react-smackdown'
import styled from 'styled-components'

const syntax = { showLineNumber: true }

const renderers = {
  a: ({ href = '', ...rest }) => {
    const to = href.startsWith('/') ? href.replace('.md', '') : href
    return <Link to={to} {...rest} />
  },
}

class Markdown extends PureComponent {
  render () {
    const { source } = this.props

    console.log(source)
    return <Smackdown source={source} renderers={renderers} />
  }
}

export default Markdown
