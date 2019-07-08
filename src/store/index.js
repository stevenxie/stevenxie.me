import Vue from "vue";
import Vuex from "vuex";
import createLogger from "vuex/dist/logger";

import about from "./modules/about";
import availability from "./modules/availability";
import commits from "./modules/commits";
import nowplaying from "./modules/nowplaying";
import productivity from "./modules/productivity";
import region from "./modules/region";

import { nowPlayingStreamPlugin } from "./plugins";

Vue.use(Vuex);

// Declare plugins.
const plugins = [nowPlayingStreamPlugin];
if (process.env.VUE_APP_ENABLE_VUEX_LOGGER) plugins.push(createLogger());

export default new Vuex.Store({
  modules: {
    about,
    availability,
    commits,
    nowplaying,
    productivity,
    region,
  },
  plugins,
});
