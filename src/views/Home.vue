<template>
  <div class="home">
    <hero />
    <about />
    <now />
    <availability />
    <contact email="hello@stevenxie.me" />
  </div>
</template>

<script>
// @ is an alias to /src
import Now from "@/components/Now";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Availability from "@/components/Availability";

export default {
  components: {
    now: Now,
    hero: Hero,
    about: About,
    contact: Contact,
    availability: Availability,
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
