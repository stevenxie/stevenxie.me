<template>
  <card class="location" v-bind="headers">
    <custom-map
      class="fullsize"
      mapstyle="mapbox://styles/stevenxie/cjxqme8sn3uwz1cnz6m83b0mi"
      :interactive="false"
    />
  </card>
</template>

<script>
import { mapState } from "vuex";
import { FETCH_REGION } from "@/store/actions";
import { prerendering } from "@/utils";

import Card from "./Card";
const Map = () => import(/* webpackChunkName: "map" */ "@/components/Map");

const LOCATION_PAGE_URL = "/location";

export default {
  mounted() {
    if (prerendering) return;
    if (!this.region && !this.loading) this.$store.dispatch(FETCH_REGION);
  },

  computed: {
    ...mapState({
      region: ({ region }) => region.data,
      error: ({ region }) => region.error,
    }),

    /** @returns {{ title: string, label: string }} */
    headers() {
      const headers = {
        title: "Unknown",
        titleURL: this.error ? undefined : LOCATION_PAGE_URL,
        label: "Current Location",
        labelURL: this.error ? undefined : LOCATION_PAGE_URL,
        error: this.error && "Failed to load location data.",
      };
      if (this.region) headers.title = this.region.address.label;
      return headers;
    },
  },

  components: { card: Card, "custom-map": Map },
};
</script>

<style lang="scss" scoped>
.fullsize {
  width: 100%;
  height: 100%;
}
</style>
