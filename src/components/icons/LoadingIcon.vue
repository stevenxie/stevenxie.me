<template>
  <lottie
    class="loading-icon"
    :options="options"
    :width="width"
    :height="height"
  />
</template>

<script>
import loading from "@/assets/lottie/loading.json";
const Lottie = () => import(/* webpackChunkName: "lottie" */ "vue-lottie");

export default {
  data: () => ({ options: { animationData: loading } }),
  props: {
    width: Number,
    height: Number,
  },
  components: { lottie: Lottie },
};
</script>
