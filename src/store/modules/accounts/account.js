/* eslint-disable no-unused-vars */
import {
	CLEAR_DATA,
	INIT_TOKEN,
	INIT_ACCOUNT,
	INIT_ACCOUNT_VUEX,
} from "./account.actions";
import {
	SET_CLEAR_DATA,
	SET_TOKEN,
	SET_DATA_ACCOUNT,
	SET_DATA_ACCOUNT_VUEX,
	SET_INIT,
} from "./account.mutations";

const state = {
	isInitialized: false,
	isAuthorized: false,
	fullName: null,
	email: null,
	role: null,
	token: null,
	id: null,
};

const getters = {
	isInitialized: (state) => state.isInitialized,
	isAuthorized: (state) => state.isAuthorized,
	fullName: (state) => state.fullName,
	email: (state) => state.email,
	role: (state) => state.role,
	token: (state) => state.token,
	id: (state) => state.id,
};

const actions = {
	[CLEAR_DATA](context) {
		context.commit(SET_CLEAR_DATA);
		window.localStorage.clear();
	},
	[INIT_TOKEN]: async (context, { email, password }) => {
		const token = btoa(`${email}:${password}`);
		context.commit(SET_TOKEN, token);
	},
	[INIT_ACCOUNT]: async (context, userData) => {
		if (userData) {
			context.commit(SET_DATA_ACCOUNT, {
				isAuthorized: true,
				fullName: userData.fullName,
				email: userData.email,
				role: userData.role,
				id: userData.id,
			});
			context.commit(SET_INIT);
		}
	},
	[INIT_ACCOUNT_VUEX]: async (context) => {
		var dataAccountVuex = JSON.parse(localStorage.getItem("vuex")).store
			.AccountModule;
		let stateAccountVuex = {
			isInitialized: dataAccountVuex.isInitialized,
			isAuthorized: dataAccountVuex.isAuthorized,
			fullName: dataAccountVuex.fullName,
			email: dataAccountVuex.email,
			role: dataAccountVuex.role,
			token: dataAccountVuex.token,
			id: dataAccountVuex.id,
		};
		context.commit(SET_DATA_ACCOUNT_VUEX, stateAccountVuex);
	},
};

const mutations = {
	[SET_CLEAR_DATA](state) {
		state.isInitialized = false;
		state.isAuthorized = false;
		state.fullName = null;
		state.email = null;
		state.role = null;
		state.id = null;
	},
	[SET_TOKEN](state, token) {
		state.token = token;
	},
	[SET_DATA_ACCOUNT](state, { isAuthorized, fullName, email, role, id }) {
		state.isAuthorized = isAuthorized;
		state.fullName = fullName;
		state.email = email;
		state.role = role;
		state.id = id;
	},
	[SET_DATA_ACCOUNT_VUEX](state, vuexData) {
		state.isInitialized = vuexData.isInitialized;
		state.isAuthorized = vuexData.isAuthorized;
		state.fullName = vuexData.fullName;
		state.email = vuexData.email;
		state.role = vuexData.role;
		state.token = vuexData.token;
		state.id = vuexData.id;
	},

	[SET_INIT](state) {
		state.isInitialized = true;
	},
};

export default {
	state,
	actions,
	mutations,
	getters,
};
