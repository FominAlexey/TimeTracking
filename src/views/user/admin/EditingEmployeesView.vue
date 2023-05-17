<template>
  <v-container>
    <h2 class="text-h5 pb-0">Сотрудники</h2>
  </v-container>
  <state-container ref="main" class="pt-0 pl-0" v-show="!isLoading">
    <div class="mt-5">
      <v-btn
        class="editingEmployees-button"
        variant="elevated"
        @click="addWorker"
      >
        Добавить сотрудника
      </v-btn>
    </div>
    <custom-table
      class="pt-5"
      :headers="headers"
      :items="workers"
      nameTable="Сотрудники"
      v-on:getItemInfo="openWorker"
    ></custom-table>
  </state-container>
  <custom-dialog
    v-model:value="inDialog"
    width="auto"
    minWidth="300"
    class="pl-0 pr-0"
  >
    <v-row class="mb-10" v-if="isLoadingDialog" justify="center">
      <loader :value="isLoadingDialog" :opacity="0" />
    </v-row>
    <div v-else>
      <v-row class="mb-3 editingEmployees-input">
        <div class="mt-3 mr-5">Адрес кошелька:</div>
        <v-text-field
          v-model="worker.addressWallet"
          variant="solo"
          density="compact"
          placeholder="Адрес кошелька"
          clearable
          :disabled="!isEditWorker"
        ></v-text-field>
      </v-row>
      <v-row class="mb-3 editingEmployees-input">
        <div class="mt-3 mr-5">Ф.И.О:</div>
        <v-text-field
          v-model="worker.fullName"
          variant="solo"
          density="compact"
          placeholder="Ф.И.О"
          clearable
          :disabled="!isEditWorker"
        ></v-text-field>
      </v-row>
      <v-row class="mb-3 editingEmployees-input">
        <div class="mt-3 mr-5">Почта:</div>
        <v-text-field
          v-model="worker.email"
          variant="solo"
          density="compact"
          placeholder="Почта"
          autocomplete="email"
          clearable
          :disabled="!isEditWorker"
        ></v-text-field>
      </v-row>
      <v-row class="mb-3 editingEmployees-input">
        <div class="mt-3 mr-5">Телефон:</div>
        <v-text-field
          v-model="worker.numberPhone"
          variant="solo"
          density="compact"
          placeholder="Телефон"
          autocomplete="phone"
          clearable
          :disabled="!isEditWorker"
        ></v-text-field>
      </v-row>
      <v-row class="mb-3 editingEmployees-input">
        <div class="mt-3 mr-5">Роль:</div>
        <v-select
          v-model="worker.role"
          density="compact"
          label="Выбрать роль"
          :items="rolesUsers"
          item-value="value"
          variant="solo"
          :disabled="!isEditWorker"
        ></v-select>
      </v-row>
      <v-row class="mb-3 editingEmployees-input">
        Начало работы:
        <b class="pl-1">
          {{ formatDate.convertDate(new Date(worker.startTimeWork)) }}
        </b>
      </v-row>
      <v-row class="mb-3" v-if="worker.endDate">
          Конец работы:
          <b class="pl-1">
            {{ formatDate.convertDate(new Date( worker.endDate)) }}
          </b>
        </v-row>
      <v-row class="mb-3 editingEmployees-input">
        <div class="mt-3 mr-5">Оплата за час работы:</div>
        <v-text-field
          v-model="worker.paymentOnHour"
          density="compact"
          variant="solo"
          clearable
          :disabled="!isEditWorker"
        ></v-text-field>
        <div class="ml-2 mt-3">руб.</div>
      </v-row>
      <v-row class="mb-3" v-if="!isNewWorker">
        Контракты:
        <custom-table
          class="pt-5"
          :headers="headersContract"
          :items="worker.contracts"
          nameTable="Контракты"
          v-on:getItemInfo="openContract"
        ></custom-table>
      </v-row>
      <v-row class="mb-3" justify="center" v-if="isNewWorker">
        <v-btn
          class="button-success"
          variant="elevated"
          @click="addWorkerToCompany"
          :loading="isLoadingDialog"
          :disabled="
            worker.fullName == null ||
            worker.email == null ||
            worker.numberPhone == null ||
            worker.role == null ||
            worker.paymentOnHour == null
          "
          >Добавить пользователя</v-btn
        >
      </v-row>
      <v-row v-if="!isNewWorker">
        <v-radio-group v-model="isEditWorker" inline>
          <div class="mt-2">Изменить данные:</div>
          <v-radio label="Вкл" :value="true"></v-radio>
          <v-radio label="Выкл" :value="false"></v-radio>
        </v-radio-group>
      </v-row>
      <v-row class="mb-3" justify="center" v-if="isEditWorker && !isNewWorker">
        <v-btn
          class="button-success"
          variant="elevated"
          @click="editWorker"
          :loading="isLoadingDialog"
          :disabled="
            worker.fullName == null ||
            worker.email == null ||
            worker.numberPhone == null ||
            worker.role == null ||
            worker.paymentOnHour == null
          "
          >Изменить данные</v-btn
        >
      </v-row>
      <v-row class="mb-3" justify="center" v-if="isEditWorker && !isNewWorker">
        <v-btn
          class="button-success"
          variant="elevated"
          @click="deleteWorker"
          :loading="isLoadingDialog"
          >Удалить сотрудника</v-btn
        >
      </v-row>
    </div>
  </custom-dialog>
  <loader :value="isLoading"></loader>
  <custom-snackbar ref="snackbar" />
</template>
<script>
import "@/assets/styles/views/admin/editingEmployeesView.css";

import formatDate from "@/helpers/formatDate";
import StateMixins from "@/mixins/state";
import MessageMixins from "@/mixins/messageView";
import userConsts from "@/store/consts/user";
import UserObject from "@/store/objects/user/UserObject";
import {
  getUsers,
  createUser,
  deleteUser,
  getUserInContracts,
  putUser
} from "@/dataBase/gunDB/users";

import Loader from "@/components/Loader.vue";
import StateContainer from "@/components/StateContainer.vue";
import Snackbar from "@/components/SnackBar.vue";
import Dialog from "@/components/Dialog.vue";
import Table from "@/components/Table.vue";

export default {
  mixins: [StateMixins, MessageMixins],

  mounted() {
    this.getWorkers();
  },

  data() {
    return {
      isLoading: false,
      isLoadingDialog: false,
      inDialog: false,
      isEditWorker: false,
      isNewWorker: false,
      rolesUsers: userConsts.roles,
      formatDate: formatDate,
      headers: [
        {
          title: "Ф.И.О",
          align: "left",
          key: "fullName",
        },
        {
          title: "Почта",
          key: "email",
        },
        {
          title: "Должность",
          key: "role",
        },
      ],
      workers: [],
      worker: new UserObject(),
      headersContract: [
        {
          title: "Номер контракта",
          align: "left",
          key: "id",
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
      ],
      testWorker: {
        addressWallet: "123123312132321132312",
        fullName: "Фомин Алексей Вадимович",
        email: "Lekha@test.ru",
        numberPhone: "+5454354353",
        role: "Admin",
        startTimeWork: formatDate.convertDate(new Date()),
        paymentOnHour: "700",
        contracts: [
          {
            idContract: "1",
            nameContract: "Контракт 1",
            startDate: formatDate.convertDate(new Date()),
            endDate: formatDate.convertDate(new Date()),
          },
        ],
      },
    };
  },

  methods: {
    openWorker(item) {
      this.inDialog = true;
      this.isNewWorker = false;
      const user = getUserInContracts(item.id);
      this.worker = user;
    },

    openContract(item) {
      console.log("🚀 ~ file: EditingEmployeesView.vue:275 ~ openContract ~ item:", item)
      this.$router.push({
        path: "/Contract",
        query: { idContract: item.id },
      });
    },

    addWorker() {
      this.inDialog = true;
      this.isEditWorker = true;
      this.isNewWorker = true;
      this.worker = new UserObject().toNewUser();
    },

    addWorkerToCompany() {
      this.isLoadingDialog = true;
      createUser(this.worker);
      this.getWorkers();
      setTimeout(() => {
        this.isLoadingDialog = false;
        this.inDialog = false;
      }, 2000);
    },

    getWorkers() {
      this.isLoading = true;
      const workers = getUsers();
      setTimeout(() => {
        this.workers = workers;
        this.isLoading = false;
      }, 2000);
    },

    editWorker() {
      this.isLoadingDialog = true;
      putUser(this.worker);
      this.getWorkers();
      setTimeout(() => {
        this.isLoadingDialog = false;
        this.inDialog = false;
      }, 2000);
    },

    deleteWorker() {
      this.isLoadingDialog = true;
      let response = deleteUser(this.worker.id.toString());
      this.showMessage(response);
      this.getWorkers();
      setTimeout(() => {
        this.isLoadingDialog = false;
        this.inDialog = false;
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
