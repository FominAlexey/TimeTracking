<template>
	<v-dialog
		v-model="dialog"
		:width="width"
		:min-width="minWidth"
		:max-width="maxWidth"
		:height="height"
		:max-height="maxHeight"
		:min-height="minHeight"
		overlay-color="var(--background-color)"
		overlay-opacity="0.8"
		@update:modelValue="onDialogChanged"
	>
		<v-card class="dialog-card">
			<v-card-text class="dialog-card-text">
				<v-row id="close-panel">
					<v-spacer></v-spacer>
					<v-btn @click="onCloseClicked" icon variant="text">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-row>

				<slot />
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script>
import "@/assets/styles/components/dialog.css";
export default {
	emits: ["update:value"],
	props: {
		value: {
			type: Boolean,
			default: false,
		},
		width: {
			type: String,
			default: null,
		},
		minWidth: {
			type: String,
			default: null,
		},
		maxWidth: {
			type: String,
			default: null,
		},
		height: {
			type: String,
			default: null,
		},
		maxHeight: {
			type: String,
			default: null,
		},
		minHeight: {
			type: String,
			default: null,
		},
	},

	data() {
		return {
			dialog: this.value,
		};
	},

	methods: {
		onCloseClicked() {
			this.$emit("update:value", false);
		},

		onDialogChanged() {
			this.$emit("update:value", false);
		},
	},

	watch: {
		value: function (value) {
			let panel = document.getElementById("close-panel");
			if (panel) panel.scrollIntoView();

			this.dialog = value;
		},
	},
};
</script>
