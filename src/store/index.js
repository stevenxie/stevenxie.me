import Vue from "vue";
import Vuex from "vuex";
import createLogger from "vuex/dist/logger";
import omit from "lodash/omit";
import get from "lodash/get";

import AboutService from "@/services/AboutService";
import CommitsService from "@/services/CommitsService";
import NowPlayingService from "@/services/NowPlayingService";
import AvailabilityService from "@/services/AvailabilityService";
import ProductivityService from "@/services/ProductivityService";

import * as getters from "./getters";
import * as actions from "./actions";
import * as mutations from "./mutations";

import * as yup from "yup";
import { track, progress, playing } from "@/schemas/nowplaying";
import { segment } from "@/schemas/productivity";
import { period } from "@/schemas/availability";
import { commit } from "@/schemas/git";

Vue.use(Vuex);

// Declare plugins.
const plugins = [];
if (process.env.VUE_APP_ENABLE_VUEX_LOGGER) plugins.push(createLogger());

export default new Vuex.Store({
  state: {
    about: null,
    aboutError: null,
    aboutLoading: false,

    nowPlaying: null,
    nowPlayingError: null,
    nowPlayingLoading: false,

    productivity: null,
    productivityError: null,
    productivityLoading: false,

    commits: [],
    commitsError: null,
    commitsLoading: false,

    availability: [],
    availabilityError: null,
    availabilityLoading: false,
  },
  getters: {
    // About:
    [getters.ABOUT_EXCLUDING_CONTACT]: ({ about }) =>
      about && omit(about, "email"),
    [getters.ABOUT_EMAIL]: ({ about }) => get(about, "email", null),

    // Now Playing:
    [getters.NOW_PLAYING]: ({ nowPlaying }) =>
      get(nowPlaying, "playing", false),
    [getters.NOW_PLAYING_TRACK]: ({ nowPlaying }) =>
      get(nowPlaying, "track", null),
    [getters.NOW_PLAYING_PROGRESS]: ({ nowPlaying }) =>
      get(nowPlaying, "progress", 0),
  },
  mutations: {
    // About:
    [mutations.ABOUT_LOADING]: state => (state.aboutLoading = true),
    [mutations.ABOUT_SUCCESS]: (state, about) => {
      state.about = about;
      state.aboutError = null;
      state.aboutLoading = false;
    },
    [mutations.ABOUT_FAILURE]: (state, error) => {
      state.aboutError = error;
      state.aboutLoading = false;
    },

    // Now Playing:
    [mutations.NOW_PLAYING_LOADING]: state => (state.nowPlayingLoading = true),
    [mutations.NOW_PLAYING_SUCCESS]: (state, nowPlaying) => {
      state.nowPlaying = nowPlaying;
      state.nowPlayingError = null;
      state.nowPlayingLoading = false;
    },
    [mutations.NOW_PLAYING_FAILURE]: (state, error) => {
      state.nowPlayingError = error;
      state.nowPlayingLoading = false;
    },

    // Productivity:
    [mutations.PRODUCTIVITY_LOADING]: state =>
      (state.productivityLoading = true),
    [mutations.PRODUCTIVITY_SUCCESS]: (state, productivity) => {
      state.productivity = productivity;
      state.productivityError = null;
      state.productivityLoading = false;
    },
    [mutations.PRODUCTIVITY_FAILURE]: (state, error) => {
      state.productivityError = error;
      state.productivityLoading = false;
    },

    // Commits:
    [mutations.COMMITS_LOADING]: state => (state.commitsLoading = true),
    [mutations.COMMITS_SUCCESS]: (state, commits) => {
      state.commits = commits;
      state.commitsError = null;
      state.commitsLoading = false;
    },
    [mutations.COMMITS_FAILURE]: (state, error) => {
      state.commitsError = error;
      state.commitsLoading = false;
    },

    // Availability:
    [mutations.AVAILABILITY_LOADING]: state =>
      (state.availabilityLoading = true),
    [mutations.AVAILABILITY_SUCCESS]: (state, availability) => {
      state.availability = availability;
      state.availabilityError = null;
      state.availabilityLoading = false;
    },
    [mutations.AVAILABILITY_FAILURE]: (state, error) => {
      state.availabilityError = error;
      state.availabilityLoading = false;
    },
  },
  actions: {
    [actions.FETCH_ABOUT]: async ({ state, commit }) => {
      if (state.aboutLoading) return;
      commit(mutations.ABOUT_LOADING);
      try {
        commit(mutations.ABOUT_SUCCESS, await AboutService.getAbout());
      } catch (err) {
        commit(mutations.ABOUT_FAILURE, err);
      }
    },

    [actions.FETCH_NOW_PLAYING]: async ({ state, commit }) => {
      if (state.nowPlayingLoading) return;
      commit(mutations.NOW_PLAYING_LOADING);
      try {
        const nowPlaying = await NowPlayingService.getNowPlaying();
        if (nowPlaying)
          await yup
            .object()
            .shape({ track, progress, playing })
            .validate(nowPlaying);
        commit(mutations.NOW_PLAYING_SUCCESS, nowPlaying);
      } catch (err) {
        commit(mutations.NOW_PLAYING_FAILURE, err);
      }
    },

    [actions.FETCH_PRODUCTIVITY]: async ({ state, commit }) => {
      if (state.productivityLoading) return;
      commit(mutations.PRODUCTIVITY_LOADING);
      try {
        const productivity = await ProductivityService.getProductivity();
        await yup
          .array()
          .of(segment)
          .validate(productivity);
        commit(mutations.PRODUCTIVITY_SUCCESS, productivity);
      } catch (err) {
        commit(mutations.PRODUCTIVITY_FAILURE, err);
      }
    },

    [actions.FETCH_COMMITS]: async context => {
      if (context.state.commitsLoading) return;
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

    [actions.FETCH_AVAILABILITY]: async ({ state, commit }) => {
      if (state.availabilityLoading) return;
      commit(mutations.AVAILABILITY_LOADING);
      try {
        const { busy } = await AvailabilityService.getAvailability();
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
  plugins,
});
