<template>
  <div class="map" ref="container" />
</template>

<script>
import mapbox from "mapbox-gl/dist/mapbox-gl";
import { mapState } from "vuex";
import { prerendering } from "@/utils";
import { FETCH_REGION } from "@/store/actions";

const { VUE_APP_MAPBOX_TOKEN } = process.env;
mapbox.accessToken = VUE_APP_MAPBOX_TOKEN;

export default {
  props: {
    mapstyle: {
      type: String,
      default: "mapbox://styles/mapbox/streets-v9",
    },
    interactive: {
      type: Boolean,
      default: true,
    },
    zoom: {
      type: Number,
      default: 11,
    },
    showControls: {
      type: Boolean,
      default: false,
    },
  },

  mounted() {
    if (prerendering) return;
    if (!this.region && !this.loading) this.$store.dispatch(FETCH_REGION);

    // Initialize map.
    this.map = new mapbox.Map({
      container: this.$refs.container,
      style: this.mapstyle,
      interactive: this.interactive,
      zoom: this.zoom,
    });

    // Add position controls.
    if (this.showControls) {
      // Add geolocate control to the map.
      this.map.addControl(
        new mapbox.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
        })
      );
    }

    // Update map with region, if it exists.
    if (this.region) this.update(this.region);
  },

  beforeDestroy() {
    if (!this.map) return;
    this.map.remove();
  },

  computed: {
    ...mapState({
      region: ({ region }) => region.data,
      loading: ({ region }) => region.loading,
    }),
  },

  watch: {
    // prettier-ignore
    region(curr, prev) { if (curr && !prev) this.update(curr) }
  },

  methods: {
    update({ id, position, shape }) {
      const add = () => {
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
        this.map.setCenter(position);
      };

      // Add layer only after load.
      if (this.map.loaded()) add();
      else this.map.on("load", add);
    },

    // prettier-ignore
    clear() { this.map.removeLayer(this.region.id); },

    /** @param {number} opacity */
    setOpacity(opacity) {
      this.map.setPaintProperty(this.region.id, "fill-opacity", opacity);
    },
  },
};
</script>
