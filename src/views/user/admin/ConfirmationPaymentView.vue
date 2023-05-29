<template>
  <v-container>
    <h2 class="text-h5 pb-0">Подтверждение оплаты</h2>
  </v-container>
  <v-container class="confirmationPayment-container-selector pb-0" v-if="users">
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
        Описание:
        <b class="pl-1">
          {{ contract.descriptionContract }}
        </b>
      </v-row>
      <v-row class="mb-3 contract-input">
        Оплата за час работы:
        <b class="pl-1">
          {{ contract.paymentOnHour }}
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
      <v-row
        class="mb-3"
        justify="center"
        v-if="contract.isCheckManager == true && contract.isCheckAdmin != true"
      >
        <v-btn
          class="button-success"
          variant="elevated"
          @click="confirmForPayment"
          :loading="isLoadingDialog"
          >Подтвердить для оплаты</v-btn
        >
      </v-row>
      <v-row
        class="mb-3"
        justify="center"
        v-if="contract.isPayment == false && contract.isCheckAdmin == true"
      >
        <v-btn
          class="button-success"
          variant="elevated"
          @click="cancelForPayment"
          :loading="isLoadingDialog"
          >Отменить для оплаты</v-btn
        >
      </v-row>
    </div>
  </custom-dialog>
  <loader :value="isLoading"></loader>
  <custom-snackbar ref="snackbar" />
</template>
<script>
import "@/assets/styles/views/admin/confirmationPaymentView.css";

//import formatDate from "@/helpers/formatDate";
import StateMixins from "@/mixins/state";
import MessageMixins from "@/mixins/messageView";

import Loader from "@/components/Loader.vue";
import StateContainer from "@/components/StateContainer.vue";
import Snackbar from "@/components/SnackBar.vue";
import Dialog from "@/components/Dialog.vue";
import Table from "@/components/Table.vue";
import ContractObject from "@/store/objects/contracts/ContractObject";

import { getUsers } from "@/dataBase/gunDB/users";
import {
  getContracts,
  getContract,
  putContract,
} from "@/dataBase/gunDB/contracts";
import formatDate from "@/helpers/formatDate";

export default {
  mixins: [StateMixins, MessageMixins],

  mounted() {
    if (this.$route.query.idContract) {
      this.openContract({ id: this.$route.query.idContract });
      this.$router.replace({ idContract: null });
    }
    this.getUsers();
    this.getContracts();
  },

  data() {
    return {
      users: [],
      user: {},
      isLoading: false,
      isLoadingDialog: false,
      inDialog: false,
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
      let userId = this.user.id ? this.user.id : this.$store.getters.id;
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
      setTimeout(() => {
        this.contract = JSON.parse(JSON.stringify(contract));
        this.contract = new ContractObject(this.contract);
        this.isLoadingDialog = false;
      }, 3000);
    },

    confirmForPayment() {
      this.isLoadingDialog = true;
      this.contract.isCheckAdmin = true;
      const response = putContract(this.contract);
      setTimeout(() => {
        this.showMessage(response);
        this.getContracts();
        this.isLoadingDialog = false;
      }, 3000);
    },

    cancelForPayment() {
      this.isLoadingDialog = true;
      this.contract.isCheckAdmin = false;
      const response = putContract(this.contract);
      setTimeout(() => {
        this.showMessage(response);
        this.getContracts();
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
