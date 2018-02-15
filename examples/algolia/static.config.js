import axios from "axios";
import { addSearchObjects } from "./algolia";

export default {
  getSiteData: () => ({
    title: "React Static"
  }),
  getRoutes: async () => {
    const { data: posts } = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );

    // Add posts data to Algolia with an index key of "posts"
    addSearchObjects("posts", posts);

    return [
      {
        path: "/",
        component: "src/containers/Home"
      },
      {
        path: "/about",
        component: "src/containers/About"
      },
      {
        path: "/blog",
        component: "src/containers/Blog",
        getData: () => ({
          posts
        }),
        children: posts.map(post => ({
          path: `/post/${post.id}`,
          component: "src/containers/Post",
          getData: () => ({
            post
          })
        }))
      },
      {
        path: "/search",
        component: "src/containers/Search"
      },
      {
        is404: true,
        component: "src/containers/404"
      }
    ];
  }
};
