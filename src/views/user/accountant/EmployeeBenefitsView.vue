<template>
  <v-container>
    <h2 class="text-h5 pb-0">Оплата сотрудникам</h2>
  </v-container>
  <v-container class="viewingTime-container-selector pb-0" v-if="users">
    <h4 class="font-weight-medium text-h6 mt-3 mr-5">Сотрудник</h4>
    <v-select
      :items="users"
      item-title="fullName"
      item-value="id"
      v-model="user"
      label="Выберите сотрудника"
      variant="solo"
      single-line
      :loading="isLoading"
      color="#fd1d1d"
      returnObject
      @update:modelValue="getContracts"
    >
    </v-select>
    <div class="ml-2 mt-3" v-if="isAdmin">
      <v-btn
        class="editingEmployees-button"
        variant="elevated"
        @click="addContract"
      >
        Добавить контракт
      </v-btn>
    </div>
  </v-container>
  <state-container ref="main" class="pt-0 pl-0" v-show="!isLoading">
    <custom-table
      class="pt-5"
      :headers="headers"
      :items="contracts"
      :multiSort="true"
      nameTable="Контракты"
      v-on:getItemInfo="openContract"
    ></custom-table>
  </state-container>
  <custom-dialog
    v-model:value="inDialog"
    width="auto"
    min-width="1000"
    class="pl-0 pr-0"
  >
    <v-row class="mb-10" v-if="isLoadingDialog" justify="center">
      <loader :value="isLoadingDialog" :opacity="0" />
    </v-row>
    <div v-else>
      <v-row class="mb-3" v-if="contract.isPayment">
        Номер контракта:
        <b class="pl-1">
          {{ contract.idContract }}
        </b>
      </v-row>
      <v-row class="mb-3" v-if="contract.isPayment">
        Название контракта:
        <b class="pl-1">
          {{ contract.nameContract }}
        </b>
      </v-row>
      <v-row class="mb-3">
        Посмотреть контракт:
        <a :href="contract.urlContract" target="_blank">
          {{ contract.urlContract }}
        </a>
      </v-row>
      <v-row class="mb-3">
        Время начала:
        <b class="pl-1">
          {{ contract.startDate }}
        </b>
      </v-row>
      <v-row class="mb-3">
        Время конца:
        <b class="pl-1">
          {{ contract.endDate }}
        </b>
      </v-row>
      <v-row class="mb-3">
        Общее количество часов работы:
        <b class="pl-1">
          {{ contract.allTime }}
        </b>
      </v-row>
      <v-row class="mb-3">
        Общее оставшихся часов:
        <b class="pl-1">
          {{ contract.allTimeDiff }}
        </b>
      </v-row>
      <v-row class="mb-3 contract-input">
        Описание:
        <b class="pl-1">
          {{ contract.descriptionContract }}
        </b>
      </v-row>
      <v-row class="mb-3 contract-input">
        Оплата за час работы:
        <b class="pl-1">
          {{ contract.chequeForOneHours }}
        </b>
      </v-row>
      <v-row class="mb-3">
        Всё рабочее время:
        <a :href="contract.urlTime" target="_blank">
          {{ contract.urlTime }}
        </a>
      </v-row>
      <v-row class="mb-3">
        Проверено менеджером:
        <b class="pl-1">
          {{ contract.isCheckManager }}
        </b>
      </v-row>
      <v-row class="mb-3">
        Проверено администратором:
        <b class="pl-1">
          {{ contract.isCheckAdmin }}
        </b>
      </v-row>
      <v-row class="mb-3">
        Выплачено:
        <b class="pl-1">
          {{ contract.isPayment }}
        </b>
      </v-row>
      <v-row
        class="mb-3"
        justify="center"
        v-if="
          contract.isCheckAdmin != 'NOT' &&
          contract.isCheckManager != 'NOT' &&
          contract.isPayment != 'OK'
        "
      >
        <v-btn
          class="button-success"
          variant="elevated"
          @click="paymentForUser"
          :loading="isLoadingDialog"
          >Выплатить за контракт</v-btn
        >
      </v-row>
    </div>
  </custom-dialog>
  <loader :value="isLoading"></loader>
  <custom-snackbar ref="snackbar" />
</template>
<script>
import "@/assets/styles/views/viewingTimeView.css";

import formatDate from "@/helpers/formatDate";
import StateMixins from "@/mixins/state";
import MessageMixins from "@/mixins/messageView";

import Loader from "@/components/Loader.vue";
import StateContainer from "@/components/StateContainer.vue";
import Snackbar from "@/components/SnackBar.vue";
import Dialog from "@/components/Dialog.vue";
import Table from "@/components/Table.vue";

export default {
  mixins: [StateMixins, MessageMixins],

  mounted() {
    if (this.$route.query.idContract) {
      this.openContract({ id: this.$route.query.idContract });
      this.$router.replace({ idContract: null });
    }
  },

  data() {
    return {
      users: [
        {
          id: 1,
          userAddress: "0xca3ebc3568a171f5a7101b1936fd70fd71398c21",
          email: "Lekha@test.ru",
          fullName: "Aleksey",
          role: "Admin",
        },
        {
          id: 2,
          userAddress: "0xca3ebc3568a171f5a7101b1936fd70fd71398c32",
          email: "Vlad@test.ru",
          fullName: "Vladislav",
          role: "Worker",
        },
      ],
      user: {
        id: 1,
        userAddress: "0xca3ebc3568a171f5a7101b1936fd70fd71398c21",
        email: "Lekha@test.ru",
        fullName: "Aleksey",
        role: "Admin",
      },
      isLoading: false,
      isLoadingDialog: false,
      inDialog: false,
      headers: [
        {
          title: "Номер контракта",
          align: "left",
          key: "idContract",
        },
        {
          title: "Название контракта",
          align: "left",
          key: "nameContract",
        },
        {
          title: "Начало контракта",
          key: "startDate",
        },
        {
          title: "Конец контракта",
          key: "endDate",
        },
        {
          title: "Общее количество часов",
          key: "allTime",
        },
        {
          title: "Общее оставшихся часов",
          key: "allTimeDiff",
        },
        {
          title: "Проверено менеджером",
          key: "isCheckManager",
        },
        {
          title: "Проверено администратором",
          key: "isCheckAdmin",
        },
        {
          title: "Выплачено",
          key: "isPayment",
        },
      ],
      contracts: [
        {
          idContract: "1",
          nameContract: "Контракт 1",
          startDate: formatDate.convertDate(new Date()),
          endDate: formatDate.convertDate(new Date()),
          allTime: 100,
          allTimeDiff: 96,
          isCheckManager: "OK",
          isCheckAdmin: "NOT",
          isPayment: "NOT",
        },
      ],
      contract: {
        idContract: "1",
        nameContract: "Контракт 1",
        urlContract: "http://localhost:8080/Contract?idContract=1",
        startDate: formatDate.convertDate(new Date()),
        endDate: formatDate.convertDate(new Date()),
        allTime: 100,
        allTimeDiff: 96,
        isCheckManager: "OK",
        isCheckAdmin: "OK",
        isPayment: "NOT",
        urlTime: "http://localhost:8080/ViewingTime?search=1",
        descriptionContract: "Описание",
        chequeForOneHours: "700",
      },
    };
  },

  methods: {
    getContracts() {
      let userId = this.user ? this.user.id : this.$store.getters.id;
      this.isLoading = true;
      setTimeout(() => {
        console.log(userId);
        this.isLoading = false;
      }, 3000);
    },

    getUsers() {
      this.user = this.users.find((user) => user.id == this.$store.getters.id);
    },

    openContract(item) {
      this.inDialog = true;
    },

    paymentForUser() {
      this.isLoadingDialog = true;
      setTimeout(() => {
        this.contract.isPayment = "OK";
        this.isLoadingDialog = false;
      }, 3000);
    },
  },

  components: {
    Loader,
    StateContainer,
    CustomTable: Table,
    CustomSnackbar: Snackbar,
    CustomDialog: Dialog,
  },
};
</script>
