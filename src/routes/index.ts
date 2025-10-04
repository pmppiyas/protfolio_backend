import { Router } from "express";
import { BlogRoutes } from "../module/blog/blog.routes.js";
import { AuthRouter } from "../module/user/user.routes.js";
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
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
