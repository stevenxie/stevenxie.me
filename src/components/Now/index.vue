<template>
  <div class="now" ref="container">
    <carousel
      class="carousel"
      :pagination-padding="4"
      :pagination-size="15"
      :per-page-custom="paging"
      :space-padding="padding"
      pagination-active-color="white"
    >
      <slide v-for="slide in slides" :key="slide">
        <div class="container"><component :is="slide" :ref="slide" /></div>
      </slide>
    </carousel>
  </div>
</template>

<script>
import take from "lodash/take";
import size from "lodash/size";
import reduceRight from "lodash/reduceRight";

import NowPlayingCard from "./NowPlayingCard";
import CommitsCard from "./CommitsCard";
import ProductivityCard from "./ProductivityCard";

// Async imports.
const Carousel = () =>
  import(/* webpackChunkName: "vue-carousel" */ "vue-carousel").then(
    ({ Carousel }) => Carousel
  );
const Slide = () =>
  import(/* webpackChunkName: "vue-carousel" */ "vue-carousel").then(
    ({ Slide }) => Slide
  );

export default {
  data: () => ({
    slides: ["now-playing-card", "productivity-card", "commits-card"],
    paging: [[900, 3], [550, 2], [0, 1]],
    spacing: [
      [1300, 100],
      [1200, 90],
      [1100, 75],
      [1000, 60],
      [900, 45],
      [750, 60],
      [0, 40],
    ],
    padding: 0,
  }),
  async mounted() {
    window.addEventListener("resize", this.updatePadding);
    this.updatePadding();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updatePadding);
  },
  methods: {
    async updatePadding() {
      // Only run after cards mount.
      if (size(this.$refs) === 1) {
        await this.$nextTick();
        setTimeout(this.updatePadding, 0);
        return;
      }

      const { width: cwidth } = this.$refs.container.getBoundingClientRect();
      const [pages, spacing] = [this.paging, this.spacing].map(x =>
        reduceRight(x, (pages, [width, n]) => (cwidth >= width ? n : pages), 0)
      );

      const slideWidths = take(this.slides, pages).map(name => {
        const [ref] = this.$refs[name];
        return ref.$el.getBoundingClientRect().width;
      });

      const contentWidth = slideWidths.reduce((width, sum, index) => {
        sum += width;
        if (index) sum += spacing;
        return sum;
      }, spacing);

      this.padding = (cwidth - contentWidth) / 2;
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

.carousel {
  width: 100%;
  @media (min-width: 900px) {
    align-self: center;
  }
}

.container {
  height: 325px;
  margin-bottom: 24px;

  display: flex;
  align-items: flex-end;
  justify-content: center;
}
</style>
