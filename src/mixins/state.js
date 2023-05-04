export default {
  methods: {
    setBaseState(name) {
      this.$refs[name].setBaseState();
    },

    setNoDataState(name, text) {
      this.$refs[name].setNoDataState(text);
    },

    setErrorState(name) {
      this.$refs[name].setErrorState();
    },

    setEmptyState(name) {
      this.$refs[name].setEmptyState();
    },
  },
};
