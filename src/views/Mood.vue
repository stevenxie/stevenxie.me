<template>
  <div class="mood flex col">
    <latest-mood />
  </div>
</template>

<script>
import LatestMood from "@/components/LatestMood.vue";

export default {
  head: { title: "Mood • Steven Xie" },
  components: {
    "latest-mood": LatestMood,
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";

.mood {
  align-items: center;
  padding-top: 0.25em;

  @include breakpoint(phablet) {
    padding-top: 1em;
  }
  @include breakpoint(tablet) {
    padding-top: 2em;
  }
}
</style>
