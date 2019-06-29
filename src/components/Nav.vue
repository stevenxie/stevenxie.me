<template>
  <div class="nav">
    <a
      class="link"
      v-for="{ name, url, ext, id } in links"
      :href="url"
      :target="ext && `_blank`"
      :key="name"
      @click="handleLinkClick(id, $event)"
    >
      <h5 class="name">{{ name }}</h5>
    </a>
  </div>
</template>

<script>
import MoveTo from "moveto";

export default {
  data: () => ({
    links: [
      { name: "contact", url: "#contact", id: "contact" },
      { name: "github", url: "https://github.com/stevenxie", ext: true },
      { name: "status", url: "https://status.stevenxie.me", ext: true },
    ],
    moveTo: new MoveTo({ duration: 1500 }),
  }),

  methods: {
    /** @param {string} id The ID of the element to scroll to. */
    scrollToID(id) {
      const el = document.getElementById(id);
      this.moveTo.move(el);
    },

    handleLinkClick(id, e) {
      if (!id) return true;
      e.preventDefault();
      history.pushState(null, null, "#contact");
      this.scrollToID(id);
      this.$emit("on-move-to", id);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";

.nav {
  display: none;
  padding: 14px 10px;

  @include breakpoint(tablet) {
    display: flex;
  }
}

// prettier-ignore
.link {
  margin-right: 10px;
  font-size: 16pt;
  text-decoration: none;
  color: white;
  transition: color 200ms ease-in-out;
  &:hover { color: rgba(white, 0.8); }
  .name { font-weight: 600; }
}
</style>
