<template>
  <span class="lock-icon">
    <lottie
      :options="options"
      :width="width"
      :height="height"
      :key="remount"
      @animCreated="handleAnimCreated"
    />
  </span>
</template>

<script>
import lock from "@/assets/lottie/lock.json";
import { prerendered } from "@/utils/prerender";

const Lottie = () => import(/* webpackChunkName: "lottie" */ "vue-lottie");
const sizeProp = { type: Number, default: 24 };

export default {
  data: () => ({
    anim: null,
    remount: false,
    options: {
      animationData: lock,
      loop: false,
      autoplay: false,
    },
  }),
  props: {
    locked: { type: Boolean, default: true },
    width: sizeProp,
    height: sizeProp,
  },
  mounted() {
    // Forcefully re-mount icon after hydration to enable interactivity.
    if (prerendered) this.remount = true;
  },
  methods: {
    // prettier-ignore
    handleAnimCreated(anim) { this.anim = anim; }
  },
  watch: {
    locked(value) {
      this.anim.setDirection(value ? -1 : 1);
      this.anim.play();
    },
  },
  components: { lottie: Lottie },
};
</script>
