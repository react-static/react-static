import MeshApiClient from './src/mesh/mesh-api-client'

const MESH_HOST = 'https://demo.getmesh.io/'
const MESH_PROJECT_NAME = 'demo'
const MESH_LANGUAGE = 'de'
const MESH_API_CLIENT_LOGGING = true

export default {
  getSiteData: () => ({
    title: 'GENTICS Mesh React Static Example',
  }),
  getRoutes: async () => {
    const meshRestApiClient =
      new MeshApiClient(MESH_HOST, MESH_PROJECT_NAME, MESH_LANGUAGE, MESH_API_CLIENT_LOGGING)
    const automobilesCategoryNode = await meshRestApiClient.getNodeByWebRootPath('/automobiles')
    const yachtsCategoryNode = await meshRestApiClient.getNodeByWebRootPath('/yachts')
    const aircraftsCategoryNode = await meshRestApiClient.getNodeByWebRootPath('/aircrafts')
    const { data: allAutomobileNodes } =
      await meshRestApiClient.getChildrenForNode(automobilesCategoryNode.uuid)
    const { data: allYachtsNodes } =
      await meshRestApiClient.getChildrenForNode(yachtsCategoryNode.uuid)
    const { data: allAircraftNodes } =
      await meshRestApiClient.getChildrenForNode(aircraftsCategoryNode.uuid)
    const projectNode = await meshRestApiClient.getNodeByWebRootPath('/')
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
        path: '404',
        component: 'src/containers/404',
        getData: () => ({
          node: { uuid: '000000', displayName: 'Error' },
        }),
      },
    ]
  },
}
