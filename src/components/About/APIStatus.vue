<template>
  <a class="api-status" :href="url" target="_blank">
    <div
      class="container mono tooltipped tooltipped-w tooltipped-no-delay"
      :aria-label="tooltip"
    >
      api
      <div class="circle" :class="{ active }" />
    </div>
  </a>
</template>

<script>
import { prerendering } from "@/utils/prerender";

const URL = "https://api.stevenxie.me";
const API_URL = process.env.VUE_APP_API_URL + "/";

export default {
  data: () => ({
    active: false,
    url: URL,
  }),
  async mounted() {
    if (prerendering) return;
    const res = await fetch(API_URL, { method: "HEAD" });
    this.active = res.ok;
  },
  computed: {
    tooltip() {
      const status = this.active ? "online" : "offline";
      return `API is currently ${status}.`;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  $color: #b2b2b2;

  padding: 4px 8px;
  border-radius: 8px;

  display: flex;
  align-items: center;

  color: $color;
  background-color: #121212;
  transition: background 200ms ease-in-out;

  font-size: 11pt;
  cursor: pointer;

  // prettier-ignore
  &:hover { color: lighten($color, 10%); }
}

.circle {
  width: 12px;
  height: 12px;
  margin-left: 0.5em;
  border-radius: 50%;
  background: #cd4663;

  // prettier-ignore
  &.active { background: #24c96c; }
}

// prettier-ignore
a { text-decoration: none; }
</style>
