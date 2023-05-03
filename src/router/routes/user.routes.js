import UserLayout from "@/layouts/UserLayout";
import store from "@/store/index";

import MainView from "@/views/user/MainView";
import ViewingTimeView from "@/views/user/ViewingTimeView";
import ContractView from "@/views/user/ContractView";

import adminRoutes from "./admin.routes";
import workerRoutes from "./worker.routes";
import accountantRoutes from "./accountant.routes";
import managerRoutes from "./manager.routes";

const ifNotAuthenticated = (to, from, next) => {
  if (localStorage.getItem("vuex")) {
    store.dispatch("INIT_ACCOUNT_VUEX");
  }

  if (!store.getters.isAuthorized) {
    next({ name: "Login" });
  }

  next();
  return;
};

export default [
  {
    path: "/Main",
    component: MainView,
    name: "Main",
    beforeEnter: ifNotAuthenticated,
    meta: {
      layout: UserLayout,
      title: "Главная",
    },
  },
  {
    path: "/ViewingTime",
    component: ViewingTimeView,
    name: "ViewingTime",
    beforeEnter: ifNotAuthenticated,
    meta: {
      layout: UserLayout,
      title: "Просмотр времени",
    },
  },
  {
    path: "/Contract",
    component: ContractView,
    name: "Contract",
    beforeEnter: ifNotAuthenticated,
    meta: {
      layout: UserLayout,
      title: "Просмотр контракта",
    },
  },
  ...adminRoutes,
  ...workerRoutes,
  ...accountantRoutes,
  ...managerRoutes,
];
