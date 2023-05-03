<template>
  <v-container class="login-view-container">
    <v-btn
      class="login-button v-btn--size-x-large bg-blue-darken-2"
      variant="elevated"
      :loading="isLoading"
      @click="onLoginClicked"
    >
      Войти
    </v-btn>
    <custom-snackbar ref="snackbar" />
  </v-container>
</template>
<script>
import "@/assets/styles/views/loginView.css";
//import ApiService from "@/services/api/api";
//import store from "@/store/index";
import MessageMixins from "@/plugins/mixins/messageView";
import Snackbar from "@/components/SnackBar.vue";

export default {
  mixins: [MessageMixins],

  data() {
    return {
      isLoading: null,
    };
  },
  methods: {
    async onLoginClicked() {
      if (!window.ethereum) {
        return this.showMessage(
          "MetaMusk не установлен, проверьте его наличие в расширении браузера"
        );
      }
      this.isLoading = true;
      const accounts = await window.ethereum
        .request({ method: "eth_requestAccounts" })
        .catch((error) => {
          this.isLoading = false;
          console.error(error.message);
          return this.showMessage(`Сообщение от MetaMusk: ${error.message}`);
        });
      this.$store.dispatch("INIT_USER_ADDRESS", accounts[0]);
      console.log(`Пользователь имеет адрес ${accounts[0]}`);
      this.isLoading = false;
      if (accounts[0]) {
        this.$store.dispatch("INIT_ACCOUNT", {
          fullName: "Aleksey",
          email: "Lekha@test.ru",
          role: "Accountant",
          id: "1",
        });
        this.$router.push("/Main");
      }
    },
  },
  components: {
    CustomSnackbar: Snackbar,
  },
};
</script>
