<template>
  <lottie
    class="alert-icon"
    :options="options"
    :width="width"
    :height="height"
  />
</template>

<script>
import { Lottie } from "@/utils/async-modules";
import alert from "@/assets/lottie/alert-triangle.json";

export default {
  data: () => ({ options: { animationData: alert } }),
  props: {
    width: Number,
    height: Number,
  },
  components: { lottie: Lottie },
};
</script>
