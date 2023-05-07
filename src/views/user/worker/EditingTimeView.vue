<template>
  <v-container>
    <h2 class="text-h5 pb-0">Редактирование оплаты</h2>
  </v-container>
  <v-container
    class="confirmationPayment-container-selector pb-0"
    v-if="contracts"
  >
    <h4 class="font-weight-medium text-h6 mt-3 mr-5">Контракт</h4>
    <v-select
      :items="contracts"
      item-title="nameContract"
      item-value="id"
      v-model="contract"
      label="Выберите контракт"
      variant="solo"
      single-line
      :loading="isLoading"
      color="#fd1d1d"
      returnObject
      @update:modelValue="getContracts"
    >
    </v-select>
  </v-container>
  <v-container v-if="contract">
    <article>
      <section>
        Посмотреть контракт:
        <a :href="contract.urlContract" target="_blank">
          {{ contract.nameContract }}
        </a>
      </section>
      <section>
        Время на данный момент:
        {{ timeNow }}
      </section>
    </article>
  </v-container>
  <loader :value="isLoading"></loader>
  <custom-snackbar ref="snackbar" />
</template>
<script>
import "@/assets/styles/views/worker/editingTimeView.css";

import formatDate from "@/helpers/formatDate";
import StateMixins from "@/mixins/state";
import MessageMixins from "@/mixins/messageView";

import Loader from "@/components/Loader.vue";
import Snackbar from "@/components/SnackBar.vue";

export default {
  mixins: [StateMixins, MessageMixins],

  created() {
    setInterval(this.getTimeNow, 1000);
  },

  data() {
    return {
      contracts: [
        {
          id: 1,
          userAddress: "0xca3ebc3568a171f5a7101b1936fd70fd71398c21",
          nameContract: "Контракт 1",
          urlContract: "http://localhost:8080/Contract?idContract=1",
        },
        {
          id: 2,
          userAddress: "0xca3ebc3568a171f5a7101b1936fd70fd71398c32",
          nameContract: "Контракт 2",
          urlContract: "http://localhost:8080/Contract?idContract=2",
        },
      ],
      contract: null,
      isLoading: false,
      inDialog: false,
      timeNow: "",
    };
  },

  methods: {
    getTimeNow() {
      this.timeNow = formatDate.convertDate(new Date());
    },
    getContracts() {
      // let userId = this.user ? this.user.id : this.$store.getters.id;
      // this.isLoading = true;
      // setTimeout(() => {
      //   console.log(userId);
      //   this.isLoading = false;
      // }, 3000);
    },

    confirmForPayment() {
      this.isLoadingDialog = true;
      setTimeout(() => {
        this.contract.isCheckAdmin = "OK";
        this.isLoadingDialog = false;
      }, 3000);
    },

    cancelForPayment() {
      this.isLoadingDialog = true;
      setTimeout(() => {
        this.contract.isCheckAdmin = "NOT";
        this.isLoadingDialog = false;
      }, 3000);
    },
  },

  components: {
    Loader,
    CustomSnackbar: Snackbar,
  },
};
</script>
