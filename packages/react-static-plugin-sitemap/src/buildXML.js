import fs from 'fs-extra'
import nodePath from 'path'
import { pathJoin } from 'react-static'
import chalk from 'chalk'

const REGEX_TO_GET_LAST_SLASH = /\/{1,}$/gm

const defaultGetUrlAttributes = (route, { prefixPath }) => {
  const { sitemap: { loc, ...rest } = {} } = route
  return {
    loc: getPermaLink(loc || route.path, prefixPath),
    ...rest,
  }
}

export default async function main(state, options) {
  const {
    config: {
      paths: { DIST },
      disableRoutePrefixing,
      siteRoot,
    },
    staging,
  } = state

  const prefixPath = disableRoutePrefixing
    ? siteRoot
    : process.env.REACT_STATIC_PUBLIC_PATH

  const filename = staging ? 'sitemap.staging.xml' : 'sitemap.xml'

  console.log(`Generating ${filename}...`)

  const xml = generateXML(state, options, prefixPath)
  await fs.writeFile(nodePath.join(DIST, filename), xml)

  console.log(chalk.green(`[\u2713] ${filename} generated`))
}

export function generateXML(
  state,
  { getAttributes = () => ({}) } = {},
  prefixPath
) {
  const { config, routes, staging } = state

  if (!prefixPath) {
    throw new Error('The sitemap url prefix cannot be empty or undefined!')
  }

  const xmlRoutes = routes
    .filter(r => {
      // Don't include the 404 page
      if (r.path === '404') {
        return false
      }
      // Don't include routes with noindex: true
      if (r.noindex) {
        return false
      }
      return true
    }) // Leave out noindex routes
    .map(route => {
      const attributes = {
        ...defaultGetUrlAttributes(route, {
          config,
          prefixPath,
        }),
        ...getAttributes(route, {
          config,
          prefixPath,
        }),
        noindex: undefined,
      }
      const attributesArr = []
      Object.keys(attributes).forEach(key => {
        if (typeof attributes[key] !== 'undefined') {
          attributesArr.push({ key, value: attributes[key] })
        }
      })
      return [
        '<url>',
        ...attributesArr.map(
          ({ key, value }) => `<${key}>${encode(value)}</${key}>`
        ),
        '</url>',
      ].join(staging ? '\n' : '')
    })
    .join(staging ? '\n' : '')

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    xmlRoutes,
    `</urlset>`,
  ].join(staging ? '\n' : '')
}

export function getPermaLink(path, prefixPath) {
  const permalink = `${prefixPath}${pathJoin(path)}`
  return `${permalink}/`.replace(REGEX_TO_GET_LAST_SLASH, '/')
}

function encode(val) {
  return String(val).replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '&':
        return '&amp;'
      case "'":
        return '&apos;'
      case '"':
        return '&quot;'
      default:
        throw new Error('XML encoding failed')
    }
  })
}
