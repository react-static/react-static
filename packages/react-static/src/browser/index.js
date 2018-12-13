import axios from 'axios'
//
import { createPool, getRoutePath, pathJoin } from './utils'
import onVisible from './utils/Visibility'

// RouteInfo / RouteData
export const routeInfoByPath = {}
export const routeErrorByPath = {}
export const propsByHash = {}
const inflightRouteInfo = {}
const inflightPropHashes = {}

const requestPool = createPool({
  concurrency: Number(process.env.REACT_STATIC_PREFETCH_RATE),
})

// Plugins
export const plugins = []

// Templates
export const templates = []
export const templateUpdated = { cb: () => {} }
export const registerTemplates = tmps => {
  templates.splice(0, Infinity, ...tmps)
  templateUpdated.cb()
}
const templateIndexByPath = {
  '404': 0,
}
export const templatesByPath = {
  '404': templates[0],
}
export const templateErrorByPath = {}

init()

// When in development, init a socket to listen for data changes
// When the data changes, we invalidate and reload all of the route data
function init() {
  // In development, we need to open a socket to listen for changes to data
  if (process.env.REACT_STATIC_ENV === 'development') {
    const io = require('socket.io-client')
    const run = async () => {
      try {
        const {
          data: { port },
        } = await axios.get('/__react-static__/getMessagePort')
        const socket = io(`http://localhost:${port}`)
        socket.on('connect', () => {
          console.log(
            'React-Static data hot-loader websocket connected. Listening for data changes...'
          )
        })
        socket.on('message', ({ type }) => {
          if (type === 'reloadRoutes') {
            reloadRouteData()
          }
        })
      } catch (err) {
        console.log(
          'React-Static data hot-loader websocket encountered the following error:'
        )
        console.error(err)
      }
    }
    run()
  }

  if (process.env.REACT_STATIC_DISABLE_PRELOAD === 'false') startPreloader()
}

function startPreloader() {
  if (typeof document !== 'undefined') {
    const run = () => {
      const els = [].slice.call(document.getElementsByTagName('a'))
      els.forEach(el => {
        const href = el.getAttribute('href')
        if (href) {
          onVisible(el, () => {
            prefetch(href)
          })
        }
      })
    }

    setInterval(run, Number(process.env.REACT_STATIC_PRELOAD_POLL_INTERVAL))
  }
}

export function registerTemplateForPath(path, index) {
  path = getRoutePath(path)
  templateIndexByPath[path] = index
  templatesByPath[path] = templates[index]
}

export function reloadRouteData() {
  // Delete all cached data
  ;[
    routeInfoByPath,
    propsByHash,
    routeErrorByPath,
    inflightRouteInfo,
    inflightPropHashes,
  ].forEach(part => {
    Object.keys(part).forEach(key => {
      delete part[key]
    })
  })
  // Force each RouteData component to reload
  global.reloadAll()
}

export async function getRouteInfo(path, { priority } = {}) {
  path = getRoutePath(path)

  // Check the cache first
  if (routeInfoByPath[path]) {
    return routeInfoByPath[path]
  }

  // Check for an error or non-existent static route
  if (routeErrorByPath[path]) {
    return
  }

  let routeInfo

  try {
    if (process.env.REACT_STATIC_ENV === 'development') {
      // In dev, request from the webpack dev server
      if (!inflightRouteInfo[path]) {
        inflightRouteInfo[path] = axios.get(
          `/__react-static__/routeInfo/${path === '/' ? '' : path}`
        )
      }
      const { data } = await inflightRouteInfo[path]
      routeInfo = data
    } else {
      // In production, fetch the JSON file
      // Find the location of the routeInfo.json file
      const routeInfoRoot =
        (process.env.REACT_STATIC_DISABLE_ROUTE_PREFIXING === 'true'
          ? process.env.REACT_STATIC_SITE_ROOT
          : process.env.REACT_STATIC_PUBLIC_PATH) || '/'
      const cacheBuster = process.env.REACT_STATIC_CACHE_BUST
        ? `?${process.env.REACT_STATIC_CACHE_BUST}`
        : ''
      const getPath = `${routeInfoRoot}${pathJoin(
        path,
        'routeInfo.json'
      )}${cacheBuster}`

      // If this is a priority call bypass the queue
      if (priority) {
        const { data } = await axios.get(getPath)
        routeInfo = data
      } else {
        // Otherwise, add it to the queue
        if (!inflightRouteInfo[path]) {
          inflightRouteInfo[path] = requestPool.add(() => axios.get(getPath))
        }
        const { data } = await inflightRouteInfo[path]
        routeInfo = data
      }
    }
  } catch (err) {
    // If there was an error, mark the path as errored
    routeErrorByPath[path] = true
    return
  }
  if (!priority) {
    delete inflightRouteInfo[path]
  }
  routeInfoByPath[path] = routeInfo
  return routeInfoByPath[path]
}

export async function prefetchData(path, { priority } = {}) {
  // Get route info so we can check if path has any data
  const routeInfo = await getRouteInfo(path, { priority })

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

  // Request the template and loop over the routeInfo.sharedDataHashes, requesting each prop
  await Promise.all(
    Object.keys(routeInfo.sharedDataHashes).map(async key => {
      const hash = routeInfo.sharedDataHashes[key]

      // Check the propsByHash first
      if (!propsByHash[hash]) {
        // Reuse request for duplicate inflight requests
        try {
          // If priority, get it immediately
          if (priority) {
            const { data: prop } = await axios.get(
              pathJoin(
                process.env.REACT_STATIC_ASSETS_PATH,
                `staticData/${hash}.json`
              )
            )
            propsByHash[hash] = prop
          } else {
            // Non priority, share inflight requests and use pool
            if (!inflightPropHashes[hash]) {
              inflightPropHashes[hash] = requestPool.add(() =>
                axios.get(
                  pathJoin(
                    process.env.REACT_STATIC_ASSETS_PATH,
                    `staticData/${hash}.json`
                  )
                )
              )
            }
            const { data: prop } = await inflightPropHashes[hash]
            // Place it in the cache
            propsByHash[hash] = prop
          }
        } catch (err) {
          console.log(
            'Error: There was an error retrieving a prop for this route! hashID:',
            hash
          )
          console.error(err)
        }
        if (!priority) {
          delete inflightPropHashes[hash]
        }
      }

      // Otherwise, just set it as the key
      allProps[key] = propsByHash[hash]
    })
  )

  // Cache allProps for the route
  routeInfo.allProps = allProps

  // Return the props
  return routeInfo.allProps
}

export async function prefetchTemplate(path, { priority } = {}) {
  // Clean the path
  path = getRoutePath(path)
  // Get route info so we can check if path has any data
  const routeInfo = await getRouteInfo(path, { priority })

  if (routeInfo) {
    registerTemplateForPath(path, routeInfo.templateIndex)
  }

  // Preload the template if available
  const Template = templatesByPath[path]
  if (!Template) {
    // If no template was found, mark it with an error
    templateErrorByPath[path] = true
    return
  }
  if (!routeInfo.templateLoaded && Template.preload) {
    if (priority) {
      await Template.preload()
    } else {
      await requestPool.add(() => Template.preload())
    }
    routeInfo.templateLoaded = true
  }
  return Template
}

export async function prefetch(path, options = {}) {
  // Clean the path
  path = getRoutePath(path)

  const { type } = options

  // If it's priority, we stop the queue temporarily
  if (options.priority) {
    requestPool.stop()
  }

  let data
  if (type === 'data') {
    data = await prefetchData(path, options)
  } else if (type === 'template') {
    await prefetchTemplate(path, options)
  } else {
    ;[data] = await Promise.all([
      prefetchData(path, options),
      prefetchTemplate(path, options),
    ])
  }

  // If it was priority, start the queue again
  if (options.priority) {
    requestPool.start()
  }

  return data
}

export function getCurrentRoutePath() {
  // If in the browser, use the window
  if (typeof document !== 'undefined') {
    return getRoutePath(decodeURIComponent(window.location.href))
  }
}
