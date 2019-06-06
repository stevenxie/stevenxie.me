<template>
  <div class="about mono">
    <div class="loading" v-if="loading">
      <loading-icon :height="50" :width="50" />
    </div>
    <pre v-else>{{ aboutText }}</pre>
    <api-status :active="!!about" />
  </div>
</template>

<script>
import { isPrerendering } from "@/utils";
import { mapGetters, mapState } from "vuex";
import { FETCH_ABOUT } from "@/store/actions";
import { ABOUT_EXCLUDING_CONTACT } from "@/store/getters";

import APIStatus from "./APIStatus";
import LoadingIcon from "@/components/icons/LoadingIcon";

export default {
  created() {
    if (isPrerendering()) return; // do not fetch during prerender
    this.$store.dispatch(FETCH_ABOUT);
  },
  computed: {
    ...mapState({ loading: "aboutLoading", error: "aboutError" }),
    ...mapGetters({ about: ABOUT_EXCLUDING_CONTACT }),
    aboutText() {
      return this.error || JSON.stringify(this.about, undefined, 2);
    },
  },
  components: { "api-status": APIStatus, "loading-icon": LoadingIcon },
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

// prettier-ignore
.loading::v-deep {
  position: absolute;
  top: 0; right: 0; left: 0; bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;

// prettier-ignore
  path { stroke: rgb(85, 85, 85) !important; }
}
</style>
