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
import { Lottie } from "@/utils/async-modules";

export default {
  data: () => ({ options: { animationData: loading } }),
  props: {
    width: Number,
    height: Number,
  },
  components: { lottie: Lottie },
};
</script>
