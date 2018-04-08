import axios from 'axios'

const API_PATH_PREFIX = '/api/v1'

export default class MeshApiClient {
  constructor (apiUrl, project, language, logging) {
    this.apiUrl = apiUrl
    this.project = project
    this.language = language
    this.logging = logging
    this.client = axios.create({
      baseURL: apiUrl + API_PATH_PREFIX,
    })
  }

  logMeshApiResponse (msg, response) {
    if (this.logging) {
      console.debug('***')
      console.debug(`*** ${msg}: `, response)
      console.debug('***')
    }
  }

  logMeshApiError (msg, error) {
    if (this.logging) {
      console.debug('***')
      console.debug(`*** ${msg}: `, error)
      console.debug('***')
    }
  }

  login (username, password) {
    return this.client.post('/auth/login', {
      username,
      password,
    }).then(response => {
      this.logMeshApiResponse('login response', response)
      this.client.defaults.headers.common.Authorization = `Bearer ${response.data.token}`
      return Promise.resolve(this)
    }).catch(error => {
      this.logMeshApiError('login response', error)
      console.error('******')
      console.error(error)
      console.error('******')
      return Promise.reject(new Error(error.data.message))
    })
  }

  getNodeByWebRootPath (path) {
    return this.client.get(`${path}?resolveLinks=short`)
      .then(response => {
        this.logMeshApiResponse('getNodesByWebRootPath: response', response)

        return Promise.resolve(response.data)
      }).catch(error => {
        this.logMeshApiError('getNodesByWebRootPath error', error)
        return Promise.reject(new Error(JSON.stringify(error)))
      })
  }

  getChildrenForNode (project, nodeUuid) {
    return this.client.get(`/${project}/nodes/${nodeUuid}/children?resolveLinks=short`)
      .then(response => {
        this.logMeshApiResponse('getChildrenForNode: response', response)

        return Promise.resolve(response.data)
      }).catch(error => {
        this.logMeshApiError('getChildrenForNode error', error)
        return Promise.reject(new Error(JSON.stringify(error)))
      })
  }
}
