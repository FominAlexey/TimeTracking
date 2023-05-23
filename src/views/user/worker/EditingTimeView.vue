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
      @update:modelValue="getContract"
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
        <div>
          Время начала контракта:
          {{ formatDate.convertDate(new Date(contract.startDate)) }}
        </div>
        <div>
          Время конца контракта:
          {{ formatDate.convertDate(new Date(contract.endDate)) }}
        </div>
        <div>Оставшееся время контракта: {{ contract.allRemainTime }}</div>
      </section>
      <v-divider></v-divider>
      <section class="text-h6">
        <div>Время на данный момент: {{ formatDate.convertDate(timeNow) }}</div>
        <v-btn
          v-if="!timeToRequest"
          class="button-success"
          variant="elevated"
          @click="goToWork"
          >Начать работу</v-btn
        >
        <article v-if="timeToRequest">
          <div>
            Время начала работы:
            {{ formatDate.convertDate(new Date(timeToRequest.timeNow)) }}
          </div>
          <div v-if="timeToRequest.timeEnd">
            Время конца работы:
            {{ formatDate.convertDate(new Date(timeToRequest.timeEnd)) }}
          </div>
          <v-btn class="button-success" variant="elevated" @click="endWork"
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

import ContractObject from "@/store/objects/contracts/ContractObject";

import TimeObject from "@/store/objects/times/TimeObject";

import Loader from "@/components/Loader.vue";
import Snackbar from "@/components/SnackBar.vue";

import { getContracts, putContract } from "@/dataBase/gunDB/contracts";
import {
  createTime,
  getTime,
  putTime,
  getTimesInContract,
} from "@/dataBase/gunDB/times";

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
      time: new TimeObject(),
      isLoading: false,
      inDialog: false,
      formatDate: formatDate,
      timeNow: "",
      timeToRequest: null,
    };
  },

  methods: {
    getTimeNow() {
      this.timeNow = new Date();
    },

    getContracts() {
      this.isLoading = true;
      const contracts = getContracts(this.$store.getters.id);
      setTimeout(() => {
        this.contracts = JSON.parse(JSON.stringify(contracts));
        this.isLoading = false;
      }, 4000);
    },

    getContract() {
      this.contract = new ContractObject(this.contract);
      this.recalculationTimeInContract();
    },

    goToWork() {
      this.isLoading = true;
      this.timeToRequest = {
        timeNow: this.timeNow,
        timeEnd: "",
      };
      this.time = new TimeObject({
        idContract: this.contract.id,
        idUser: this.$store.getters.id,
        startDate: this.timeNow.toString(),
        endDate: this.timeNow.toString(),
      });
      const response = createTime(this.time);
      setTimeout(() => {
        this.showMessage(response.text);
        this.time.id = response.id;
        this.isWork = true;
        this.isLoading = false;
      }, 3000);
    },

    endWork() {
      this.isLoading = true;
      this.timeToRequest.timeEnd = this.timeNow;
      const time = getTime(this.time.id);
      setTimeout(() => {
        const timeEdit = JSON.parse(JSON.stringify(time));
        timeEdit.endDate = this.timeNow.toString();
        timeEdit.remainTime = Math.round(
          (new Date(timeEdit.endDate) - new Date(timeEdit.startDate)) /
            (1000 * 60 * 60)
        );
        const response = putTime(timeEdit);
        setTimeout(() => {
          this.showMessage(response);
          this.recalculationTimeInContract();
          this.isLoading = false;
        }, 3000);
      }, 1000);
    },

    recalculationTimeInContract() {
      this.isLoading = true;
      const times = getTimesInContract(this.contract.id);
      setTimeout(() => {
        const allRemainTimes = times.reduce(
          (sum, current) => sum + current.remainTime,
          0
        );
        this.contract.allRemainTime =
          this.contract.allTimeWork - allRemainTimes;
        const response = putContract(this.contract);
        setTimeout(() => {
          this.showMessage(response);
          this.isLoading = false;
        }, 3000);
      }, 3000);
    },
  },

  components: {
    Loader,
    CustomSnackbar: Snackbar,
  },
};
</script>
