import Vue from "vue";
import VTooltip from "v-tooltip";

import App from "./App.vue";
import router from "./router";
import store from "./store";

import { prerendering, prerendered, injectPrerenderedTag } from "./utils";

// Install addons.
Vue.use(VTooltip);

// Configure Vue instance.
Vue.config.productionTip = false;

// If prerendering, inject prerendered tag so that future loads will know that
// the page has been prerendered.
if (prerendering) injectPrerenderedTag();

new Vue({
  router,
  store,
  render: h => h(App),
  mounted() {
    // Notify prerenderer that Vue has finished rendering.
    document.dispatchEvent(new Event("render-event"));
  },
}).$mount("#app", prerendered);
