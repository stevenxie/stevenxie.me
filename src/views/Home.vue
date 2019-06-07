<template>
  <div class="home">
    <hero>
      <about v-if="floatAbout" />
    </hero>
    <about v-if="!floatAbout" />
    <now />
    <availability />
    <contact />
  </div>
</template>

<script>
import { prerendering } from "@/utils";

// @ is an alias to /src
import Now from "@/components/Now";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Availability from "@/components/Availability";

import { TABLET_SCREEN_WIDTH } from "@/styles/breakpoints";

export default {
  data: () => ({
    floatAbout: false,
  }),
  mounted() {
    if (prerendering) return; // ignore during prerender
    window.addEventListener("resize", this.updateAboutPosition);
    this.updateAboutPosition();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateAboutPosition);
  },
  methods: {
    updateAboutPosition() {
      if (window.innerWidth >= TABLET_SCREEN_WIDTH) this.floatAbout = true;
      else this.floatAbout = false;
    },
  },
  components: {
    now: Now,
    hero: Hero,
    about: About,
    contact: Contact,
    availability: Availability,
  },
};
</script>

<style lang="scss" scoped>
.hero {
  position: relative;
  z-index: 1;
  box-shadow: 0 2px 4px 0 rgba(black, 0.5);
}

.now {
  position: relative;
  box-shadow: 0 0 4px 4px rgba(black, 0.5);
  z-index: 1s;
}
</style>
