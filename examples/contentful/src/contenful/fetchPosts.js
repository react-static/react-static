import _ from 'lodash'
import * as Config from './config'

const Contentful = require('contentful')

const Client = Contentful.createClient({
  space: Config.SPACE_ID,
  accessToken: Config.CDAPI_ACCESS_TOKEN,
})

export default (async function getPosts () {
  const entries = await Client.getEntries({
      content_type: Config.POST_CONTENT_TYPE_ID,
  })

  const posts = _.map(entries.items, item => item.fields)
  
  return posts
})
