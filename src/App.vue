<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
@import "@/styles/tooltip.scss"; // tooltip styling

@import url("https://rsms.me/inter/inter.css");
@import url("https://fonts.googleapis.com/css?family=Roboto+Mono:400,500,700&display=swap");

body {
  margin: 0;
  font-family: "Inter", "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
