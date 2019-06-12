<template>
  <div class="now">
    <carousel
      class="carousel"
      :pagination-padding="4"
      :pagination-size="15"
      :per-page-custom="paging"
      :space-padding="padding"
      pagination-active-color="white"
      v-if="renderCarousel"
    >
      <slide v-for="slide in slides" :key="slide">
        <div class="container"><component :is="slide" ref="slides" /></div>
      </slide>
    </carousel>
  </div>
</template>

<script>
import take from "lodash/take";
import reduceRight from "lodash/reduceRight";
import { prerendering } from "@/utils";

import NowPlayingCard from "./NowPlayingCard";
import CommitsCard from "./CommitsCard";
import ProductivityCard from "./ProductivityCard";

// Async imports.
// prettier-ignore
const carouselPromise = import(
  /* webpackChunkName: "vue-carousel" */ "vue-carousel"
);
const Carousel = () => carouselPromise.then(({ Carousel }) => Carousel);
const Slide = () => carouselPromise.then(({ Slide }) => Slide);

export default {
  data: () => ({
    slides: ["now-playing-card", "productivity-card", "commits-card"],
    paging: [[900, 3], [550, 2], [0, 1]],
    spacing: [
      [1200, 90],
      [1100, 75],
      [1000, 60],
      [900, 45],
      [750, 60],
      [0, 40],
    ],
    padding: 0,
    renderCarousel: false,
  }),
  mounted() {
    if (prerendering) return; // ignore during prerender
    this.renderCarousel = true;
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
