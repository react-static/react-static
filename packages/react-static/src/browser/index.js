import axios from 'axios'
//
import { createPool, getRoutePath, pathJoin } from './utils'
import onMutation from './utils/Mutation'
import onVisible from './utils/Visibility'

// RouteInfo / RouteData
export const routeInfoByPath = {}
export const propsByHash = {}
const erroredPaths = {}
const inflightRouteInfo = {}
const inflightPropHashes = {}
const disableRouteInfoWarning =
  process.env.REACT_STATIC_DISABLE_ROUTE_INFO_WARNING === 'true'

const requestPool = createPool({
  concurrency: Number(process.env.REACT_STATIC_PREFETCH_RATE),
})

// Templates
export const templates = []
export const templateUpdated = { cb: () => {} }
export const registerTemplates = tmps => {
  templates.splice(0, Infinity, ...tmps)
  templateUpdated.cb()
}
export const templateIndexByPath = {
  '404': 0,
}

init()

// When in development, init a socket to listen for data changes
// When the data changes, we invalidate and reload all of the route data
async function init() {
  if (
    process.env.REACT_STATIC_ENV === 'production' &&
    typeof document !== 'undefined'
  ) {
    // Hydrate routeInfoByPath with any window variables
    const {
      path,
      allProps,
      sharedPropsHashes,
      templateIndex,
    } = window.__routeInfo

    // Injest and cache the embedded routeInfo in the page if possible
    Object.keys(sharedPropsHashes).forEach(propKey => {
      propsByHash[sharedPropsHashes[propKey]] = allProps[propKey]
    })

    // In SRR and production, synchronously register the templateIndex for the
    // initial path
    registerTemplateIndexForPath(path, templateIndex)
  }

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

  startPreloader()
}

function startPreloader() {
  if (typeof document !== 'undefined') {
    // When the dom mutates, check it for a tags
    onMutation(() => {
      const els = [].slice.call(document.querySelectorAll('a[href]'))
      els.forEach(el => {
        if (el.__RSVisibilityObserver) {
          return
        }
        el.__RSVisibilityObserver = onVisible(el, () => {
          prefetch(el.getAttribute('href'))
        })
      })
    })
  }
}

export function registerTemplateIndexForPath(path, index) {
  path = getRoutePath(path)
  templateIndexByPath[path] = index
}

export function reloadRouteData() {
  // Delete all cached data
  ;[
    routeInfoByPath,
    propsByHash,
    erroredPaths,
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
  if (typeof document === 'undefined') {
    return
  }
  const originalPath = path
  path = getRoutePath(path)
  // Check the cache first
  if (routeInfoByPath[path]) {
    return routeInfoByPath[path]
  }
  if (erroredPaths[path]) {
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

      if (priority) {
        // In production, request from route's routeInfo.json
        const { data } = await axios.get(getPath)
        routeInfo = data
      } else {
        if (!inflightRouteInfo[path]) {
          inflightRouteInfo[path] = requestPool.add(() => axios.get(getPath))
        }
        const { data } = await inflightRouteInfo[path]
        routeInfo = data
      }
    }
  } catch (err) {
    erroredPaths[path] = true
    if (
      process.env.REACT_STATIC_ENV === 'production' ||
      disableRouteInfoWarning
    ) {
      return
    }
    console.warn(
      `Could not load routeInfo for path: ${originalPath}. If this is a static route, make sure any link to this page is valid! If this is not a static route, you can desregard this warning.`
    )
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

  // Request the template and loop over the routeInfo.sharedPropsHashes, requesting each prop
  await Promise.all(
    Object.keys(routeInfo.sharedPropsHashes).map(async key => {
      const hash = routeInfo.sharedPropsHashes[key]

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

  // Cache the entire props for the route
  routeInfo.allProps = allProps

  // Return the props
  return routeInfo.allProps
}

export async function prefetchTemplate(path, { priority } = {}) {
  // Clean the path
  path = getRoutePath(path)
  // Get route info so we can check if path has any data
  const routeInfo = await getRouteInfo(path)

  if (routeInfo) {
    registerTemplateIndexForPath(path, routeInfo.templateIndex)
  }

  // Preload the template if available
  const Template = templates[templateIndexByPath[path]]
  if (Template && Template.preload) {
    if (priority) {
      await Template.preload()
    } else {
      await requestPool.add(() => Template.preload())
    }
    routeInfo.templateLoaded = true
    return Template
  }
}

export async function needsPrefetch(path, options = {}) {
  // Clean the path
  path = getRoutePath(path)

  if (!path) {
    return false
  }

  // Get route info so we can check if path has any data
  const routeInfo = await getRouteInfo(path, options)

  // Not a static route? Bail out.
  if (!routeInfo) {
    return true
  }

  // Defer to the cache first
  if (!routeInfo.allProps || !routeInfo.templateLoaded) {
    return true
  }
}

export async function prefetch(path, options = {}) {
  // Clean the path
  path = getRoutePath(path)

  const { type } = options

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

  if (options.priority) {
    requestPool.start()
  }

  return data
}
