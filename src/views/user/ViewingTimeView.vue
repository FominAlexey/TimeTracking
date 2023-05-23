<template>
  <v-container>
    <h2 class="text-h5 pb-0">Просмотр времени</h2>
  </v-container>
  <v-container
    class="viewingTime-container-selector pb-0"
    v-if="users && (isAdmin || isManager || isAccountant)"
  >
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
      @update:modelValue="getTimes"
    >
    </v-select>
  </v-container>
  <state-container ref="main" class="pt-0 pl-0" v-show="!isLoading">
    <custom-table
      class="pt-5"
      :headers="headers"
      :items="times"
      :externalSearch="this.$route.query.search ? this.$route.query.search : ''"
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
        Номер времени:
        <b class="pl-1">
          {{ time.id }}
        </b>
      </v-row>
      <v-row class="mb-3">
        Время начала:
        <b class="pl-1">
          {{ formatDate.convertDate(new Date(time.startDate)) }}
        </b>
      </v-row>
      <v-row class="mb-3">
        Время конца:
        <b class="pl-1">
          {{ formatDate.convertDate(new Date(time.endDate)) }}
        </b>
      </v-row>
      <v-row class="mb-3">
        Общее рабочее время дня:
        <b class="pl-1">
          {{ time.remainTime }}
        </b>
      </v-row>
      <v-row class="mb-3">
        Номер контракта:
        <b class="pl-1">
          {{ time.idContract }}
        </b>
      </v-row>
      <v-row class="mb-3">
        Ссылка на контракт:
        <a :href="time.urlContract" target="_blank"> Посмотреть контракт </a>
      </v-row>
      <v-row class="mb-3">
        Подтверждено менеджером:
        <b class="pl-1">
          {{ time.isCheckManager ? "Да" : "Нет" }}
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
import StateMixins from "@/mixins/state";
import MessageMixins from "@/mixins/messageView";

import TimeObject from "@/store/objects/times/TimeObject";

import Loader from "@/components/Loader.vue";
import StateContainer from "@/components/StateContainer.vue";
import Snackbar from "@/components/SnackBar.vue";
import Dialog from "@/components/Dialog.vue";
import Table from "@/components/Table.vue";

import { getUsers } from "@/dataBase/gunDB/users";
import { getTimes, getTime } from "@/dataBase/gunDB/times";

export default {
  mixins: [StateMixins, MessageMixins],

  computed: {
    isAdmin() {
      return this.$store.getters.role == "Admin";
    },

    isManager() {
      return this.$store.getters.role == "Manager";
    },

    isAccountant() {
      return this.$store.getters.role == "Accountant";
    },
  },

  mounted() {
    if (this.isAdmin || this.isManager || this.isAccountant) {
      this.getUsers();
    }
    this.getTimes();
  },

  data() {
    return {
      users: [],
      user: {},
      isLoading: false,
      isLoadingDialog: false,
      inDialog: false,
      formatDate: formatDate,
      search: "",
      headers: [
        {
          title: "Номер времени",
          align: "left",
          key: "id",
        },
        {
          title: "Номер контракта",
          align: "left",
          key: "idContract",
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
          key: "remainTime",
        },
        {
          title: "Подтверждено менеджером",
          key: "isCheckManager",
        },
      ],
      times: [],
      time: new TimeObject(),
    };
  },

  methods: {
    getTimes() {
      let userId = this.user?.id ? this.user.id : this.$store.getters.id;
      this.isLoading = true;
      const times = getTimes(userId);
      setTimeout(() => {
        this.times = JSON.parse(JSON.stringify(times));
        this.times.forEach((element) => {
          element.isCheckManager = element.isCheckManager ? "Да" : "Нет";
          element.startDate = formatDate.convertDate(
            new Date(element.startDate)
          );
          element.endDate = formatDate.convertDate(new Date(element.endDate));
        });
        this.isLoading = false;
      }, 4000);
    },

    getUsers() {
      this.isLoading = true;
      const users = getUsers();
      setTimeout(() => {
        this.users = users;
        this.user = users.find((user) => user.id == this.$store.getters.id);
        this.isLoading = false;
      }, 3000);
    },

    openCompletedTime(item) {
      this.inDialog = true;
      this.isLoadingDialog = true;
      const time = getTime(item.id);
      setTimeout(() => {
        this.time = JSON.parse(JSON.stringify(new TimeObject(time)));
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
