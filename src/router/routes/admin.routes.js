import UserLayout from "@/layouts/UserLayout";
import store from "@/store/index";

import EditingEmployeesView from "@/views/user/admin/EditingEmployeesView";
import ConfirmationPaymentView from "@/views/user/admin/ConfirmationPaymentView";

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
    path: "/EditingEmployees",
    component: EditingEmployeesView,
    name: "EditingEmployees",
    beforeEnter: ifNotAuthenticated,
    meta: {
      layout: UserLayout,
      title: "Сотрудники",
    },
  },
  {
    path: "/ConfirmationPayment",
    component: ConfirmationPaymentView,
    name: "ConfirmationPayment",
    beforeEnter: ifNotAuthenticated,
    meta: {
      layout: UserLayout,
      title: "Подтверждение оплаты",
    },
  },
];
