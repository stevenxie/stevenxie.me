<template>
  <div class="home">
    <hero />
    <about />
    <now />
  </div>
</template>

<script>
// @ is an alias to /src
import Hero from "@/components/Hero";
import About from "@/components/About";
import Now from "@/components/Now";

export default {
  components: {
    hero: Hero,
    about: About,
    now: Now,
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
