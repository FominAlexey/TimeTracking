import UserLayout from "@/layouts/UserLayout";

import MainView from "@/views/user/MainView";
import store from "@/store/index";

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
];
