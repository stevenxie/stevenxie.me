<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
@import "@/styles/tooltip.scss"; // tooltip styling

body {
  font-family: "Inter", "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

// prettier-ignore
@supports (font-variation-settings: normal) {
  body { font-family: "Inter var", "Avenir", Helvetica, Arial, sans-serif; }
}

// prettier-ignore
h1, h2, h3, h4, h5, h6, p { margin: 0; }

.flex {
  display: flex;
  flex-direction: column;
}

// prettier-ignore
.mono { font-family: "Roboto Mono", "Courier New", Courier, monospace; }
</style>
