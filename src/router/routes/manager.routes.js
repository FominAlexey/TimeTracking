import UserLayout from "@/layouts/UserLayout";
import store from "@/store/index";

import ConfirmationWorkView from "@/views/user/manager/ConfirmationWorkView";

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
    path: "/ConfirmationWork",
    component: ConfirmationWorkView,
    name: "ConfirmationWork",
    beforeEnter: ifNotAuthenticated,
    meta: {
      layout: UserLayout,
      title: "Подтверждение работы",
    },
  },
];
