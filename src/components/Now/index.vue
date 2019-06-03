<template>
  <div class="now flex">
    <carousel
      class="carousel"
      :per-page="1"
      :pagination-padding="4"
      :pagination-size="15"
      pagination-color="#ced9e0"
      pagination-active-color="white"
      ref="carousel"
    >
      <slide>
        <div class="container"><music-card v-bind="nowplaying" /></div>
      </slide>
      <slide>
        <div class="container"><productivity-card :segments="segments" /></div>
      </slide>
      <slide>
        <div class="container"><commits-card :commits="commits" /></div>
      </slide>
    </carousel>
  </div>
</template>

<script>
import Hammer from "hammerjs";
import { Carousel, Slide } from "vue-carousel";
import { clearInterval } from "timers";

import MusicCard from "./MusicCard";
import CommitsCard from "./CommitsCard";
import ProductivityCard from "./ProductivityCard";

export default {
  data: () => ({
    nowplaying: {},
    segments: null,
    commits: null,
    slickOptions: {
      slidesToShow: 1,
      adaptiveHeight: true,
    },
  }),
  async created() {
    this.fetchloop = setInterval(this.updateNowPlaying, 1000);
    try {
      const { data: segments } = await this.$apic.getProductivity();
      this.segments = segments;

      const { data: commits } = await this.$apic.getCommits(3);
      this.commits = commits;
    } catch (err) {
      console.log(err);
    }
  },
  mounted() {
    let hswiping = false;
    this.hammer = new Hammer(document);
    this.hammer.on("swipeleft swiperight panleft panright", () => {
      hswiping = true;
    });
    this.hammer.on("swipeup swipedown panup pandown", () => {
      hswiping = false;
    });

    this.carouselSwipeListener = this.$refs.carousel.$el.addEventListener(
      "touchmove",
      e => hswiping && e.cancellable && e.preventDefault()
    );
  },
  methods: {
    async updateNowPlaying() {
      try {
        const { data } = await this.$apic.getNowPlaying();
        this.nowplaying = data;
      } catch (err) {
        console.error(err);
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.fetchloop);
    this.$refs.carousel.$el.removeEventListener(this.carouselSwipeListener);
  },
  components: {
    "music-card": MusicCard,
    "commits-card": CommitsCard,
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
    margin: 0 !important;
    outline: none;
  }
}
</style>
