<template>
  <div class="mood flex col">
    <moods />
  </div>
</template>

<script>
import Moods from "@/components/Moods.vue";

export default {
  head: { title: "Mood • Steven Xie" },
  components: { Moods },
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
