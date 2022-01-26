import { createStore } from "vuex";
/* import createPersistedState from "vuex-persistedstate"; */
import state from "@/store/state";
import actions from "@/store/actions";
import getters from "@/store/getters";
import mutations from "@/store/mutations";

export default createStore({
  state,
  mutations,
  actions,
  getters,
  modules: {},
  /*   plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ], */
});
