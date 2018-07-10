import fs from 'fs-extra'
import path from 'path'

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

export const getSiteRoot = ({ stagingSiteRoot, siteRoot }) =>
  process.env.REACT_STATIC_STAGING === 'true' ? stagingSiteRoot : siteRoot

export default async ({ config }) => {
  const { routes, paths = {}, disableRoutePrefixing } = config

  const { DIST } = paths
  const siteRoot = getSiteRoot(config)
  const prefixPath = disableRoutePrefixing ? siteRoot : process.env.REACT_STATIC_PUBLICPATH

  if (!siteRoot) {
    return
  }

  const xml = generateXML({ routes, prefixPath })

  await fs.writeFile(path.join(DIST, 'sitemap.xml'), xml)
}
