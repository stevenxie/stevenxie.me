<template>
  <div class="home">
    <hero />
    <about />
  </div>
</template>

<script>
import { parse as parseDate, distanceInWords } from "date-fns";

// @ is an alias to /src
import Hero from "@/components/Hero";
import About from "@/components/About";

// Declare constants.
const BIRTH_DATE = parseDate("1999-05-04");

export default {
  data: () => ({
    about: {
      name: "Steven Xie",
      age: distanceInWords(new Date(), BIRTH_DATE),
      depressed: "questionable",
    },
  }),
  components: {
    hero: Hero,
    about: About,
  },
};
</script>

<style lang="scss" scoped>
.hero {
  position: relative;
  z-index: 1;
  box-shadow: 0 2px 4px 0 rgba(#000000, 0.5);
}

.about {
  /* z-index: -1; */
}
</style>
