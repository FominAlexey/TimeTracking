<template>
  <v-container>
    <h2 class="text-h5 pb-0">Просмотр контракта</h2>
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
      <v-row class="mb-3">
        Номер контракта:
        <b class="pl-1">
          {{ contract.id }}
        </b>
      </v-row>
      <v-row class="mb-3">
        Название контракта:
        <b class="pl-1">
          {{ contract.nameContract }}
        </b>
      </v-row>
      <v-row class="mb-3">
        Время начала:
        <b class="pl-1">
          {{ formatDate.convertDate(new Date(contract.startDate)) }}
        </b>
      </v-row>
      <v-row class="mb-3">
        Время конца:
        <b class="pl-1">
          {{ formatDate.convertDate(new Date(contract.endDate)) }}
        </b>
      </v-row>
      <v-row class="mb-3">
        Общее количество часов работы:
        <b class="pl-1">
          {{ contract.allTimeWork }}
        </b>
      </v-row>
      <v-row class="mb-3">
        Общее оставшихся часов:
        <b class="pl-1">
          {{ contract.allRemainTime }}
        </b>
      </v-row>
      <v-row class="mb-3 contract-input">
        Оплата за час работы:
        <b class="pl-1">
          {{ contract.paymentOnHour }}
        </b>
      </v-row>
      <v-row class="mb-3">
        Описание:
        <b class="pl-1">
          {{ contract.descriptionContract }}
        </b>
      </v-row>
      <v-row class="mb-3">
        Проверено менеджером:
        <b class="pl-1">
          {{ contract.isCheckManager ? "Да" : "Нет" }}
        </b>
      </v-row>
      <v-row class="mb-3">
        Проверено администратором:
        <b class="pl-1">
          {{ contract.isCheckAdmin ? "Да" : "Нет" }}
        </b>
      </v-row>
      <v-row class="mb-3">
        Выплачено:
        <b class="pl-1">
          {{ contract.isPayment ? "Да" : "Нет" }}
        </b>
      </v-row>
    </div>
  </custom-dialog>
  <custom-dialog
    v-model:value="inDialogAdd"
    width="auto"
    min-width="1000"
    class="pl-0 pr-0"
  >
    <v-row class="mb-10" v-if="isLoadingDialog" justify="center">
      <loader :value="isLoadingDialog" :opacity="0" />
    </v-row>
    <div v-else>
      <v-row class="mb-3 contract-input">
        <div class="mt-2 mr-5">Название контракта:</div>
        <v-textarea
          rows="1"
          v-model="contract.nameContract"
          variant="solo"
          density="compact"
          clearable
        ></v-textarea>
      </v-row>
      <v-row class="mb-3 contract-input">
        <div class="mt-2 mr-5">Описание:</div>
        <v-textarea
          rows="1"
          v-model="contract.descriptionContract"
          variant="solo"
          density="compact"
          clearable
        ></v-textarea>
      </v-row>
      <v-row class="mb-3 contract-input">
        Начало контракта:
        <b class="pl-1">
          {{ formatDate.convertDate(contract.startDate) }}
        </b>
      </v-row>
      <v-row class="mb-3 contract-input">
        Конец контракта:
        <b class="pl-1 mt-1">
          {{ formatDate.convertDate(new Date(contract.endDate)) }}
        </b>
        <v-btn
          class="button-success ml-2 mr-2"
          variant="elevated"
          @click="openCalendar = !openCalendar"
          :loading="isLoadingDialog"
          >{{ !openCalendar ? "Выбрать дату" : "Отключить календарь" }}</v-btn
        >
        <p v-show="openCalendar"><VDatePicker v-model="contract.endDate" /></p>
      </v-row>
      <v-row class="mb-3 contract-input">
        Общее время работы:
        <b class="pl-1 mt-1">
          {{
            `${
              Math.round(
                (contract.endDate - contract.startDate) / (1000 * 60 * 60 * 24)
              ) * 8
            } часов`
          }}
        </b>
      </v-row>
      <v-row class="mb-3 contract-input">
        <div class="mt-2 mr-5">Оплата за час работы:</div>
        <v-text-field
          v-model="contract.paymentOnHour"
          variant="solo"
          density="compact"
          placeholder="Оплата"
          clearable
        ></v-text-field>
      </v-row>
      <v-row class="mb-3" justify="center">
        <v-btn
          class="button-success"
          variant="elevated"
          @click="addContractForUser"
          :loading="isLoadingDialog"
          :disabled="
            contract.descriptionContract == null ||
            contract.paymentOnHour == null
          "
          >Добавить контракт</v-btn
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

import ContractObject from "@/store/objects/contracts/ContractObject";

import Loader from "@/components/Loader.vue";
import StateContainer from "@/components/StateContainer.vue";
import Snackbar from "@/components/SnackBar.vue";
import Dialog from "@/components/Dialog.vue";
import Table from "@/components/Table.vue";

import { getUsers } from "@/dataBase/gunDB/users";
import {
  getContracts,
  getContract,
  createContract,
} from "@/dataBase/gunDB/contracts";

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
    if (this.$route.query.idContract) {
      setTimeout(() => {
        this.openContract({ id: this.$route.query.idContract });
        this.$router.replace({ idContract: null });
      }, 3000);
    }
  },

  data() {
    this.getContracts();
    return {
      users: [],
      user: {},
      date: null,
      isLoading: false,
      isLoadingDialog: false,
      inDialog: false,
      inDialogAdd: false,
      openCalendar: false,
      formatDate: formatDate,
      headers: [
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
        {
          title: "Общее количество часов",
          key: "allTimeWork",
        },
        {
          title: "Общее оставшихся часов",
          key: "allRemainTime",
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
      contracts: [],
      contract: new ContractObject(),
    };
  },

  methods: {
    getContracts() {
      let userId = this.user?.id ? this.user.id : this.$store.getters.id;
      this.isLoading = true;
      const contracts = getContracts(userId);
      setTimeout(() => {
        this.contracts = JSON.parse(JSON.stringify(contracts));
        this.contracts.forEach((element) => {
          element.startDate = formatDate.convertDate(
            new Date(element.startDate)
          );
          element.endDate = formatDate.convertDate(new Date(element.endDate));
          element.isCheckManager = element.isCheckManager ? "Да" : "Нет";
          element.isCheckAdmin = element.isCheckAdmin ? "Да" : "Нет";
          element.isPayment = element.isPayment ? "Да" : "Нет";
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

    openContract(item) {
      this.inDialog = true;
      this.isLoadingDialog = true;
      const contract = getContract(item.id);
      console.log(
        "🚀 ~ file: ContractView.vue:355 ~ openContract ~ contract:",
        contract
      );
      setTimeout(() => {
        if (contract) {
          this.contract = JSON.parse(JSON.stringify(contract));
          this.contract = new ContractObject(this.contract);
        } else {
          this.showMessage("Ошибка! Данные по контракту не были получены!");
          this.inDialog = false;
        }

        this.isLoadingDialog = false;
      }, 3000);
    },

    addContract() {
      if (!this.user) {
        return this.showMessage("Пользователь не выбран!");
      }
      this.inDialogAdd = true;
      this.contract = new ContractObject();
      this.contract.startDate = new Date();
    },

    addContractForUser() {
      let userId = this.user.id ? this.user.id : this.$store.getters.id;

      this.contract.allTimeWork =
        Math.round(
          (this.contract.endDate - this.contract.startDate) /
            (1000 * 60 * 60 * 24)
        ) * 8;
      if (
        this.contract.startDate > this.contract.endDate &&
        this.contract.allTimeWork == 0
      ) {
        return this.showMessage(
          "Ошибка! Дата начала контракта больше даты конца контракта"
        );
      }
      this.isLoadingDialog = true;
      createContract(this.contract.toNewContract(userId));
      setTimeout(() => {
        const response = this.getContracts();
        this.showMessage(response);
        this.inDialogAdd = false;
        this.isLoadingDialog = false;
      }, 2000);
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
