import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
const { BASE_URL } = process.env;

export default new Router({
  mode: "history",
  base: BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: () =>
        import(/* webpackChunkName: "home" */ "@/views/Home.vue"),
    },
    {
      path: "/mood",
      name: "mood",
      component: () =>
        import(/* webpackChunkName: "mood" */ "@/views/Mood.vue"),
    },
    {
      path: "*",
      name: "404",
      component: () =>
        import(/* webpackChunkName: "404" */ "@/views/NotFound.vue"),
    },
  ],
});
