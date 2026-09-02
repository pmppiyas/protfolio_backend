import { Router } from "express";
import { BlogRoutes } from "../module/blog/blog.routes.js";
import { AuthRouter } from "../module/user/user.routes.js";
import { PostRoutes } from "../module/post/post.routes.js";
const router = Router();

const moduleRoutes = [
  {
    path: "/blog",
    route: BlogRoutes,
  },
  {
    path: "/auth",
    route: AuthRouter,
  },
  {
    path: "/project",
    route: PostRoutes,
  },
  {
    path: "/post",
    route: PostRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
