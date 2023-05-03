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
    minWidth="250"
    class="pl-0 pr-0"
  >
    <v-row class="mb-10" v-if="isLoadingDialog" justify="center">
      <loader :value="isLoadingDialog" :opacity="0" />
    </v-row>
    <div v-else>
      <v-row class="mb-3 editingEmployees-input">
        <div class="mt-6 mr-5">Адрес кошелька:</div>
        <v-text-field
          v-model="worker.userAddressWallet"
          variant="solo"
          density="compact"
          placeholder="Адрес кошелька"
          clearable
          :disabled="!isEditWorker"
        ></v-text-field>
      </v-row>
      <v-row class="mb-3 editingEmployees-input">
        <div class="mt-6 mr-5">Ф.И.О:</div>
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
        <div class="mt-6 mr-5">Почта:</div>
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
        <div class="mt-6 mr-5">Телефон:</div>
        <v-text-field
          v-model="worker.phone"
          variant="solo"
          density="compact"
          placeholder="Телефон"
          autocomplete="phone"
          clearable
          :disabled="!isEditWorker"
        ></v-text-field>
      </v-row>
      <v-row class="mb-3 editingEmployees-input">
        <div class="mt-6 mr-5">Роль:</div>
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
          {{ worker.startDate }}
        </b>
      </v-row>
      <v-row class="mb-3" v-if="worker.endDate">
        Конец работы:
        <b class="pl-1">
          {{ worker.endDate }}
        </b>
      </v-row>
      <v-row class="mb-3 editingEmployees-input">
        <div class="mt-6 mr-5">Оплата за час работы:</div>
        <v-text-field
          v-model="worker.chequeForOneHours"
          density="compact"
          variant="solo"
          clearable
          :disabled="!isEditWorker"
        ></v-text-field>
        <div class="mt-6">руб.</div>
      </v-row>
      <v-row class="mb-3" v-if="worker.contracts">
        Контракты:
        <custom-table
          class="pt-5"
          :headers="headersContract"
          :items="worker.contracts"
          nameTable="Контракты"
          v-on:getItemInfo="openContract"
        ></custom-table>
      </v-row>
      <v-row class="mb-3" justify="center" v-if="!worker.contracts">
        <v-btn
          class="bg-blue-darken-2"
          variant="elevated"
          @click="addWorkerToCompany"
          :loading="isLoadingDialog"
          :disabled="
            worker.fullName == null ||
            worker.email == null ||
            worker.phone == null ||
            worker.role == null ||
            worker.chequeForOneHours == null
          "
          >Добавить пользователя</v-btn
        >
      </v-row>
      <v-row v-if="worker.contracts">
        <v-radio-group v-model="isEditWorker" inline>
          <div class="mt-2">Изменить данные:</div>
          <v-radio label="Вкл" :value="true"></v-radio>
          <v-radio label="Выкл" :value="false"></v-radio>
        </v-radio-group>
      </v-row>
      <v-row
        class="mb-3"
        justify="center"
        v-if="isEditWorker && worker.contracts"
      >
        <v-btn
          class="bg-blue-darken-2"
          variant="elevated"
          @click="editWorker"
          :loading="isLoadingDialog"
          :disabled="
            worker.fullName == null ||
            worker.email == null ||
            worker.phone == null ||
            worker.role == null ||
            worker.chequeForOneHours == null
          "
          >Изменить данные</v-btn
        >
      </v-row>
    </div>
  </custom-dialog>
  <loader :value="isLoading"></loader>
  <custom-snackbar ref="snackbar" />
</template>
<script>
import "@/assets/styles/views/editingEmployeesView.css";

import formatDate from "@/helpers/formatDate";
import StateMixins from "@/plugins/mixins/state";
import MessageMixins from "@/plugins/mixins/messageView";
import userConsts from "@/store/consts/user";

import Loader from "@/components/Loader.vue";
import StateContainer from "@/components/StateContainer.vue";
import Snackbar from "@/components/SnackBar.vue";
import Dialog from "@/components/Dialog.vue";
import Table from "@/components/Table.vue";

export default {
  mixins: [StateMixins, MessageMixins],

  data() {
    return {
      isLoading: false,
      isLoadingDialog: false,
      inDialog: false,
      isEditWorker: false,
      rolesUsers: userConsts.roles,
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
        {
          title: "Время работы",
          key: "timeWorker",
        },
      ],
      workers: [
        {
          fullName: "Фомин Алексей Вадимович",
          email: "Lekha@test.ru",
          role: "Admin",
          timeWorker: 100,
        },
      ],
      worker: {
        userAddressWallet: "123123312132321132312",
        fullName: "Фомин Алексей Вадимович",
        email: "Lekha@test.ru",
        phone: "+5454354353",
        role: "Admin",
        startDate: formatDate.convertDate(new Date()),
        endDate: formatDate.convertDate(new Date()),
        chequeForOneHours: "700",
        contracts: [
          {
            idContract: "1",
            startDate: formatDate.convertDate(new Date()),
            endDate: formatDate.convertDate(new Date()),
          },
        ],
      },
      headersContract: [
        {
          title: "Номер контракта",
          align: "left",
          key: "idContract",
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
        userAddressWallet: "123123312132321132312",
        fullName: "Фомин Алексей Вадимович",
        email: "Lekha@test.ru",
        phone: "+5454354353",
        role: "Admin",
        startDate: formatDate.convertDate(new Date()),
        endDate: formatDate.convertDate(new Date()),
        chequeForOneHours: "700",
        contracts: [
          {
            idContract: "1",
            startDate: formatDate.convertDate(new Date()),
            endDate: formatDate.convertDate(new Date()),
          },
        ],
      },
    };
  },

  methods: {
    getWorkers() {},

    openWorker(item) {
      this.inDialog = true;
      this.worker = this.testWorker;
    },

    openContract(item) {
      this.$router.push({
        path: "/Contract",
        query: { idContract: item.idContract },
      });
    },

    addWorker() {
      this.inDialog = true;
      this.isEditWorker = true;
      this.worker = {
        userAddressWallet: null,
        fullName: null,
        email: null,
        phone: null,
        role: null,
        startDate: formatDate.convertDate(new Date()),
        chequeForOneHours: "700",
      };
    },

    addWorkerToCompany() {
      this.isLoadingDialog = true;
      setTimeout(() => {
        this.workers.push({
          fullName: this.worker.fullName,
          email: this.worker.email,
          role: this.worker.role,
          timeWorker: 100,
        });
        this.isLoadingDialog = false;
      }, 3000);
    },

    editWorker() {},
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
