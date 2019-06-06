<template>
  <lottie
    class="alert-icon"
    :options="options"
    :width="width"
    :height="height"
  />
</template>

<script>
import alert from "@/assets/lottie/alert-triangle.json";
const Lottie = () => import(/* webpackChunkName: "lottie" */ "vue-lottie");

export default {
  data: () => ({ options: { animationData: alert } }),
  props: {
    width: Number,
    height: Number,
  },
  components: { lottie: Lottie },
};
</script>
