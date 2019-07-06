<template>
  <div class="now">
    <no-prerender>
      <carousel
        class="carousel"
        :pagination-padding="4"
        :pagination-size="15"
        :per-page-custom="paging"
        :space-padding="padding"
        pagination-active-color="white"
      >
        <slide v-for="slide in slides" :key="slide">
          <div class="container"><component :is="slide" ref="slides" /></div>
        </slide>
      </carousel>
    </no-prerender>
  </div>
</template>

<script>
import take from "lodash/take";
import reduceRight from "lodash/reduceRight";
import { prerendering } from "@/utils";

import CommitsCard from "./CommitsCard";
import LocationCard from "./LocationCard";
import NowPlayingCard from "./NowPlayingCard";
import ProductivityCard from "./ProductivityCard";

import NoPrerender from "@/components/NoPrerender";

// Async imports.
// prettier-ignore
const carouselPromise = import(
  /* webpackChunkName: "vue-carousel" */ "vue-carousel"
);
const Carousel = () => carouselPromise.then(({ Carousel }) => Carousel);
const Slide = () => carouselPromise.then(({ Slide }) => Slide);

export default {
  data: () => ({
    slides: [
      "now-playing-card",
      "location-card",
      "productivity-card",
      "commits-card",
    ],
    paging: [[1150, 4], [900, 3], [550, 2], [0, 1]],
    spacing: [
      [1250, 60],
      [1150, 45],
      [1000, 60],
      [900, 45],
      [750, 60],
      [0, 40],
    ],
    padding: 0,
  }),
  mounted() {
    if (prerendering) return;
    window.addEventListener("resize", this.updatePadding);
    this.updatePaddingNextTick();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updatePadding);
  },
  methods: {
    updatePadding() {
      // Only run after cards mount.
      const { slides } = this.$refs;
      if (!slides) return this.updatePaddingNextTick();

      const { innerWidth: wwidth } = window;
      const [pages, spacing] = [this.paging, this.spacing].map(x =>
        reduceRight(x, (pages, [width, n]) => (wwidth >= width ? n : pages), 0)
      );

      const slideWidths = take(slides, pages).map(
        ({ $el: el }) => el.offsetWidth
      );

      const contentWidth = slideWidths.reduce((width, sum, index) => {
        sum += width;
        if (index) sum += spacing;
        return sum;
      }, spacing);
      this.padding = (wwidth - contentWidth) / 2;
    },

    updatePaddingNextTick() {
      this.$nextTick(() => window.setTimeout(this.updatePadding, 0));
    },
  },
  components: {
    slide: Slide,
    carousel: Carousel,
    "no-prerender": NoPrerender,
    "location-card": LocationCard,
    "commits-card": CommitsCard,
    "now-playing-card": NowPlayingCard,
    "productivity-card": ProductivityCard,
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";

.now {
  height: 400px;
  background: #e1e9ee;
  display: flex;
}

.carousel::v-deep .VueCarousel-dot-container {
  margin: 0 !important;
  padding: 2px;
  border-radius: 15px;

  background: #9baab5;
  box-shadow: inset 0 1px 3px 0 rgba(black, 0.5);

  button {
    $color: #ced9e0;

    margin: 0 !important;
    outline: none;
    transition: background 200ms ease-in-out;

    // prettier-ignore
    &:not(.VueCarousel-dot--active) {
      background-color: $color !important;
      &:hover { background-color: lighten($color, 5%) !important; }
    }
  }
}

// prettier-ignore
.carousel {
  width: 100%;
  @include breakpoint(tablet) { align-self: center; }
}

.container {
  height: 325px;
  margin-bottom: 24px;

  display: flex;
  align-items: flex-end;
  justify-content: center;
}
</style>
