import UserLayout from "@/layouts/UserLayout";
import store from "@/store/index";

import EditingTimeView from "@/views/user/worker/EditingTimeView";

const ifNotAuthenticatedWorker = (to, from, next) => {
  if (localStorage.getItem("vuex")) {
    store.dispatch("INIT_ACCOUNT_VUEX");
  }

  if (!store.getters.isAuthorized) {
    next({ name: "Login" });
  }

  if (store.getters.role != "Worker") {
    next({ name: "Main" });
  }

  next();
  return;
};

export default [
  {
    path: "/EditingTime",
    component: EditingTimeView,
    name: "EditingTime",
    beforeEnter: ifNotAuthenticatedWorker,
    meta: {
      layout: UserLayout,
      title: "Редактирование времени",
    },
  },
];
