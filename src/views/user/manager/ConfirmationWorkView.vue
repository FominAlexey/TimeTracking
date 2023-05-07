<template>
  <v-container>
    <h2 class="text-h5 pb-0">Подтверждение работы</h2>
  </v-container>
  <v-container class="confirmationWork-container-selector pb-0" v-if="users">
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
      :externalSearch="this.$route.query.search ? this.$route.query.search : ''"
      nameTable="Время"
      v-on:getItemInfo="openCompletedTime"
    ></custom-table>
  </state-container>
  <custom-dialog v-model:value="inDialog" width="auto" class="pl-0 pr-0">
    <v-row class="mb-10" v-if="isLoadingDialog" justify="center">
      <loader :value="isLoadingDialog" :opacity="0" />
    </v-row>
    <div v-else>
      <v-row class="mb-3">
        Номер времени:
        <b class="pl-1">
          {{ time.idTime }}
        </b>
      </v-row>
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
        Общее рабочее время дня:
        <b class="pl-1">
          {{ time.diffTime }}
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
        Номер контракта:
        <b class="pl-1">
          {{ time.idContract }}
        </b>
      </v-row>
      <v-row class="mb-3">
        Название контракта:
        <b class="pl-1">
          {{ time.nameContract }}
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
          {{ time.isCheckManager }}
        </b>
      </v-row>
      <v-row class="mb-3" justify="center" v-if="time.isCheckManager != 'OK'">
        <v-btn
          class="button-success"
          variant="elevated"
          @click="confirmWork"
          :loading="isLoadingDialog"
          >Подтвердить работу</v-btn
        >
      </v-row>
      <v-row class="mb-3" justify="center" v-if="time.isCheckManager != 'NOT'">
        <v-btn
          class="button-success"
          variant="elevated"
          @click="cancelWork"
          :loading="isLoadingDialog"
          >Отменить работу</v-btn
        >
      </v-row>
    </div>
  </custom-dialog>
  <loader :value="isLoading"></loader>
  <custom-snackbar ref="snackbar" />
</template>
<script>
import "@/assets/styles/views/manager/confirmationWorkView.css";

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
      search: "",
      headers: [
        {
          title: "Номер времени",
          align: "left",
          key: "idTime",
        },
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
          title: "Начало работы",
          align: "left",
          key: "startDate",
        },
        {
          title: "Конец работы",
          key: "endDate",
        },
        {
          title: "Общее рабочее время дня",
          key: "diffTime",
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
          key: "isCheckManager",
        },
      ],
      times: [
        {
          idTime: "1",
          idContract: "1",
          nameContract: "Контракт 1",
          startDate: formatDate.convertDate(new Date()),
          endDate: formatDate.convertDate(new Date()),
          diffTime: 4,
          allTime: 100,
          allTimeDiff: 96,
          isCheckManager: "OK",
        },
      ],
      time: {
        idTime: "1",
        idContract: "1",
        nameContract: "Контракт 1",
        startDate: formatDate.convertDate(new Date()),
        endDate: formatDate.convertDate(new Date()),
        diffTime: 4,
        allTime: 100,
        allTimeDiff: 96,
        isCheckManager: "OK",
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

    confirmWork() {
      this.isLoadingDialog = true;
      setTimeout(() => {
        this.time.isCheckManager = "OK";
        this.isLoadingDialog = false;
      }, 3000);
    },

    cancelWork() {
      this.isLoadingDialog = true;
      setTimeout(() => {
        this.time.isCheckManager = "NOT";
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
