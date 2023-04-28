<template>
	<v-container>
		<v-overlay
			:modelValue="value"
			:opacity="opacity"
			color="var(--background-color)"
			contained
			class="align-center justify-center"
			scrim="#FFFFFF"
		>
			<v-progress-circular indeterminate color="#1976D2" size="64" />
		</v-overlay>
	</v-container>
</template>

<script>
export default {
	model: {
		prop: "value",
	},

	props: {
		value: {
			type: Boolean,
			default: false,
		},
		opacity: {
			type: Number,
			default: 1,
		},
	},
};
</script>
