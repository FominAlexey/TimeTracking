export default {
	methods: {
		setBaseState(name) {
			this.$refs[name].setBaseState();
		},

		setNoDataState(name) {
			this.$refs[name].setNoDataState();
		},

		setErrorState(name) {
			this.$refs[name].setErrorState();
		},

		setEmptyState(name) {
			this.$refs[name].setEmptyState();
		},
	},
};
