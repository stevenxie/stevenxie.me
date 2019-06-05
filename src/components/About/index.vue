<template>
  <div class="about mono">
    <pre>{{ about || "Loading..." }}</pre>
    <api-status :active="alive" />
  </div>
</template>

<script>
import pick from "lodash/pick";

import APIStatus from "./APIStatus";
import { isPrerendering } from "@/utils";

export default {
  data: () => ({
    about: null,
    alive: false,
  }),
  async created() {
    if (isPrerendering()) return;
    try {
      const { data } = await this.$api.getAbout();
      const about = pick(data, [
        "name",
        "type",
        "age",
        "iq",
        "skills",
        "whereabouts",
      ]);
      this.about = JSON.stringify(about, undefined, 2);
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
