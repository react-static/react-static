export default {
  getSiteData: () => ({
    title: 'React Static',
  }),
  getRoutes: async () => {
    return [
      {
        path: '/',
      },
      {
        is404: true,
        component: 'src/containers/404',
      },
    ]
  }
}
