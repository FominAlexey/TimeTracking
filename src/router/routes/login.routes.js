import LoginLayout from "@/layouts/LoginLayout";

import HomeView from "@/views/HomeView.vue";

//import store from "@/store/index";

const ifAuthenticated = (to, from, next) => {
  // if (localStorage.getItem("vuex")) {
  // 	store.dispatch("INIT_ACCOUNT_VUEX");
  // }

  // if (store.getters.isAuthorized) {
  // 	next({ name: "NewTenders" });
  // }

  next();
  return;
};

export default [
  {
    path: "/",
    component: HomeView,
    name: "Home",
    beforeEnter: ifAuthenticated,
    meta: {
      layout: LoginLayout,
      title: "Дом",
    },
  },
];
