import fs from 'fs-extra'
import nodePath from 'path'
import { pathJoin } from 'react-static'

const REGEX_TO_GET_LAST_SLASH = /\/{1,}$/gm

export default async function main(config) {
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

export function getPermaLink({ path, prefixPath }) {
  const permalink = `${prefixPath}${pathJoin(path)}`
  return `${permalink}/`.replace(REGEX_TO_GET_LAST_SLASH, '/')
}

export function makeGenerateRouteXML({ prefixPath }) {
  return route => {
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
}

export function generateXML({ routes, prefixPath }) {
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes
    .filter(r => r.path !== '404')
    .filter(r => !r.noindex)
    .map(makeGenerateRouteXML({ prefixPath }))
    .join('')}</urlset>`
}
