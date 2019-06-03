<template>
  <div class="about mono">
    <pre>{{ about || "Loading..." }}</pre>
    <api-status :active="alive" />
  </div>
</template>

<script>
import APIStatus from "./APIStatus";

export default {
  data: () => ({
    about: null,
    alive: false,
  }),
  async created() {
    try {
      const { data } = await this.$apic.getAbout();
      this.about = JSON.stringify(data, undefined, 2);
      this.alive = true;
    } catch (err) {
      console.error(err);
      this.about = err;
    }
  },
  components: {
    "api-status": APIStatus,
  },
};
</script>

<style lang="scss" scoped>
.about {
  min-height: 200px;

  padding: 12px 12px 22px 12px;
  box-sizing: border-box;
  position: relative;

  color: #dedede;
  background: #2b2b2b;
  font-weight: 500;
}

pre {
  margin: 5px 0;
  font-family: inherit;
  font-weight: inherit;
  font-size: 11pt;
}

.api-status {
  position: absolute;
  bottom: 8px;
  right: 8px;
}
</style>
