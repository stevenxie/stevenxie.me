<template>
  <div class="api-status mono" v-tooltip="tooltip">
    api
    <div class="circle" :class="{ active }" />
  </div>
</template>

<script>
export default {
  props: {
    active: { type: Boolean, default: false },
  },
  computed: {
    tooltip() {
      return `API is currently ${this.active ? "online" : "offline"}.`;
    },
  },
};
</script>

<style lang="scss" scoped>
.api-status {
  padding: 4px 8px;
  border-radius: 8px;

  display: flex;
  align-items: center;

  color: #b2b2b2;
  background-color: #121212;
  transition: background 200ms ease-in-out;

  font-size: 11pt;
  cursor: pointer;
}

.circle {
  width: 12px;
  height: 12px;
  margin-left: 0.5em;
  border-radius: 50%;
  background-color: #cd4663;

  // prettier-ignore
  &.active { background-color: #24c96c; }
}
</style>
