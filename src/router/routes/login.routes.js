import LoginLayout from "@/layouts/LoginLayout";

import LoginView from "@/views/login/LoginView";

import store from "@/store/index";

const ifAuthenticated = (to, from, next) => {
  if (localStorage.getItem("vuex")) {
  	store.dispatch("INIT_ACCOUNT_VUEX");
  }

  if (store.getters.isAuthorized) {
  	next({ name: "Main" });
  }

  next();
  return;
};

export default [
  {
    path: "/",
    component: LoginView,
    name: "Login",
    beforeEnter: ifAuthenticated,
    meta: {
      layout: LoginLayout,
      title: "Авторизация",
    },
  },
];
