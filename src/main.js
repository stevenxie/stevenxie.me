import Vue from "vue";
import VTooltip from "v-tooltip";
import VAnalytics from "vue-analytics";
import VProgressiveImage from "vue-progressive-image";

import App from "./App.vue";
import router from "./router";
import store from "./store";

import { prerendering, prerendered, injectPrerenderedTag } from "./utils";

// Configure Vue instance.
Vue.config.productionTip = false;

// Install plugins.
Vue.use(VTooltip);
Vue.use(VProgressiveImage);

const { VUE_APP_ANALYTICS_ID } = process.env;
if (VUE_APP_ANALYTICS_ID)
  Vue.use(VAnalytics, { id: VUE_APP_ANALYTICS_ID, router });

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
