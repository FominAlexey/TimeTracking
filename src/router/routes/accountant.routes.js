import UserLayout from "@/layouts/UserLayout";
import store from "@/store/index";

import EmployeeBenefitsView from "@/views/user/accountant/EmployeeBenefitsView";

const ifNotAuthenticatedAccountant = (to, from, next) => {
  if (localStorage.getItem("vuex")) {
    store.dispatch("INIT_ACCOUNT_VUEX");
  }

  if (!store.getters.isAuthorized) {
    next({ name: "Login" });
  }

  if (store.getters.role != "Accountant") {
    next({ name: "Main" });
  }

  next();
  return;
};

export default [
  {
    path: "/EmployeeBenefits",
    component: EmployeeBenefitsView,
    name: "EmployeeBenefits",
    beforeEnter: ifNotAuthenticatedAccountant,
    meta: {
      layout: UserLayout,
      title: "Оплата сотрудникам",
    },
  },

]