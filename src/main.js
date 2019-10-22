import Vue from "vue";
import Meta from "vue-meta";
import Analytics from "vue-analytics";
import ProgressiveImage from "vue-progressive-image";

import App from "./App.vue";
import router from "./router";

import {
  prerendering,
  prerendered,
  injectPrerenderedTag,
} from "./utils/prerender";

import { createProvider } from "./apollo";

// Configure Vue instance.
Vue.config.productionTip = false;

// Install plugins.
Vue.use(ProgressiveImage);
Vue.use(Meta);

const { VUE_APP_ANALYTICS_ID } = process.env;
if (VUE_APP_ANALYTICS_ID)
  Vue.use(Analytics, { id: VUE_APP_ANALYTICS_ID, router });

// If prerendering, inject prerendered tag so that future loads will know that
// the page has been prerendered.
if (prerendering) injectPrerenderedTag();

new Vue({
  router,
  apolloProvider: createProvider(),
  render: h => h(App),
  mounted() {
    // Notify prerenderer that Vue has finished rendering.
    document.dispatchEvent(new Event("render-event"));
  },
}).$mount("#app", prerendered);
