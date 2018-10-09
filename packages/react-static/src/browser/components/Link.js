import React from 'react'
import { NavLink as ReactRouterNavLink } from 'react-router-dom'
//
import { isObject } from '../../utils/browser'
import PrefetchWhenSeen from './PrefetchWhenSeen'

//

// Detects internal link url schemas
function isRoutingUrl(to) {
  if (typeof to === 'undefined') return false
  return (
    !to.match(/^([A-z]?)+:/) && // starts with external protocol
    !to.match(/^#/) && // starts with hash fragment
    !to.match(/^[a-z]{1,10}:\/\//) // starts with double slash protocol
  )
}

const reactRouterProps = [
  'activeClassName',
  'activeStyle',
  'exact',
  'isActive',
  'location',
  'strict',
  'to',
  'replace',
]

function SmartLink({ prefetch = true, scrollToTop = true, onClick, ...rest }) {
  const { to } = rest
  let resolvedTo = to
  if (isObject(to)) {
    if (!to.pathname && to.path) {
      console.warn(
        'You are using the `path` key in a <Link to={...} /> when you should be using the `pathname` key. This will be deprecated in future versions!'
      )
      to.pathname = to.path
      delete to.path
      resolvedTo = to.pathname
    } else if (to.pathname) {
      resolvedTo = to.pathname
    }
  }
  // Router Link
  if (isRoutingUrl(resolvedTo)) {
    const finalRest = {
      ...rest,
      onClick: e => {
        if (typeof document !== 'undefined' && !scrollToTop) {
          window.__noScrollTo = true
        }
        if (onClick) {
          onClick(e)
        }
      },
    }

    if (prefetch) {
      return (
        <PrefetchWhenSeen
          path={resolvedTo}
          type={prefetch}
          render={({ handleRef }) => (
            <ReactRouterNavLink {...finalRest} innerRef={handleRef} />
          )}
        />
      )
    }
    return <ReactRouterNavLink {...finalRest} />
  }

  // Browser Link
  const { children, ...aRest } = rest
  aRest.href = aRest.to
  delete aRest.to

  reactRouterProps.filter(prop => aRest[prop]).forEach(prop => {
    console.warn(
      `Warning: ${prop} makes no sense on a <Link to="${aRest.href}">.`
    )
  })
  reactRouterProps.forEach(prop => delete aRest[prop])

  return <a {...aRest}>{children}</a>
}

export const Link = SmartLink
export const NavLink = SmartLink
