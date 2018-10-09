import chalk from 'chalk'
import { time, timeEnd } from '../utils'

export default (async function fetchSiteData(config) {
  console.log('=> Fetching Site Data...')
  time(chalk.green('=> [\u2713] Site Data Downloaded'))
  // Get the site data
  const siteData = await config.getSiteData({ dev: false })
  timeEnd(chalk.green('=> [\u2713] Site Data Downloaded'))
  return siteData
})
