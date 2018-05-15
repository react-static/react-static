import MeshApiClient from './src/mesh/mesh-api-client'

const MESH_HOST = 'http://localhost:8080'
const MESH_USERNAME = 'webclient'
const MESH_PASSWORD = 'webclient'
const MESH_PROJECT_NAME = 'demo'
const MESH_LANGUAGE = 'de'
const MESH_API_CLIENT_LOGGING = true

export default {
  getSiteData: () => ({
    title: 'GENTICS Mesh React Static Example',
  }),
  getRoutes: async () => {
    const meshApiClient =
      new MeshApiClient(MESH_HOST, MESH_PROJECT_NAME, MESH_LANGUAGE, MESH_API_CLIENT_LOGGING)
    const meshApiClientAsWebClientUser = await meshApiClient.login(MESH_USERNAME, MESH_PASSWORD)
    const automobilesCategoryNode = await meshApiClientAsWebClientUser.getNodeByWebRootPath('/automobiles')
    const yachtsCategoryNode = await meshApiClientAsWebClientUser.getNodeByWebRootPath('/yachts')
    const aircraftsCategoryNode = await meshApiClientAsWebClientUser.getNodeByWebRootPath('/aircrafts')
    const { data: allAutomobileNodes } =
      await meshApiClientAsWebClientUser.getChildrenForNode(automobilesCategoryNode.uuid)
    const { data: allYachtsNodes } =
      await meshApiClientAsWebClientUser.getChildrenForNode(yachtsCategoryNode.uuid)
    const { data: allAircraftNodes } =
      await meshApiClientAsWebClientUser.getChildrenForNode(aircraftsCategoryNode.uuid)
    const projectNode = await meshApiClientAsWebClientUser.getNodeByWebRootPath('/')
    return [
      {
        path: '/',
        component: 'src/containers/HomePage',
        getData: () => ({
          node: projectNode,
        }),
      },
      {
        path: '/automobiles',
        component: 'src/containers/CategoryPage',
        getData: () => ({
          node: automobilesCategoryNode,
          category: automobilesCategoryNode,
          items: allAutomobileNodes,
        }),
        children: allAutomobileNodes.map(item => ({
          path: `/${item.fields.slug}`,
          component: 'src/containers/VehiclePage',
          getData: () => ({
            node: item,
            item,
          }),
        })),
      },
      {
        path: '/yachts',
        component: 'src/containers/CategoryPage',
        getData: () => ({
          node: yachtsCategoryNode,
          category: yachtsCategoryNode,
          items: allYachtsNodes,
        }),
        children: allYachtsNodes.map(item => ({
          path: `/${item.fields.slug}`,
          component: 'src/containers/VehiclePage',
          getData: () => ({
            node: item,
            item,
          }),
        })),
      },
      {
        path: '/aircrafts',
        component: 'src/containers/CategoryPage',
        getData: () => ({
          node: aircraftsCategoryNode,
          category: aircraftsCategoryNode,
          items: allAircraftNodes,
        }),
        children: allAircraftNodes.map(item => ({
          path: `/${item.fields.slug}`,
          component: 'src/containers/VehiclePage',
          getData: () => ({
            node: item,
            item,
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
