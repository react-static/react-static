import axios from 'axios'

export default {
  withSiteData: () => ({
    title: 'React Static',
  }),
  getRoutes: async () => {
    const { data: posts } = await axios.get('https://jsonplaceholder.typicode.com/posts')
    return [
      {
        path: '/',
        component: 'src/containers/Home',
      },
      {
        path: '/about',
        component: 'src/containers/About',
      },
      {
        path: '/blog',
        component: 'src/containers/Blog',
        getProps: () => ({
          posts,
        }),
        children: posts.map(post => ({
          path: `/post/${post.id}`,
          component: 'src/containers/Post',
          getProps: () => ({
            post,
          }),
        })),
      },
      {
        path: '/dashboard',
        component: 'src/containers/Dashboard',
      },
      {
        path: '/account',
        component: 'src/containers/Account',
      },
      {
        path: '/signin',
        component: 'src/containers/SignIn',
      },
      {
        path: '/signup',
        component: 'src/containers/SignUp',
      },
      {
        path: '/signout',
        component: 'src/containers/SignOut',
      },
      {
        path: '/forgotpw',
        component: 'src/containers/ForgotPassword',
      },
      {
        is404: true,
        component: 'src/containers/404',
      },
    ]
  },
}
