<template>
  <div class="map" ref="container" />
</template>

<script>
import mapbox from "mapbox-gl/dist/mapbox-gl";
import { mapState } from "vuex";
import { prerendering } from "@/utils";
import { FETCH_LOCATION } from "@/store/actions";

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
    if (!this.location && !this.loading) this.$store.dispatch(FETCH_LOCATION);

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
  },

  beforeDestroy() {
    if (!this.map) return;
    this.map.remove();
  },

  computed: {
    ...mapState({ location: "location", loading: "locationLoading" }),
  },

  watch: {
    location({ id, position: { x, y }, shape }) {
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
        this.map.setCenter([x, y]);
      };

      // Add layer only after load.
      if (this.map.loaded()) add();
      else this.map.on("load", add);
    },
  },
};
</script>
