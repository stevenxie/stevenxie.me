import Vue from "vue";
import Router from "vue-router";

import Home from "./views/Home.vue";
import Location from "./views/Location.vue";

Vue.use(Router);

const { BASE_URL } = process.env;
export default new Router({
  mode: "history",
  base: BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/location",
      name: "location",
      component: Location,
    },
  ],
});
