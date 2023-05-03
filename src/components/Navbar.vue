<template>
  <v-card>
    <v-app-bar
      class="navbar-AppBar"
      :class="{
        'navbar-BurgerActive': isBurgerActive,
        'navbar-BurgerDisabled': !isBurgerActive,
      }"
      prominent
      v-if="isMobileDevice"
    >
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="openNavbar()"
      ></v-app-bar-nav-icon>
    </v-app-bar>

    <v-navigation-drawer
      location="left"
      v-model="isNavbarActive"
      v-if="isNavbarActive"
    >
      <template #prepend>
        <div class="navbar-logo">
          <v-img
            :src="require('@/assets/img/logo/logo.png')"
            contain
            :max-width="logoMaxWidth"
          />
        </div>
      </template>

      <v-list nav>
        <v-list-item
          v-for="(item, i) in itemsCommon"
          :key="i"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
        >
        </v-list-item>
        <v-divider></v-divider>
      </v-list>

      <v-list nav>
        <v-list-item
          v-for="(item, i) in itemsForUser()"
          :key="i"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
        >
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <v-list>
          <v-list-item
            :title="
              rolesUsers.find((status) => status.value == roleUser).title +
              ' ' +
              fullNameUser
            "
          >
          </v-list-item>
          <v-list-item :title="emailUser"> </v-list-item>
          <v-list-item>
            <v-btn
              block
              class="bg-blue-darken-2 navbar-button"
              variant="elevated"
              @click="exit"
            >
              Выйти
            </v-btn></v-list-item
          >
        </v-list>
      </template>
    </v-navigation-drawer>
    <v-app><router-view></router-view></v-app>
  </v-card>
</template>
<script>
import "@/assets/styles/components/navbar.css";
import store from "@/store/index";

import userConsts from "@/store/consts/user";
export default {
  created() {
    window.addEventListener("resize", this.checkDevice);
    window.addEventListener("scroll", this.checkBurgerButton);
  },
  unmounted() {
    window.removeEventListener("resize", this.checkDevice);
    window.addEventListener("scroll", this.checkBurgerButton);
  },
  mounted() {
    this.checkDevice();
    this.checkBurgerButton();
  },
  data() {
    return {
      itemsCommon: [
        {
          title: "Главная",
          icon: "mdi-alert-decagram",
          to: "/Main",
        },
        {
          title: "Просмотр времени",
          icon: "mdi-file-search-outline",
          to: "/ViewingTime",
        },
        {
          title: "Просмотр контракта",
          icon: "mdi-briefcase",
          to: "/Contract",
        },
      ],
      itemsWorker: [
        {
          title: "Редактирование времени",
          icon: "mdi-timer-outline",
          to: "/EditingTime",
        },
      ],
      itemsAdmin: [
        {
          title: "Подтверждение оплаты",
          icon: "mdi-cash-check",
          to: "/ConfirmationPayment",
        },
        {
          title: "Сотрудники",
          icon: "mdi-account-group",
          to: "/EditingEmployees",
        },
      ],
      itemsManager: [
        {
          title: "Подтверждение работы",
          icon: "mdi-clipboard-check",
          to: "/ConfirmationWork",
        },
      ],
      itemsAccountant: [
        {
          title: "Оплата сотрудникам",
          icon: "mdi-cash-register",
          to: "/EmployeeBenefits",
        },
      ],
      isMobileDevice: true,
      isNavbarActive: true,
      lastScrollPosition: 0,
      logoMaxWidth: 200,
      isBurgerActive: true,
      roleUser: this.$store.getters.role,
      emailUser: this.$store.getters.email,
      fullNameUser: this.$store.getters.fullName,
      rolesUsers: userConsts.roles,
    };
  },
  methods: {
    exit() {
      store.dispatch("CLEAR_DATA");
      this.$router.push("/");
    },
    checkDevice() {
      this.isMobileDevice = window.innerWidth < 1366 ? true : false;
      this.isMobileDevice
        ? (this.logoMaxWidth = 150)
        : (this.logoMaxWidth = 200);
      this.isNavbarActive = this.isMobileDevice ? false : true;
    },
    checkBurgerButton() {
      if (!this.isNavbarActive) {
        const currentScrollPosition = window.pageYOffset;
        if (currentScrollPosition <= this.lastScrollPosition) {
          this.isBurgerActive = true;
        } else {
          this.isBurgerActive = false;
        }
        this.lastScrollPosition = currentScrollPosition;
      }
    },
    openNavbar() {
      this.isNavbarActive = !this.isNavbarActive;
    },
    itemsForUser() {
      if (this.roleUser == "Admin") {
        return this.itemsAdmin;
      }
      if (this.roleUser == "Worker") {
        return this.itemsWorker;
      }
      if (this.roleUser == "Manager") {
        return this.itemsManager;
      }
      if (this.roleUser == "Accountant") {
        return this.itemsAccountant;
      }
    },
  },
};
</script>
