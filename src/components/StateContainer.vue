<template>
  <div>
    <v-container v-if="state === BASE_STATE" class="pt-0 pb-0">
      <slot></slot>
    </v-container>
    <v-container v-else-if="state === NODATA_STATE">
      <slot name="nodata">
        <div class="pt-64">
          <h2>{{ text }}</h2>
        </div>
      </slot>
    </v-container>
    <v-container v-else-if="state === ERROR_STATE" class="pt-0 pb-0">
      <slot name="error">
        <div class="pt-64">
          <h2>Ошибка при получении данных</h2>
          <p>
            Отправьте разработчику текст ошибки из консоли или Попробуйте позже
          </p>
        </div>
      </slot>
    </v-container>
    <v-container v-else class="pt-0 pb-0"> </v-container>
  </div>
</template>

<script>
const BASE_STATE = 0;
const NODATA_STATE = 1;
const ERROR_STATE = 2;
const EMPTY_STATE = 3;

export default {
  data() {
    return {
      state: BASE_STATE,
      BASE_STATE: BASE_STATE,
      NODATA_STATE: NODATA_STATE,
      ERROR_STATE: ERROR_STATE,
      EMPTY_STATE: EMPTY_STATE,
      text: '',
    };
  },

  methods: {
    setBaseState() {
      this.state = BASE_STATE;
    },

    setNoDataState(text) {
      this.state = NODATA_STATE;
      this.text = text;
    },

    setErrorState() {
      this.state = ERROR_STATE;
    },

    setEmptyState() {
      this.state = EMPTY_STATE;
    },
  },
};
</script>
