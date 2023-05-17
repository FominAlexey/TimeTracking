<template>
  <v-container>
    <h2 class="text-h5 pb-0">Отслеживание работы</h2>
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
      <section class="text-h6">
        Посмотреть контракт:
        <a :href="contract.urlContract" target="_blank">
          {{ contract.nameContract }}
        </a>
        <div>Время начала контракта: {{ contract.startDate }}</div>
        <div>Время конца контракта: {{ contract.endDate }}</div>
        <div>Оставшееся время контракта: {{ contract.allTimeDiff }}</div>
      </section>
      <section class="text-h6">
        <div>Время на данный момент: {{ timeNow }}</div>
        <v-btn
          v-if="!timeToRequest"
          class="button-success"
          variant="elevated"
          @click="goToWork"
          >Начать работу</v-btn
        >
        <article v-if="timeToRequest">
          <div>Время начала работы: {{ timeToRequest.timeNow }}</div>
          <div>Время конца работы: {{ timeToRequest.timeEnd }}</div>
          <v-btn
            v-if="!timeToRequest.timeEnd"
            class="button-success"
            variant="elevated"
            @click="endWork"
            >Закончить работу</v-btn
          >
        </article>
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

  mounted() {
    this.getContracts();
  },

  data() {
    return {
      contracts: [],
      contract: null,
      isLoading: false,
      inDialog: false,
      timeNow: "",
      timeToRequest: null,
    };
  },

  methods: {
    getTimeNow() {
      this.timeNow = formatDate.convertDate(new Date());
    },

    getContracts() {
      this.isLoading = true;
      setTimeout(() => {
        this.contracts = [
          {
            id: 1,
            userAddress: "0xca3ebc3568a171f5a7101b1936fd70fd71398c21",
            nameContract: "Контракт 1",
            startDate: formatDate.convertDate(new Date()),
            endDate: formatDate.convertDate(new Date()),
            allTime: 100,
            allTimeDiff: 96,
            urlContract: "http://localhost:8080/Contract?idContract=1",
          },
          {
            id: 2,
            userAddress: "0xca3ebc3568a171f5a7101b1936fd70fd71398c32",
            nameContract: "Контракт 2",
            startDate: formatDate.convertDate(new Date()),
            endDate: formatDate.convertDate(new Date()),
            allTime: 100,
            allTimeDiff: 96,
            urlContract: "http://localhost:8080/Contract?idContract=2",
          },
        ];
        this.isLoading = false;
      }, 3000);
    },

    getContract() {
      this.isLoading = true;
      setTimeout(() => {
        this.contract = {
          id: 1,
          userAddress: "0xca3ebc3568a171f5a7101b1936fd70fd71398c21",
          nameContract: "Контракт 1",
          startDate: formatDate.convertDate(new Date()),
          endDate: formatDate.convertDate(new Date()),
          allTime: 100,
          allTimeDiff: 96,
          urlContract: "http://localhost:8080/Contract?idContract=1",
        };

        this.isLoading = false;
      }, 3000);
    },

    goToWork() {
      this.timeToRequest = {
        id: 1,
        userAddress: "0xca3ebc3568a171f5a7101b1936fd70fd71398c21",
        timeNow: this.timeNow,
        timeEnd: null,
      };
    },

    endWork() {
      this.timeToRequest.timeEnd = this.timeNow;
      console.log(this.timeToRequest);
    },
  },

  components: {
    Loader,
    CustomSnackbar: Snackbar,
  },
};
</script>
