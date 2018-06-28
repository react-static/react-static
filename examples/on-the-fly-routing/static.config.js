export default {
  getSiteData: () => ({
    title: 'React Static',
  }),
  getRoutes: async () => (
    [
      {
        path: '/',
      },
      {
        path: '404',
        component: 'src/containers/404',
      },
    ]
  ),
}
