/* eslint-disable import/no-mutable-exports */

import axios from 'axios'
import { createPool, cleanPath, pathJoin } from '../utils/shared'

export const routeInfoByPath = {}
export const propsByHash = {}
const erroredPaths = {}
const inflightRouteInfo = {}
const inflightPropHashes = {}
let loading = false
let loadingSubscribers = []

const prefetchPool = createPool({
  concurrency: Number(process.env.REACT_STATIC_PREFETCH_RATE) || 10,
})

export const reloadRouteData = () => {
  // Delete all cached data
  [routeInfoByPath, propsByHash, erroredPaths, inflightRouteInfo, inflightPropHashes].forEach(
    part => {
      Object.keys(part).forEach(key => {
        delete part[key]
      })
    }
  )
  // Force each RouteData component to reload
  global.reloadAll()
}

if (process.env.REACT_STATIC_ENV === 'development') {
  const io = require('socket.io-client')
  const run = async () => {
    const { data: { port } } = await axios.get('/__react-static__/getMessagePort')
    const socket = io(`http://localhost:${port}`)
    socket.on('connect', () => {
      console.log('React-Static websocket connected. Listening for data changes...')
    })
    socket.on('message', ({ type }) => {
      if (type === 'reloadRoutes') {
        reloadRouteData()
      }
    })
  }
  run()
}

export const getRouteInfo = async path => {
  if (typeof document === 'undefined') {
    return
  }
  const originalPath = path
  path = cleanPath(path)
  // Check the cache first
  if (routeInfoByPath[path]) {
    return routeInfoByPath[path]
  }
  if (erroredPaths[path]) {
    return
  }
  // If there is no inflight request for the info, let it fly.
  if (!inflightRouteInfo[path]) {
    inflightRouteInfo[path] = (async () => {
      try {
        if (process.env.REACT_STATIC_ENV === 'development') {
          // In dev, request from the webpack dev server
          const { data } = await axios.get(
            `/__react-static__/routeInfo/${path === '/' ? '' : path}`
          )
          return data
        }
        // In production, request from route's routeInfo.json
        const { data } = await axios.get(
          `${process.env.REACT_STATIC_PUBLIC_PATH}${pathJoin(
            path,
            `routeInfo.json?${process.env.REACT_STATIC_CACHE_BUST}`
          )}`
        )
        return data
      } catch (err) {
        erroredPaths[path] = true
        console.warn(
          `Could not load routeInfo for path: ${originalPath}. If this is a static route, make sure any link to this page is valid! If this is not a static route, you can desregard this warning.`
        )
      }
    })()
  }
  const routeInfo = await inflightRouteInfo[path]
  delete inflightRouteInfo[path]
  routeInfoByPath[path] = routeInfo
  return routeInfoByPath[path]
}

export async function prefetchData (path, { priority } = {}) {
  // Get route info so we can check if path has any data
  const routeInfo = await getRouteInfo(path)

  // Not a static route? Bail out.
  if (!routeInfo) {
    return
  }

  // Defer to the cache first. In dev mode, this should already be available from
  // the call to getRouteInfo
  if (routeInfo.allProps) {
    return routeInfo.allProps
  }

  // Request and build the props one by one
  const allProps = {
    ...(routeInfo.localProps || {}),
  }

  // Request the template and loop over the routeInfo.sharedPropsHashes, requesting each prop
  await Promise.all(
    Object.keys(routeInfo.sharedPropsHashes).map(async key => {
      const hash = routeInfo.sharedPropsHashes[key]

      // Check the propsByHash first
      if (!propsByHash[hash]) {
        // Reuse request for duplicate inflight requests
        try {
          if (!inflightPropHashes[hash]) {
            if (priority) {
              inflightPropHashes[hash] = axios.get(
                `${process.env.REACT_STATIC_PUBLIC_PATH}staticData/${hash}.json`
              )
            } else {
              inflightPropHashes[hash] = prefetchPool.add(() =>
                axios.get(`${process.env.REACT_STATIC_PUBLIC_PATH}staticData/${hash}.json`)
              )
            }
          }
          const { data: prop } = await inflightPropHashes[hash]

          // Place it in the cache
          propsByHash[hash] = prop
        } catch (err) {
          console.error('Error: There was an error retrieving a prop for this route! hashID:', hash)
          console.error(err)
        }
        delete inflightPropHashes[hash]
      }

      // Otherwise, just set it as the key
      allProps[key] = propsByHash[hash]
    })
  )

  // Cache the entire props for the route
  routeInfo.allProps = allProps

  // Return the props
  return routeInfo.allProps
}

export async function prefetchTemplate (path, { priority } = {}) {
  // Clean the path
  path = cleanPath(path)
  // Get route info so we can check if path has any data
  const routeInfo = await getRouteInfo(path)

  if (routeInfo) {
    registerTemplateIDForPath(path, routeInfo.templateID)
  }

  // Preload the template if available
  const pathTemplate = getComponentForPath(path)
  if (pathTemplate && pathTemplate.preload) {
    if (priority) {
      await pathTemplate.preload()
    } else {
      await prefetchPool.add(() => pathTemplate.preload())
    }
    routeInfo.templateLoaded = true
    return pathTemplate
  }
}

export async function needsPrefetch (path) {
  // Clean the path
  path = cleanPath(path)

  if (!path) {
    return false
  }

  // Get route info so we can check if path has any data
  const routeInfo = await getRouteInfo(path)

  // Not a static route? Bail out.
  if (!routeInfo) {
    return true
  }

  // Defer to the cache first
  if (!routeInfo.allProps || !routeInfo.templateLoaded) {
    return true
  }
}

export async function prefetch (path, options = {}) {
  // Clean the path
  path = cleanPath(path)

  const { type } = options

  if (type === 'data') {
    return prefetchData(path, options)
  } else if (type === 'template') {
    await prefetchTemplate(path, options)
    return
  }

  const [data] = await Promise.all([prefetchData(path), prefetchTemplate(path)])
  return data
}

export const setLoading = d => {
  if (loading !== d) {
    loading = d
    loadingSubscribers.forEach(s => s())
  }
}

export const onLoading = cb => {
  const ccb = () => cb(loading)
  loadingSubscribers.push(ccb)
  return () => {
    loadingSubscribers = loadingSubscribers.filter(d => d !== ccb)
  }
}

export function getComponentForPath (path) {
  path = cleanPath(path)
  return global.reactStaticGetComponentForPath && global.reactStaticGetComponentForPath(path)
}

export function registerTemplateIDForPath (path, templateID) {
  path = cleanPath(path)
  return (
    global.reactStaticGetComponentForPath &&
    global.reactStaticRegisterTemplateIDForPath(path, templateID)
  )
}
