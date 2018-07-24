import fs from 'fs-extra'
import nodePath from 'path'

import { pathJoin } from '../utils/shared'

const REGEX_TO_GET_LAST_SLASH = /\/{1,}$/gm

export const getPermaLink = ({ path, prefixPath }) => {
  const permalink = `${prefixPath}${pathJoin(path)}`
  return `${permalink}/`.replace(REGEX_TO_GET_LAST_SLASH, '/')
}

export const makeGenerateRouteXML = ({ prefixPath }) => route => {
  const { path, lastModified, priority = 0.5 } = route
  return [
    '<url>',
    `<loc>${getPermaLink({ path, prefixPath }).replace(/[<>&'"]/g, c => {
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
    })}</loc>`,
    lastModified ? `<lastmod>${lastModified}</lastmod>` : '',
    `<priority>${priority}</priority>`,
    '</url>',
  ].join('')
}

export const generateXML = ({ routes, prefixPath }) =>
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes
    .filter(r => r.path !== '404')
    .filter(r => !r.noindex)
    .map(makeGenerateRouteXML({ prefixPath }))
    .join('')}</urlset>`

export default async ({ config }) => {
  const { routes, paths = {}, disableRoutePrefixing } = config

  const { DIST } = paths
  const prefixPath = disableRoutePrefixing
    ? config.siteRoot
    : process.env.REACT_STATIC_PUBLIC_PATH

  if (!config.siteRoot) {
    return
  }

  const xml = generateXML({ routes, prefixPath })

  await fs.writeFile(nodePath.join(DIST, 'sitemap.xml'), xml)
}
