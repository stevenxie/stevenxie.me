import * as yup from "yup";
import get from "lodash/get";

import { createLoadableState, createLoadableMutations } from "@/store/utils";
import * as mutations from "@/store/mutations";
import * as getters from "@/store/getters";
import * as actions from "@/store/actions";

import MusicService from "@/services/MusicService";
import { track, progress, playing } from "@/schemas/music";

const module = {
  state: createLoadableState(null),
  getters: {
    [getters.NOW_PLAYING]: ({ data }) => get(data, "playing", false),
    [getters.NOW_PLAYING_TRACK]: ({ data }) => get(data, "track", null),
    [getters.NOW_PLAYING_PROGRESS]: ({ data }) => get(data, "progress", 0),
  },
  mutations: {
    ...createLoadableMutations({
      loadingName: mutations.NOW_PLAYING_LOADING,
      successName: mutations.NOW_PLAYING_SUCCESS,
      failureName: mutations.NOW_PLAYING_FAILURE,
    }),
    [mutations.NOW_PLAYING_PROGRESS]: (state, progress) => {
      state.data.progress = progress;
      state.error = null;
      state.loading = false;
    },
  },
  actions: {
    [actions.FETCH_NOW_PLAYING]: async ({ state, commit }) => {
      if (state.loading) return;
      commit(mutations.NOW_PLAYING_LOADING);
      try {
        const nowplaying = await MusicService.getNowPlaying();
        if (nowplaying)
          await yup
            .object()
            .shape({ track, progress, playing })
            .validate(nowplaying);
        commit(mutations.NOW_PLAYING_SUCCESS, nowplaying);
      } catch (err) {
        commit(mutations.NOW_PLAYING_FAILURE, err);
      }
    },
  },
};

export default module;
