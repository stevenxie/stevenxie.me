<template>
  <div class="map" ref="container" />
</template>

<script>
import mapbox from "@/utils/mapbox";
import { mapState } from "vuex";
import { prerendering } from "@/utils/prerender";
import { FETCH_REGION } from "@/store/actions";

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
    region(curr, prev) { if (curr && !prev) this.update(curr); },

    fillOpacity(value) {
      this.whenMapLoads(() =>
        this.map.setPaintProperty(this.region.id, "fill-opacity", value)
      );
    },
  },

  methods: {
    update({ id, position, shape }) {
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
        this.map.setCenter(position);
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
