<template>
  <v-container class="login-view-container">
    <v-btn
      class="login-button button-success v-btn--size-x-large"
      variant="elevated"
      :loading="isLoading"
      @click="onLoginClicked()"
    >
      Войти
    </v-btn>
    <custom-snackbar ref="snackbar" />
  </v-container>
</template>
<script>
import "@/assets/styles/views/loginView.css";
//import store from "@/store/index";
import { getUsers } from "@/dataBase/gunDB/users";
import MessageMixins from "@/mixins/messageView";
import Snackbar from "@/components/SnackBar.vue";

export default {
  mixins: [MessageMixins],

  data() {
    return {
      isLoading: null,
      user: null,
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
        let users = getUsers();
        setTimeout(() => {
          this.user = users.find((user) => user.addressWallet == accounts[0]);
          if (this.user) {
            this.$store.dispatch("INIT_ACCOUNT", {
              id: this.user.id,
              addressWallet: this.user.addressWallet,
              fullName: this.user.fullName,
              email: this.user.email,
              role: this.user.role,
              numberPhone: this.user.numberPhone,
              startTimeWork: this.user.startTimeWork,
              paymentOnHour: this.user.paymentOnHour,
            });
            this.$router.push("/ViewingTime");
          } else {
            this.showMessage(
              `Пользователя с таким адрессом не найден: ${accounts[0]}`
            );
          }
        }, 1000);
      }
    },
  },
  components: {
    CustomSnackbar: Snackbar,
  },
};
</script>
