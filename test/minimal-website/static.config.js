export default {
  getRoutes: () => [
    {
      path: '/',
      component: 'src/Home',
      getData: () => ({
        'Ich ♥ Bücher': 'foo 𝌆 bar',
      }),
    },
  ],
}
