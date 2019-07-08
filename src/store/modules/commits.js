import * as yup from "yup";
import { commit } from "@/schemas/git";

import { createLoadableState, createLoadableMutations } from "@/store/utils";
import * as actions from "@/store/actions";
import * as mutations from "@/store/mutations";

import CommitsService from "@/services/CommitsService";

const module = {
  state: createLoadableState([]),
  mutations: createLoadableMutations({
    loadingName: mutations.COMMITS_LOADING,
    successName: mutations.COMMITS_SUCCESS,
    failureName: mutations.COMMITS_FAILURE,
  }),
  actions: {
    [actions.FETCH_COMMITS]: async context => {
      if (context.state.loading) return;
      context.commit(mutations.COMMITS_LOADING);
      try {
        const commits = await CommitsService.getCommits();
        await yup
          .array()
          .of(commit)
          .validate(commits);
        context.commit(mutations.COMMITS_SUCCESS, commits);
      } catch (err) {
        context.commit(mutations.COMMITS_FAILURE, err);
      }
    },
  },
};

export default module;
