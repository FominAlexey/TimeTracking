import { SET_CLEAR_DATA, SET_SETTINGS } from "./settings.mutations";
import { CLEAR_DATA, INIT_SETTINGS } from "./settings.actions";

const state = {
	userId: null,
	rulesFiltersTenders: null,
};

const getters = {
	userId: (state) => state.userId,
	rulesFiltersTenders: (state) => state.rulesFiltersTenders,
};

const actions = {
	[CLEAR_DATA](context) {
		context.commit(SET_CLEAR_DATA);
		window.localStorage.clear();
	},

	[INIT_SETTINGS]: async (context) => {
		const settings = {
			userId: "123",
			rulesFiltersTenders: {
				number: "1",
				location: "all",
				action: "==",
				value: "test value 1",
				logicalConnection: "and",
			},
		};

		if (settings) {
			context.commit(SET_SETTINGS, {
				userId: settings.userId,
				rulesFiltersTenders: settings.rulesFiltersTenders,
			});
		}
	},
};

const mutations = {
	[SET_CLEAR_DATA](state) {
		state.userId = null;
		state.rulesFiltersTenders = null;
	},

	[SET_SETTINGS](state, { userId, rulesFiltersTenders }) {
		state.userId = userId;
		state.rulesFiltersTenders = rulesFiltersTenders;
	},
};

export default {
	state,
	actions,
	mutations,
	getters,
};
