import fs from 'fs-extra'
import nodePath from 'path'
import { pathJoin } from 'react-static'
import chalk from 'chalk'

const REGEX_TO_GET_LAST_SLASH = /\/{1,}$/gm

const defaultGetUrlAttributes = (route, { prefixPath }) => {
  const { sitemap: { loc, hreflang, ...rest } = {} } = route
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
      publicPath,
    },
    staging,
  } = state

  const prefixPath = disableRoutePrefixing ? siteRoot : publicPath

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
      if (r.sitemap && r.sitemap.noindex) {
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
      const hrefLangLinks = (route.sitemap && route.sitemap.hreflang
        ? buildHrefLangLinks(route.sitemap.hreflang, prefixPath)
        : []
      ).join(staging ? '\n' : '')
      return [
        '<url>',
        xmlArrayOutput(attributesArr, staging),
        hrefLangLinks,
        '</url>',
      ].join(staging ? '\n' : '')
    })
    .join(staging ? '\n' : '')

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
    xmlRoutes,
    `</urlset>`,
  ].join(staging ? '\n' : '')
}

export function getPermaLink(path, prefixPath) {
  const permalink = `${prefixPath}${pathJoin(path)}`
  return `${permalink}/`.replace(REGEX_TO_GET_LAST_SLASH, '/')
}

function checkNestedValue(value) {
  if (!value) return false

  if (typeof value === 'object' && value !== null) {
    return true
  }
  return false
}

function convertNestedValue(values, staging) {
  const _values = []
  Object.keys(values).forEach(key => {
    if (typeof values[key] !== 'undefined') {
      _values.push({ key, value: values[key] })
    }
  })

  return xmlArrayOutput(_values, staging)
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

function buildHrefLangLinks(hrefLangConfig, prefixPath) {
  return hrefLangConfig.map(
    ({ language, url }) =>
      `<xhtml:link rel="alternate" hreflang="${language}" href="${getPermaLink(
        url,
        prefixPath
      )}" />`
  )
}

function xmlArrayOutput(values, staging) {
  return [
    ...values.map(
      ({ key, value }) =>
        `<${key}>${
          checkNestedValue(value)
            ? convertNestedValue(value, staging)
            : encode(value)
        }</${key}>`
    ),
  ].join(staging ? '\n' : '')
}
