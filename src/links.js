import React from 'react'
import {
  Link as ReactRouterLink,
  NavLink as ReactRouterNavLink,
} from 'react-router-dom'

function isRoutingUrl (to) {
  if (typeof to !== 'string') return true
  return !to.match(/^#/) && !to.match(/^[a-z]{1,10}:\/\//) && !to.match(/^(data|mailto):/) && !to.match(/^\/\//)
}

const reactRouterProps = ['activeClassName', 'activeStyle', 'exact', 'isActive', 'location', 'strict', 'to', 'replace']

function domLinkProps (props) {
  const result = Object.assign({}, props)

  result.href = result.to
  result.to = undefined

  reactRouterProps.filter(prop => result[prop]).forEach(prop => {
    console.warn(`Warning: ${prop} makes no sense on a <Link to="${props.to}">.`)
  })
  reactRouterProps.forEach(prop => delete result[prop])

  return result
}

export function Link (props) {
  if (isRoutingUrl(props.to)) return <ReactRouterLink {...props} />
  return <a {...domLinkProps(props)}>{props.children}</a>
}

export function NavLink (props) {
  if (isRoutingUrl(props.to)) return <ReactRouterNavLink {...props} />
  return <a {...domLinkProps(props)}>{props.children}</a>
}
