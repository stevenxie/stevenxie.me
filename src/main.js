import Vue from "vue";

import App from "@/App.vue";
import router from "./router";
import store from "./store";
import { extend } from "./plugins";

// Configure Vue instance.
Vue.config.productionTip = false;
extend(Vue);

export default () => ({
  router,
  store,
  root: {
    render: h => h(App),
  },
});
