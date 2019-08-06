<template>
  <a class="api-status" :href="apiURL" target="_blank">
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
export default {
  props: { active: { type: Boolean, default: false } },
  data: () => ({ apiURL: "https://github.com/stevenxie/api" }),
  computed: {
    tooltip() {
      return `API is currently ${this.active ? "online" : "offline"}.`;
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
