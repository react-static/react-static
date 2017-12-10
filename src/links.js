import React from 'react'
import {
  Link as ReactRouterLink,
  NavLink as ReactRouterNavLink,
} from 'react-router-dom'

function isRoutingUrl (to) {
  if (typeof to !== 'string') return true
  return !to.match(/^#/) && !to.match(/^[a-z]{1,10}:\/\//)
}

export function Link (props) {
  if (isRoutingUrl(props.to)) return <ReactRouterLink {...props} />
  return <a href={props.to}>{props.children}</a>
}

export function NavLink (props) {
  if (isRoutingUrl(props.to)) return <ReactRouterNavLink {...props} />
  return <a href={props.to}>{props.children}</a>
}
