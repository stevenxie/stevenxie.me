import { createLoadableState, createLoadableMutations } from "@/store/utils";
import * as actions from "@/store/actions";
import * as mutations from "@/store/mutations";

import LocationService from "@/services/LocationService";
import { location } from "@/schemas/location";

const module = {
  state: createLoadableState(null),
  mutations: createLoadableMutations({
    loadingName: mutations.REGION_LOADING,
    successName: mutations.REGION_SUCCESS,
    failureName: mutations.REGION_FAILURE,
  }),
  actions: {
    [actions.FETCH_REGION]: async ({ state, commit }) => {
      if (state.loading) return;
      commit(mutations.REGION_LOADING);
      try {
        const loc = await LocationService.getLocation();
        await location.validate(loc);
        commit(mutations.REGION_SUCCESS, loc);
      } catch (err) {
        commit(mutations.REGION_FAILURE, err);
      }
    },
  },
};

export default module;
