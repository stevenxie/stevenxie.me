import * as yup from "yup";
import { period } from "@/schemas/availability";

import { createLoadableState, createLoadableMutations } from "@/store/utils";
import * as actions from "@/store/actions";
import * as mutations from "@/store/mutations";

import availabilityService from "@/services/availability";

const module = {
  state: createLoadableState([]),
  mutations: createLoadableMutations({
    loadingName: mutations.AVAILABILITY_LOADING,
    successName: mutations.AVAILABILITY_SUCCESS,
    failureName: mutations.AVAILABILITY_FAILURE,
  }),
  actions: {
    [actions.FETCH_AVAILABILITY]: async ({ state, commit }) => {
      if (state.loading) return;
      commit(mutations.AVAILABILITY_LOADING);
      try {
        const { busy } = await availabilityService.getAvailability();
        await yup
          .array()
          .of(period)
          .validate(busy);
        commit(mutations.AVAILABILITY_SUCCESS, busy);
      } catch (err) {
        commit(mutations.AVAILABILITY_FAILURE, err);
      }
    },
  },
};

export default module;
