<template>
  <div class="location flex">
    <div class="map-wrapper">
      <custom-map
        :show-controls="true"
        :zoom="12"
        :fill-opacity="fillOpacity"
        ref="map"
      />
    </div>
    <div class="panel flex">
      <div class="group">
        <h1 class="label">Approx. Location</h1>
        <p class="value">{{ region ? region.address.label : "Unknown" }}</p>
      </div>
      <div class="group">
        <h1 class="label">Detailed Location</h1>
        <div class="passcode">
          <form @submit.prevent="handleUnlock" autocomplete="off">
            <input
              class="mono"
              name="access"
              type="text"
              autocomplete="false"
              placeholder="access code"
              ref="input"
              v-model="code"
              :disabled="!region || !locked"
            />
            <input type="submit" hidden />
          </form>
          <div class="icons">
            <loading-icon :height="18" :width="18" v-if="verifying" />
            <lock-icon
              :class="{ shake: wrong, unlocked: !locked }"
              :height="22"
              :locked="locked"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import uuidHash from "uuid-by-string";
import last from "lodash/last";
import parse from "date-fns/parse";
import differenceInMinutes from "date-fns/difference_in_minutes";

import locationService from "@/services/location";
import { mapState } from "vuex";
import { FETCH_REGION } from "@/store/actions";
import { prerendering } from "@/utils/prerender";

import LockIcon from "@/components/icons/LockIcon";
import LoadingIcon from "@/components/icons/LoadingIcon";

import { mapbox, Map } from "@/utils/async-modules";

export default {
  metaInfo: {
    title: "Location",
    meta: [
      {
        name: "description",
        content: "Request current location data and recent location history.",
      },
    ],
  },

  data: () => ({
    locked: true,
    wrong: false,
    verifying: false,
    fillOpacity: 0.2,
    code: "",
  }),

  mounted() {
    if (prerendering) return;
    if (!this.region && !this.loading) this.$store.dispatch(FETCH_REGION);
  },

  computed: {
    ...mapState({
      region: ({ region }) => region.data,
      loading: ({ region }) => region.loading,
      error: ({ region }) => region.error,
    }),
  },

  methods: {
    async handleUnlock() {
      if (!this.locked || this.verifying) return; // no-op
      this.verifying = true;

      try {
        const segments = await locationService.getRecentLocationHistory(
          this.code.trim()
        );
        this.$refs.input.blur();
        this.locked = false;

        const { map } = this.$refs.map;
        this.fillOpacity = 0.1;

        const places = [];
        segments.forEach(segment => {
          const {
            coordinates,
            distance,
            timeSpan: { begin, end },
          } = segment;
          const difference = differenceInMinutes(new Date(), parse(end)) / 60;
          const opacity = 1.35 / (difference + 1.5) + 0.1;
          if (coordinates.length > 1) {
            map.addLayer({
              id: uuidHash(begin),
              type: "line",
              source: {
                type: "geojson",
                data: {
                  type: "Feature",
                  geometry: { type: "LineString", coordinates },
                },
              },
              layout: {
                "line-join": "round",
                "line-cap": "round",
              },
              paint: {
                "line-color": "#FF00C3",
                "line-opacity": opacity,
                "line-width": 5.5,
              },
            });
          } else if (!distance) {
            const {
              coordinates: [coordinates],
              ...others
            } = segment;
            places.push({ coordinates, ...others });
          }
        });

        // Add places.
        const features = places.map(({ place, address, coordinates }) => ({
          type: "Feature",
          properties: { description: `<h3>${place}</h3><p>${address}</p>` },
          geometry: { type: "Point", coordinates },
        }));
        map.addLayer({
          id: "places",
          type: "circle",
          source: {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features,
            },
          },
          paint: {
            "circle-radius": 6,
            "circle-opacity": 0.6,
            "circle-color": "#8929FF",
            "circle-stroke-width": 8,
            "circle-stroke-color": "transparent",
          },
        });

        // Add places popups.
        const { default: mb } = await mapbox();
        const popup = new mb.Popup({
          closeButton: false,
          closeOnClick: false,
        });
        map.on(
          "mouseenter",
          "places",
          ({ features: [feature], lngLat: { lng } }) => {
            // Channge cursor style.
            map.getCanvas().style.cursor = "pointer";

            const { geometry, properties } = feature;
            const { description } = properties;
            const coordinates = geometry.coordinates.slice();

            // Ensure that if the map is zoomed out such that multiple copies of
            // the feature are visible, the popup appears over the copy being
            // pointed to.
            while (Math.abs(lng - coordinates[0]) > 180) {
              coordinates[0] += lng > coordinates[0] ? 360 : -360;
            }

            // Populate the popup and set its coordinates based on the feature
            // found.
            popup
              .setLngLat(coordinates)
              .setHTML(description)
              .addTo(map);
          }
        );
        map.on("mouseleave", "places", () => {
          map.getCanvas().style.cursor = "";
          popup.remove();
        });

        // Add 'current location' dot.
        const position = last(last(segments).coordinates);
        map.addLayer({
          id: "current",
          type: "circle",
          source: {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: { type: "Point", coordinates: position },
            },
          },
          paint: {
            "circle-radius": 7,
            "circle-color": "#0537FC",
            "circle-stroke-width": 11,
            "circle-stroke-color": "#365EFF",
            "circle-stroke-opacity": 0.3,
          },
        });

        map.flyTo({
          center: position,
          zoom: 14,
        });
      } catch (err) {
        if (!err.response || err.response.status !== 401) throw err;
        this.wrong = true;
        window.setTimeout(() => (this.wrong = false), 1000);
      } finally {
        this.verifying = false;
      }
    },
  },

  components: {
    "custom-map": Map,
    "lock-icon": LockIcon,
    "loading-icon": LoadingIcon,
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/breakpoints.scss";

// prettier-ignore
.location {
  position: absolute;
  top: 0; right: 0; left: 0; bottom: 0;
}

// prettier-ignore
.map-wrapper::v-deep {
  flex: 1;

  .map {
    height: 100%;
    width: 100%;
  }

  .mapboxgl-popup {
    font-family: "Inter var", "Avenir", Helvetica, Arial, sans-serif;

    h3 { margin-bottom: 3px; }
    p { line-height: 18px; }

    .mapboxgl-popup-content {
      border-radius: 4px;
      padding-bottom: 10px;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.4);
    }
  }
}

// prettier-ignore
.panel {
  position: relative;
  z-index: 1;
  min-height: 110px;
  padding: 15px 18px;

  background: white;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.5);

  @include breakpoint(phablet) {
    $offset: 25px;

    position: absolute;
    bottom: $offset; right: $offset;
    width: 275px;
    border-radius: 5px;
    box-shadow: 0 2px 8px 0 rgba(0,0,0,0.50);
  }
}

.group {
  // prettier-ignore
  &:not(:first-of-type) { margin-top: 16px; }

  .label {
    margin-bottom: 4px;
    font-size: 10pt;
    font-weight: 500;
    color: #8b8b8b;
  }

  .value {
    font-size: 16pt;
    font-weight: 700;
    color: #404040;

    // Overflow into ellipses.
    display: block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .passcode {
    position: relative;

    // prettier-ignore
    input[name="access"] {
      $background: #d6d6d6;

      width: 100%;
      padding: 8px 10px;
      border: none;
      border-radius: 6px;
      box-sizing: border-box;
      outline: none;

      font-size: 12pt;
      font-weight: 500;
      background: $background;
      transition: background 250ms ease-in-out;

      &::placeholder { color: rgb(129, 129, 129); }
      &:disabled { cursor: not-allowed; }
      &:not(:disabled) {
        &:hover, &:focus { background: lighten($background, 2%); }
      }
    }

    // prettier-ignore
    .icons::v-deep {
      position: absolute;
      top: 0; right: 0; bottom: 0;
      display: flex;
      align-items: center;

      > * { margin-right: 5px !important; }
      .loading-icon svg path { stroke: rgb(100, 100, 100); }

      .lock-icon {
        svg path {
          stroke: rgb(69, 69, 69);
          transition: stroke 275ms ease-in-out;
        }
        &.unlocked svg path { stroke: rgb(16, 156, 98); }

        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
          40%, 60% { transform: translate3d(3px, 0, 0); }
        }
        &.shake {
          animation: shake 700ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
          svg path { stroke: rgb(248, 10, 89); }
        }
      }
    }
  }
}
</style>
