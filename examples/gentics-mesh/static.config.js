import axios from 'axios'
import MeshApiClient from './src/mesh/mesh-api-client'

const MESH_HOST = 'http://localhost:8080'
const MESH_USERNAME = 'webclient'
const MESH_PASSWORD = 'webclient'
const MESH_PROJECT_NAME = 'demo'
const MESH_LANGUAGE = 'de'
const MESH_API_CLIENT_LOGGING = true

export default {
  getSiteData: () => ({
    title: 'React Static',
  }),
  getRoutes: async () => {
    const { data: posts } = await axios.get('https://jsonplaceholder.typicode.com/posts')
    const meshApiClient = new MeshApiClient(MESH_HOST, MESH_PROJECT_NAME, MESH_LANGUAGE, MESH_API_CLIENT_LOGGING)
    const meshApiClientAsWebClientUser = await meshApiClient.login(MESH_USERNAME, MESH_PASSWORD)
    const automobilesCategoryNode =
      await meshApiClientAsWebClientUser.getNodeByWebRootPath(`/${MESH_PROJECT_NAME}/webroot/automobiles`)
    const { data: allAutomobileNodes } =
      await meshApiClientAsWebClientUser.getChildrenForNode(MESH_PROJECT_NAME, automobilesCategoryNode.uuid)
    console.log('allAutomobileNodes: ', allAutomobileNodes)
    return [
      {
        path: '/',
        component: 'src/containers/Home',
      },
      {
        path: '/automobiles',
        component: 'src/containers/ProductList',
        getData: async () => ({
          allAutomobileNodes,
        }),
        children: allAutomobileNodes.map(product => ({
          path: product.path,
          component: 'src/containers/ProductDetail',
          getData: async () => ({
            product,
          }),
        })),
      },
      {
        path: '/about',
        component: 'src/containers/About',
      },
      {
        path: '/blog',
        component: 'src/containers/Blog',
        getData: async () => ({
          posts,
        }),
        children: posts.map(post => ({
          path: `/post/${post.id}`,
          component: 'src/containers/Post',
          getData: async () => ({
            post,
          }),
        })),
      },
      {
        is404: true,
        component: 'src/containers/404',
      },
    ]
  },
}
