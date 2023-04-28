import UserLayout from "@/layouts/UserLayout";

import AboutView from "@/views/AboutView";
//import store from "@/store/index";

const ifNotAuthenticated = (to, from, next) => {
  // if (localStorage.getItem("vuex")) {
  //   store.dispatch("INIT_ACCOUNT_VUEX");
  // }

  // if (!store.getters.isAuthorized) {
  //   next({ name: "Login" });
  // }

  next();
  return;
};

export default [
  {
    path: "/About",
    component: AboutView,
    name: "About",
    beforeEnter: ifNotAuthenticated,
    meta: {
      layout: UserLayout,
      title: "Об этом",
    },
  },
];
