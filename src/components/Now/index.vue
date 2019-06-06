<template>
  <div class="now flex">
    <carousel
      class="carousel"
      :per-page="1"
      :pagination-padding="4"
      :pagination-size="15"
      pagination-active-color="white"
    >
      <slide>
        <div class="container"><now-playing-card /></div>
      </slide>
      <slide>
        <div class="container"><productivity-card /></div>
      </slide>
      <slide>
        <div class="container"><commits-card /></div>
      </slide>
    </carousel>
  </div>
</template>

<script>
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
    segments: null,
    commits: null,
    slickOptions: {
      slidesToShow: 1,
      adaptiveHeight: true,
    },
  }),
  components: {
    "commits-card": CommitsCard,
    "now-playing-card": NowPlayingCard,
    "productivity-card": ProductivityCard,
    carousel: Carousel,
    slide: Slide,
  },
};
</script>

<style lang="scss" scoped>
.now {
  height: 400px;
  background: #e1e9ee;
}

.container {
  width: 100%;
  height: 325px;
  margin-bottom: 24px;

  display: flex;
  align-items: flex-end;
  justify-content: center;
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
</style>
