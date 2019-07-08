import omit from "lodash/omit";
import get from "lodash/get";

import { createLoadableState, createLoadableMutations } from "@/store/utils";
import * as actions from "@/store/actions";
import * as getters from "@/store/getters";
import * as mutations from "@/store/mutations";

import aboutService from "@/services/about";

const module = {
  state: createLoadableState(null),
  getters: {
    [getters.ABOUT_EXCLUDING_CONTACT]: ({ data }) =>
      data && omit(data, "email"),
    [getters.ABOUT_EMAIL]: ({ data }) => get(data, "email", null),
  },
  mutations: createLoadableMutations({
    loadingName: mutations.ABOUT_LOADING,
    successName: mutations.ABOUT_SUCCESS,
    failureName: mutations.ABOUT_FAILURE,
  }),
  actions: {
    [actions.FETCH_ABOUT]: async ({ state, commit }) => {
      if (state.loading) return;
      commit(mutations.ABOUT_LOADING);
      try {
        commit(mutations.ABOUT_SUCCESS, await aboutService.getAbout());
      } catch (err) {
        commit(mutations.ABOUT_FAILURE, err);
      }
    },
  },
};

export default module;
