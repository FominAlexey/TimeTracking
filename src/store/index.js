import { createStore } from "vuex";
import AccountModule from "./modules/accounts/account";
import SettingsModule from "./modules/settings/settings";

import createPersistedState from "vuex-persistedstate"

export default createStore({
  modules: {
    AccountModule,
    SettingsModule,
  },
  plugins: [
    createPersistedState({
      storage: window.localStorage,
      reducer: (vuexState) => {
        return {
          store: {
            AccountModule: {
              isInitialized: vuexState.AccountModule.isInitialized,
              isAuthorized: vuexState.AccountModule.isAuthorized,
              fullName: vuexState.AccountModule.fullName,
              email: vuexState.AccountModule.email,
              role: vuexState.AccountModule.role,
              token: vuexState.AccountModule.token,
              id: vuexState.AccountModule.id,
            },
            SettingsModule: {
              userId: vuexState.SettingsModule.userId,
              rulesFiltersTenders: vuexState.SettingsModule.rulesFiltersTenders,
            }
          },
        };
      },
    }),
  ],
});
