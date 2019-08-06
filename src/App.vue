<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  metaInfo: {
    titleTemplate: chunk => {
      const base = "Steven Xie";
      return chunk ? `${chunk} – ${base}` : base;
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/fonts.scss";

body {
  font-family: $sans;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

// prettier-ignore
@supports (font-variation-settings: normal) {
  body { font-family: $sans-var }
}

// prettier-ignore
h1, h2, h3, h4, h5, h6, p { margin: 0; }

.flex {
  display: flex;
  flex-direction: column;
}

// prettier-ignore
.mono { font-family: $mono }

// Custom Primer tooltip fonts.
// prettier-ignore
.tooltipped::after { font-family: $sans; }
</style>
