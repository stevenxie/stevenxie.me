import Vue from "vue";
import VTooltip from "v-tooltip";

import App from "./App.vue";
import APIClient from "./services/APIClient";
import router from "./router";
import store from "./store";

import { isPrerendering, injectPrerenderedTag } from "./utils";

// Install addons.
Vue.use(VTooltip);

// Configure Vue instance.
Vue.config.productionTip = false;

const { VUE_APP_API_BASE_URL: apiBaseURL } = process.env;
Vue.prototype.$apic = new APIClient(apiBaseURL);

// If prerendering, inject prerendered tag so that future loads will know that
// the page has been prerendered.
if (isPrerendering()) injectPrerenderedTag();

new Vue({
  router,
  store,
  render: h => h(App),
  mounted() {
    // Notify prerenderer that Vue has finished rendering.
    document.dispatchEvent(new Event("render-event"));
  },
}).$mount("#app", window.__PRERENDERED);
