<template>
  <span class="menu-icon" @click="toggle">
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
import menu from "@/assets/lottie/menu.json";
import { prerendered } from "@/utils/prerender";

const Lottie = () => import(/* webpackChunkName: "lottie" */ "vue-lottie");
const sizeProp = { type: Number, default: 30 };

export default {
  data: () => ({
    anim: null,
    opened: false,
    remount: false,
    options: {
      animationData: menu,
      loop: false,
      autoplay: false,
    },
  }),
  props: {
    width: sizeProp,
    height: sizeProp,
  },
  mounted() {
    // Forcefully re-mount icon after hydration to enable interactivity.
    if (prerendered) this.remount = true;
  },
  methods: {
    // prettier-ignore
    handleAnimCreated(anim) { this.anim = anim; },
    toggle() {
      this.anim.setDirection(this.opened ? -1 : 1);
      this.anim.play();
      this.opened = !this.opened;

      // Emit event.
      this.$emit("toggle", this.opened);
    },
  },
  components: { lottie: Lottie },
};
</script>

<style lang="scss" scoped>
// prettier-ignore
.menu-icon { cursor: pointer; }
</style>
