<template>
  <card class="location" v-bind="headers">
    <div class="content fullsize">
      <custom-map
        class="fullsize"
        mapstyle="mapbox://styles/stevenxie/cjxqme8sn3uwz1cnz6m83b0mi"
        :interactive="false"
      />
      <a :href="locationPageURL" target="_blank">
        <div class="overlay flex">
          <p>Click to open full map.</p>
        </div>
      </a>
    </div>
  </card>
</template>

<script>
import { mapState } from "vuex";
import { FETCH_REGION } from "@/store/actions";
import { prerendering } from "@/utils/prerender";

import Card from "./Card";
import { Map } from "@/utils/async-modules";

const LOCATION_PAGE_URL = "/location";

export default {
  data: () => ({ locationPageURL: LOCATION_PAGE_URL }),

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

  components: {
    card: Card,
    "custom-map": Map,
  },
};
</script>

<style lang="scss" scoped>
.fullsize {
  width: 100%;
  height: 100%;
}

// prettier-ignore
.content {
  .map { transition: filter 350ms ease-in-out; }
  &:hover .map { filter: blur(2px); }
}

// prettier-ignore
.overlay {
  position: absolute;
  top: 0; bottom: 0; right: 0; left: 0;

  align-items: center;
  justify-content: center;

  cursor: pointer;
  opacity: 0;
  transition: all 250ms ease-in-out;

  &:hover {
    opacity: 1;
    color: rgb(80, 80, 80);
    background: rgba(white, 0.3);
    font-weight: 500;
  }
}
</style>
