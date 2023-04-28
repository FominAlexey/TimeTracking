import { createRouter, createWebHistory } from "vue-router";
import UserRoutes from "./routes/user.routes";
import LoginRoutes from "./routes/login.routes";

const routes = [...UserRoutes, ...LoginRoutes];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.afterEach((to, from) => {
  document.title = to.meta.title || "Диплом";
});

export default router;
