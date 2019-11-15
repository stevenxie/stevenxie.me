<template>
  <div class="map" ref="container" />
</template>

<script>
import gql from "graphql-tag";
import get from "lodash/get";
import { prerendering } from "@/utils/prerender";

import mapbox from "@/utils/mapbox";

export default {
  props: {
    mapstyle: {
      type: String,
      default: "mapbox://styles/mapbox/streets-v11",
    },
    interactive: {
      type: Boolean,
      default: true,
    },
    zoom: {
      type: Number,
      default: 9.5,
    },
    fillOpacity: {
      type: Number,
      default: 0.15,
    },
    showControls: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    region: null,
    error: null,
  }),

  apollo: {
    // prettier-ignore
    region: {
      query: gql`
        {
          location {
            region {
              id
              position
              shape
            }
          }
        }
      `,
      skip: prerendering,
      update: data => get(data, "location.region", null),
      error(err) { this.error = err; },
    }
  },

  mounted() {
    if (prerendering) return;

    // Initialize map.
    this.map = new mapbox.Map({
      container: this.$refs.container,
      style: this.mapstyle,
      interactive: this.interactive,
      zoom: this.zoom,
    });

    // Add position controls.
    const { showControls, map, region, error } = this;
    if (showControls) {
      // Add geolocate control to the map.
      map.addControl(
        new mapbox.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
        })
      );
    }

    if (region && !error) this.update(region);
  },

  beforeDestroy() {
    if (!this.map) return;
    this.map.remove();
  },

  watch: {
    region(curr, prev) {
      if (this.error) return;
      if (curr && !prev) this.update(curr);
    },

    fillOpacity(value) {
      this.whenMapLoads(() =>
        this.map.setPaintProperty(this.region.id, "fill-opacity", value)
      );
    },
  },

  methods: {
    update({ id, position: pos, shape }) {
      this.whenMapLoads(() => {
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
            "fill-opacity": this.fillOpacity,
          },
        });
        this.map.setCenter(pos);
      });
    },

    whenMapLoads(f, ...args) {
      // TODO: Find a better way of determining map loads.
      //
      // This currently uses an internal variable as described here:
      // https://github.com/mapbox/mapbox-gl-js/issues/6707#issuecomment-495481411
      if (this.map._loaded) f(...args);
      else this.map.on("load", () => f(...args));
    },

    // prettier-ignore
    clear() { this.whenMapLoads(this.map.removeLayer, this.region.id); }
  },
};
</script>
