<template>
	<v-snackbar v-model="snackbar" :timeout="5000">
		{{ text }}
		<template v-slot:actions>
			<v-btn color="white" variant="text" @click="snackbar = false">
				Закрыть
			</v-btn>
		</template>
	</v-snackbar>
</template>

<script>
export default {
	data() {
		return {
			snackbar: false,
			text: null,
		};
	},

	methods: {
		showError(text) {
			this.text = text;
			this.snackbar = true;
		},
	},
};
</script>
