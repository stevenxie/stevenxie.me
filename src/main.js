import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

// Default prerender injection to empty object.
if (!window.__PRERENDER_INJECTED) {
  window.__PRERENDER_INJECTED = {};
}

new Vue({
  router,
  store,
  render: h => h(App),
  mounted() {
    // Notify prerenderer that Vue has finished rendering.
    document.dispatchEvent(new Event("render-event"));
  },
}).$mount("#app", window.__PRERENDERED);
