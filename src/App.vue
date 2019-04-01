<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  data: () => ({
    baseUrl: {
      type: String,
      default: "/",
    },
  }),
  head: () => {
    const { BASE_URL } = process.env;
    return {
      title: "Steven Xie",
      link: [
        // Stylesheets:
        {
          rel: "preload",
          href:
            "https://fonts.googleapis.com/css?family=Barlow:300,400,400i,500,600|Ubuntu+Mono:400,700",
          as: "style",
          onload: "this.rel='stylesheet'",
        },

        // Web App Manifest:
        { rel: "manifest", href: `${BASE_URL}manifest.webmanifest` },

        // Favicons:
        { rel: "icon", type: "image/x-icon", href: `${BASE_URL}favicon.ico` },
        { rel: "icon", type: "image/png", href: `${BASE_URL}favicon.png` },
      ],
    };
  },
};
</script>

<style lang="scss">
// Priority CSS:
@import "../node_modules/@fortawesome/fontawesome-svg-core/styles.css";
@import "@/styles/fonts.scss";

body {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  // Configure default font.
  font-family: $sans;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
}

p {
  margin: 0;
  font-size: 13pt;
}

// prettier-ignore
h1, h2, h3, h4, h5, h6 {
  margin: 0;
  font-family: $mono;
}

// prettier-ignore
.flex { display: flex; }
// prettier-ignore
.col { flex-direction: column; }
</style>
