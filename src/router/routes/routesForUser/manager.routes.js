import UserLayout from "@/layouts/UserLayout";
import store from "@/store/index";

import ConfirmationWorkView from "@/views/user/manager/ConfirmationWorkView";

const ifNotAuthenticatedManager = (to, from, next) => {
  if (localStorage.getItem("vuex")) {
    store.dispatch("INIT_ACCOUNT_VUEX");
  }

  if (!store.getters.isAuthorized) {
    next({ name: "Login" });
  }

  if (store.getters.role != "Manager") {
    next({ name: "Main" });
  }

  next();
  return;
};

export default [
  {
    path: "/ConfirmationWork",
    component: ConfirmationWorkView,
    name: "ConfirmationWork",
    beforeEnter: ifNotAuthenticatedManager,
    meta: {
      layout: UserLayout,
      title: "Подтверждение работы",
    },
  },
];
