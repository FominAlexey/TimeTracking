<template>
  <v-container>
    <h2 class="text-h5 pb-0">Просмотр времени</h2>
  </v-container>
  <v-container
    class="viewingTime-container-selector pb-0"
    v-if="users && isAdmin"
  >
    <h4 class="font-weight-medium text-h6 mt-5 mr-5">Сотрудник</h4>
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
      @update:modelValue="getCompletedTime"
    >
    </v-select>
  </v-container>
  <state-container ref="main" class="pt-0 pl-0" v-show="!isLoading">
    <custom-table
      class="pt-5"
      :headers="headers"
      :items="times"
      :multiSort="true"
      nameTable="Просмотр времени"
      v-on:getItemInfo="openCompletedTime"
    ></custom-table>
  </state-container>
  <custom-dialog v-model:value="inDialog" width="auto" class="pl-0 pr-0">
    <v-row class="mb-10" v-if="isLoadingDialog" justify="center">
      <loader :value="isLoadingDialog" :opacity="0" />
    </v-row>
    <div v-else>
      <v-row class="mb-3">
        Время начала:
        <b class="pl-1">
          {{ time.startDate }}
        </b>
      </v-row>
      <v-row class="mb-3">
        Время конца:
        <b class="pl-1">
          {{ time.endDate }}
        </b>
      </v-row>
      <v-row class="mb-3">
        Общее количество часов работы:
        <b class="pl-1">
          {{ time.allTime }}
        </b>
      </v-row>
      <v-row class="mb-3">
        Общее оставшихся часов:
        <b class="pl-1">
          {{ time.allTimeDiff }}
        </b>
      </v-row>
      <v-row class="mb-3">
        Ссылка на контракт:
        <a :href="time.urlContract" target="_blank">
          {{ time.urlContract }}
        </a>
      </v-row>
      <v-row class="mb-3">
        Оплата за час работы:
        <b class="pl-1 pr-1">
          {{ time.chequeForOneHours }}
        </b>
        руб.
      </v-row>
      <v-row class="mb-3">
        Подтверждено менеджером:
        <b class="pl-1">
          {{ time.checkManager }}
        </b>
      </v-row>
      <v-row class="mb-3">
        Подтверждено бухгалетром:
        <b class="pl-1">
          {{ time.checkAccountant }}
        </b>
      </v-row>
      <v-row class="mb-3">
        Выплачено:
        <b class="pl-1">
          {{ time.isPayment }}
        </b>
      </v-row>
    </div>
  </custom-dialog>
  <loader :value="isLoading"></loader>
  <custom-snackbar ref="snackbar" />
</template>
<script>
import "@/assets/styles/views/viewingTimeView.css";

import formatDate from "@/helpers/formatDate";
import StateMixins from "@/plugins/mixins/state";
import MessageMixins from "@/plugins/mixins/messageView";

import Loader from "@/components/Loader.vue";
import StateContainer from "@/components/StateContainer.vue";
import Snackbar from "@/components/SnackBar.vue";
import Dialog from "@/components/Dialog.vue";
import Table from "@/components/Table.vue";

export default {
  mixins: [StateMixins, MessageMixins],

  computed: {
    isAdmin() {
      return this.$store.getters.role == "Admin";
    },
  },

  mounted() {
    if (this.isAdmin) {
      this.getUsers();
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
          title: "Начало контракта",
          align: "left",
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
          title: "Подтверждено менеджером",
          key: "checkManager",
        },
        {
          title: "Подтверждено бухгалтером",
          key: "checkAccountant",
        },
        {
          title: "Выплачено",
          key: "isPayment",
        },
      ],
      times: [
        {
          startDate: formatDate.convertDate(new Date()),
          endDate: formatDate.convertDate(new Date()),
          allTime: 100,
          allTimeDiff: 96,
          checkManager: "OK",
          checkAccountant: "NOT",
          isPayment: "NOT",
        },
      ],
      time: {
        idContract: '1',
        startDate: formatDate.convertDate(new Date()),
        endDate: formatDate.convertDate(new Date()),
        allTime: 100,
        allTimeDiff: 96,
        checkManager: "OK",
        checkAccountant: "NOT",
        isPayment: "NOT",
        urlContract: "http://localhost:8080/Contract?idContract=1",
        chequeForOneHours: "700",
      },
    };
  },

  methods: {
    getCompletedTime() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 3000);
    },

    getUsers() {
      this.user = this.users.find((user) => user.id == this.$store.getters.id);
    },

    openCompletedTime(item) {
      this.inDialog = true;
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
