<template>
  <v-card>
    <v-app-bar
      class="bg-blue-darken-2"
      prominent
      v-if="isBurgerActive && isMobileDevice"
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
        <div class="navbar-logo mt-10 mb-5">
          <!-- <v-img
            :src="require('@/assets/img/logo/logo.png')"
            contain
            max-width="100"
          /> -->
        </div>
      </template>

      <v-list nav>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
        >
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          to="/Settings"
          prepend-icon="mdi-cog"
          title="Настройки"
        ></v-list-item>
      </v-list>
      <template v-slot:append>
        <v-list>
          <v-list-item
            :title="
              this.$store.getters.role + ' ' + this.$store.getters.fullName
            "
          >
          </v-list-item>
          <v-list-item :title="this.$store.getters.email"> </v-list-item>
          <v-list-item>
            <v-btn
              block
              class="bg-blue-darken-2"
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
      items: [
        {
          title: "Новые тендеры",
          icon: "mdi-alert-decagram",
          to: "/NewTenders",
        },
        {
          title: "Тендеры для анализа",
          icon: "mdi-file-search-outline",
          to: "/TendersForAnalysis",
        },
        {
          title: "Тендеры в работе",
          icon: "mdi-briefcase",
          to: "/TendersInProgress",
        },
      ],
      isMobileDevice: true,
      isNavbarActive: true,
      isBurgerActive: true,
      lastScrollPosition: 0,
    };
  },
  methods: {
    exit() {
      store.dispatch("CLEAR_DATA");
      this.$router.push("/");
    },
    checkDevice() {
      this.isMobileDevice = window.innerWidth < 1366 ? true : false;
      this.isBurgerActive = this.isMobileDevice ? true : false;
      this.isNavbarActive = this.isMobileDevice ? false : true;
    },
    checkBurgerButton() {
      const currentScrollPosition =
        window.pageYOffset || document.documentElement.scrollTop;
      if (currentScrollPosition <= 0) {
        this.isBurgerActive = true;
        return;
      }
      this.isBurgerActive = currentScrollPosition < this.lastScrollPosition;
      this.lastScrollPosition = currentScrollPosition;
    },
    openNavbar() {
      this.isNavbarActive = !this.isNavbarActive;
    },
  },
};
</script>
