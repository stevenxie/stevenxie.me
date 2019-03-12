<template>
  <div class="cz flex col">
    <h1>F</h1>
  </div>
</template>

<script>
export default {
  head: { title: "RIP CZ" },
};
</script>

<style lang="scss" scoped>
@import "@/styles/fonts.scss";

// prettier-ignore
.cz {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  align-items: center;
  justify-content: center;

  background-color: rgb(24, 24, 24);
}

h1 {
  font-family: $mono;
  font-size: 64pt;
  color: rgb(218, 218, 218);
}
</style>
