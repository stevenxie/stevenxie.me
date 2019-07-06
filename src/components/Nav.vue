<template>
  <div class="nav">
    <menu-icon @toggle="handleToggle" />
    <div class="links" :class="{ open, closing }">
      <div
        class="link flex"
        v-for="{ name, url, ext, id } in links"
        :key="name"
      >
        <a
          :href="url"
          :target="ext && `_blank`"
          @click="handleLinkClick(id, $event)"
        >
          <h5 class="name">{{ name }}</h5>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import MoveTo from "moveto";
import MenuIcon from "@/components/icons/MenuIcon";

export default {
  data: () => ({
    open: false,
    closing: false,
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
      this.open = false;
    },

    handleToggle(opened) {
      this.open = opened;
      if (!opened) {
        this.closing = true;
        setTimeout(() => (this.closing = false), 500);
      }
    },
  },

  components: { "menu-icon": MenuIcon },
};
</script>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";

// prettier-ignore
.nav { position: relative; }

// prettier-ignore
.menu-icon::v-deep {
  position: absolute;
  z-index: 3;

  $offset: 10px;
  top: $offset; right: $offset;
  path { stroke: white !important; }

  @include breakpoint(tablet) { display: none; }
}

// prettier-ignore
.links {
  position: absolute;
  top: 0; left: 0; right: 0;
  display: flex;

  padding: 10px 0 10px 15px;
  background-color: rgba(white, 0.15);

  transform: translateY(-100px);
  &.open { transform: translateY(0); }
  &.open, &.closing { transition: transform 500ms ease-in-out; }

  @include breakpoint(tablet) {
    transition: none;
    transform: translateY(0);
    background-color: unset;
    left: unset;
    right: 15px;
  }
}

.link {
  padding: 5px;
  justify-content: center;

  // prettier-ignore
  a { text-decoration: none; }

  .name {
    font-size: 15pt;
    font-weight: 600;
    color: white;
    transition: color 200ms ease-in-out;

    // prettier-ignore
    &:hover { color: rgba(white, 0.8); }

    // prettier-ignore
    @include breakpoint(tablet) { font-size: 14pt; }
  }
}
</style>
