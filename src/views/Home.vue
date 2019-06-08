<template>
  <div class="home">
    <custom-nav @on-move-to="handleMoveFocus" />
    <hero>
      <about v-if="renderAbout && embedAbout" />
    </hero>
    <about v-if="renderAbout && !embedAbout" />
    <now />
    <availability />
    <contact :focus="focusContact" />
  </div>
</template>

<script>
import { prerendering } from "@/utils";

// @ is an alias to /src
import Nav from "@/components/Nav";
import Now from "@/components/Now";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Availability from "@/components/Availability";

import { TABLET_SCREEN_WIDTH } from "@/styles/breakpoints";

export default {
  data: () => ({
    embedAbout: false,
    renderAbout: false,
    focusContact: false,
  }),
  mounted() {
    if (prerendering) return; // ignore during prerender
    window.addEventListener("resize", this.updateAboutPosition);
    this.updateAboutPosition();
    this.renderAbout = true;
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateAboutPosition);
  },
  methods: {
    updateAboutPosition() {
      if (window.innerWidth >= TABLET_SCREEN_WIDTH) this.embedAbout = true;
      else this.embedAbout = false;
    },
    handleMoveFocus(id) {
      if (id !== "contact") return;
      this.focusContact = true;
    },
  },
  components: {
    "custom-nav": Nav,
    now: Now,
    hero: Hero,
    about: About,
    contact: Contact,
    availability: Availability,
  },
};
</script>

<style lang="scss" scoped>
.home {
  position: relative;
}

// prettier-ignore
.nav {
  position: absolute;
  top: 0; right: 0;
  z-index: 2;
}

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
