import React, { PureComponent } from 'react'
import { Link } from 'react-static'
import Smackdown from 'react-smackdown'
import styled from 'styled-components'

const syntax = JSON.parse(process.env.SMACKDOWN_SYNTAX)

let theme
const languages = []

if (syntax.theme) {
  if (syntax.highlighter === 'prism') {
    // eslint-disable-next-line
    theme = require(`react-syntax-highlighter/dist/styles/prism/${syntax.theme}`).default
  } else {
    // eslint-disable-next-line
    theme = require(`react-syntax-highlighter/dist/styles/hljs/${syntax.theme}`).default
  }
}

if (syntax.languages) {
  syntax.languages.forEach(name =>
    languages.push({
      name,
      // eslint-disable-next-line
      syntax: require(`react-syntax-highlighter/dist/languages/${syntax.highlighter}/${name}`)
        .default,
    })
  )
}

const renderers = {
  a: ({ href = '', ...rest }) => {
    const to = href.startsWith('/') ? href.replace('.md', '') : href
    return <Link to={to} {...rest} />
  },
}

class Markdown extends PureComponent {
  render () {
    const { source } = this.props

    const resolvedSyntax = {
      ...syntax,
      languages,
      theme,
      lineNumberStyle: { opacity: 0.5 },
    }

    return <Smackdown source={source} syntax={resolvedSyntax} renderers={renderers} />
  }
}

export default Markdown
