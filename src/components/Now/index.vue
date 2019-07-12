<template>
  <section class="now" ref="container">
    <no-prerender>
      <carousel
        class="carousel"
        :per-page-custom="paging"
        :space-padding="padding"
        :pagination-padding="4"
        :pagination-size="15"
        pagination-active-color="white"
      >
        <slide v-for="(slide, i) in slides" :key="slide">
          <div class="container">
            <component
              class="component"
              :class="{ visible }"
              ref="slides"
              :is="slide"
              :style="{ transitionDelay: `${i * 60 + 50}ms` }"
            />
          </div>
        </slide>
      </carousel>
    </no-prerender>
  </section>
</template>

<script>
import take from "lodash/take";
import reduceRight from "lodash/reduceRight";
import { carousel } from "@/utils/async-modules";
import { prerendering } from "@/utils/prerender";

import CommitsCard from "./CommitsCard";
import LocationCard from "./LocationCard";
import NowPlayingCard from "./NowPlayingCard";
import ProductivityCard from "./ProductivityCard";

import NoPrerender from "@/components/NoPrerender";

const Carousel = () => carousel().then(({ Carousel }) => Carousel);
const Slide = () => carousel().then(({ Slide }) => Slide);

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
    visible: false,
  }),

  mounted() {
    if (prerendering) {
      this.visible = true;
      return;
    }

    // Update padding.
    window.addEventListener("resize", this.updatePadding);
    this.updatePaddingNextTick();

    // Observe when component is visible.
    if (IntersectionObserver) {
      this.observer = new IntersectionObserver(
        ([entry]) =>
          entry.isIntersecting &&
          window.setTimeout(() => (this.visible = true)),
        { threshold: [0] }
      );
      this.observer.observe(this.$refs.container);
    } else this.visible = true;
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updatePadding);
    if (this.observer) this.observer.disconnect();
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

.carousel::v-deep {
  width: 100%;

  // prettier-ignore
  @include breakpoint(tablet) { align-self: center; }

  .VueCarousel-dot-container {
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
}

.container {
  height: 325px;
  margin-bottom: 24px;

  display: flex;
  align-items: flex-end;
  justify-content: center;

  @include breakpoint(phablet) {
    .component {
      transition: transform 333ms cubic-bezier(0.215, 0.61, 0.355, 1);
      transform: translateY(400px);

      // prettier-ignore
      &.visible { transform: translateY(0); }
    }
  }
}
</style>
