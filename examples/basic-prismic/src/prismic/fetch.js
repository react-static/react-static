const Prismic = require('prismic-javascript')

import apiEndpoint from './config'
import transform from './transformer'

export default async function getData() {
    const api = await Prismic.getApi(apiEndpoint)
    const response = await api.query('')

    const mapped = response.results.map(data => ({
        id: data.id.toLowerCase(),
        uid: data.uid,
        type: data.type,
        ...transform(data),
    }))
    return mapped
}