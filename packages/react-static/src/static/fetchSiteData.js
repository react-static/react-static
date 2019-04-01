import chalk from 'chalk'
import { time, timeEnd } from '../utils'

export default (async function fetchSiteData(state) {
  console.log('Fetching Site Data...')
  time(chalk.green('[\u2713] Site Data Downloaded'))
  const siteData = await state.config.getSiteData(state)
  timeEnd(chalk.green('[\u2713] Site Data Downloaded'))
  return {
    ...state,
    siteData,
  }
})
