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
        is404: true,
        component: 'src/containers/404',
      },
    ]
  ),
}
