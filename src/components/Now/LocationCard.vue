<template>
  <card class="location" v-bind="headers">
    <div class="fullsize" ref="content" />
  </card>
</template>

<script>
import mapbox from "mapbox-gl/dist/mapbox-gl";
import { mapState } from "vuex";
import { prerendering } from "@/utils";
import { FETCH_LOCATION } from "@/store/actions";

import Card from "./Card";

const { VUE_APP_MAPBOX_TOKEN } = process.env;
mapbox.accessToken = VUE_APP_MAPBOX_TOKEN;

export default {
  mounted() {
    if (prerendering) return;
    this.$store.dispatch(FETCH_LOCATION);
    this.map = new mapbox.Map({
      container: this.$refs.content,
      style: "mapbox://styles/stevenxie/cjxqme8sn3uwz1cnz6m83b0mi",
      interactive: false,
      zoom: 11,
    });
  },

  beforeDestroy() {
    if (prerendering) return;
    this.map.remove();
  },

  computed: {
    ...mapState({
      location: "location",
      loading: "locationLoading",
      error: "locationError",
    }),

    /** @returns {{ title: string, label: string }} */
    headers() {
      const headers = {
        title: "Unknown",
        // TODO: Add 'location' page.
        // titleURL: "/location",
        label: "Current Location",
        error: this.error && "Failed to load location data.",
      };
      if (this.location) headers.title = this.location.address.label;
      return headers;
    },
  },

  watch: {
    location({ id, position: { x, y }, shape }) {
      this.map.on("load", () => {
        this.map.addLayer({
          id,
          type: "fill",
          source: {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [shape],
              },
            },
          },
          paint: {
            "fill-color": "#FF009B",
            "fill-opacity": 0.2,
          },
        });
        this.map.setCenter([x, y]);
      });
    },
  },

  components: { card: Card },
};
</script>

<style lang="scss" scoped>
.fullsize {
  width: 100%;
  height: 100%;
}
</style>
