export default {
	methods: {
		showError(text) {
			this.$refs["snackbar"].showError(text);
		},
	},
};
