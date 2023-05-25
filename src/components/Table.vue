<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <v-container id="inspire" class="pl-0 pr-0 pt-0" fluid>
    <v-toolbar dark class="bg-blue-darken-2 customTable-Toolbar" fixed>
      <v-toolbar-title class="customTable-title-toolbar">{{
        nameTable
      }}</v-toolbar-title>
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        label="Поиск"
        single-line
        hide-details
        clearable
      >
      </v-text-field>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            density="compact"
            icon="mdi-dots-vertical"
            v-bind="props"
          ></v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="item in headers"
            :key="item.key"
            @click="changeSort(item.key)"
          >
            <v-list-item-title>
              {{ item.title }}
              <v-icon
                v-if="sortBy[0].key === item.key"
                :icon="
                  sortBy[0].order == 'desc' ? 'mdi-arrow-down' : 'mdi-arrow-up'
                "
              ></v-icon
            ></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="items"
      :search="search"
      :items-per-page="itemsPerPage"
      v-model:page="page"
      :multi-sort="multiSort"
      v-model:sort-by="sortBy"
      :class="{
        'customTable-mobile': isMobileDevice,
        'customTable-displayNone': isMobileDevice,
      }"
      :customFilter="customFilter"
      :hover="true"
      v-resize="onResize"
    >
      <template v-slot:item="{ item }">
        <tr v-if="!isMobileDevice">
          <td
            v-for="property in item.columns"
            :key="property"
            class="text-xs-right"
            v-on:click="onClickItem(item.raw)"
          >
            {{ property }}
          </td>
        </tr>

        <tr v-else>
          <td>
            <ul class="customTable-flex-content">
              <li
                v-for="(property, key, index) in item.columns"
                :key="property"
                :tabindex="2"
                class="customTable-flex-item"
                v-on:click="onClickItem(item.raw)"
              >
                <div class="customTable-data-label">
                  {{ headers[index].title }}:
                </div>
                {{ property }}
              </li>
            </ul>
          </td>
        </tr>
      </template>
      <template v-slot:bottom>
        <section class="d-flex justify-end flex-wrap">
          <div
            class="d-inline-flex align-center justify-end flex-wrap overflow-hidden"
          >
            <div>Элементов в таблице:</div>
            <v-select
              class="customTable-select mt-6 ml-2"
              v-model="itemsPerPage"
              :items="[5, 10, 25, 50]"
              variant="solo"
            ></v-select>
            <div class="ml-2">{{ `${page} из ${pageCount} страница` }}</div>
            <v-pagination
              v-model="page"
              :length="pageCount"
              total-visible="0"
              show-first-last-page="true"
            ></v-pagination>
          </div>
        </section>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import "@/assets/styles/components/customTable.css";
import { VDataTable } from "vuetify/labs/VDataTable";

export default {
  props: {
    nameTable: {
      type: String,
      default: null,
    },
    headers: {
      type: Array,
      default: null,
    },
    items: {
      type: Array,
      default: null,
    },
    multiSort: {
      type: Boolean,
      default: false,
    },
    externalSearch: {
      type: String,
      default: "",
    },
  },

  computed: {
    pageCount() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
  },

  mounted() {
    if (this.externalSearch) {
      this.search = this.externalSearch;
    }
  },

  data() {
    return {
      sortBy: [{ key: "", order: "" }],
      search: "",
      isMobileDevice: false,
      itemsPerPage: 5,
      page: 1,
    };
  },

  methods: {
    onClickItem(item) {
      this.$emit("getItemInfo", item);
    },
    onResize() {
      if (window.innerWidth < 1200) this.isMobileDevice = true;
      else this.isMobileDevice = false;
    },
    changeSort(column) {
      if (this.sortBy[0].key === column) {
        if (this.sortBy[0].order == "asc") {
          this.sortBy[0].order = "desc";
        } else {
          this.sortBy[0].order = "asc";
        }
      } else {
        this.sortBy[0].key = column;
        this.sortBy[0].order = "desc";
      }
    },
    customFilter(value, search, item) {
      if (value == null) return false;
      return (
        value.toString().toLocaleLowerCase().indexOf(search.toLowerCase()) !==
        -1
      );
    },
  },
  components: {
    VDataTable,
  },
};
</script>
