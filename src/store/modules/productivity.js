import * as yup from "yup";
import { segment } from "@/schemas/productivity";

import { createLoadableState, createLoadableMutations } from "@/store/utils";
import * as actions from "@/store/actions";
import * as mutations from "@/store/mutations";

import productivityService from "@/services/productivity";

const module = {
  state: createLoadableState([]),
  mutations: createLoadableMutations({
    loadingName: mutations.PRODUCTIVITY_LOADING,
    successName: mutations.PRODUCTIVITY_SUCCESS,
    failureName: mutations.PRODUCTIVITY_FAILURE,
  }),
  actions: {
    [actions.FETCH_PRODUCTIVITY]: async ({ state, commit }) => {
      if (state.productivityLoading) return;
      commit(mutations.PRODUCTIVITY_LOADING);
      try {
        const productivity = await productivityService.getProductivity();
        await yup
          .array()
          .of(segment)
          .validate(productivity);
        commit(mutations.PRODUCTIVITY_SUCCESS, productivity);
      } catch (err) {
        commit(mutations.PRODUCTIVITY_FAILURE, err);
      }
    },
  },
};

export default module;
