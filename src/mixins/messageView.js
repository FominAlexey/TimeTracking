export default {
  methods: {
    showMessage(text) {
      this.$refs["snackbar"].showMessage(text);
    },
  },
};
