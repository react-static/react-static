import React, { PureComponent } from 'react'
import { Link } from '@reach/router'
import { Markdown as Smackdown } from 'react-smackdown'
import styled from 'styled-components'
//
const HashLinked = styled.a`
  display: block;
  position: relative;
  color: inherit;

  :before {
    opacity: 0;
    content: '🔗';
    display: inline-block;
    position: absolute;
    top: 50%;
    transition: all 0.2s ease;
    transform: translate(-100%, -50%) scale(0.8);
  }

  :hover {
    :before {
      opacity: 1;
    }
  }
`
const Header = Type => ({ id, ...rest }) => (
  <HashLinked href={`#${id}`}>
    <Type id={id} {...rest} />
  </HashLinked>
)
const renderers = {
  a: ({ href = '', ...rest }) => {
    const to = href.startsWith('/') ? href.replace('.md', '') : href
    return <Link to={to} {...rest} />
  },
  h1: Header('h1'),
  h2: Header('h2'),
  h3: Header('h3'),
  h4: Header('h4'),
  h5: Header('h5'),
  h6: Header('h6'),
}
class Markdown extends PureComponent {
  render() {
    const { source } = this.props
    return <Smackdown source={source} renderers={renderers} />
  }
}
export default Markdown
