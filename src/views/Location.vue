<template>
  <div class="location flex">
    <custom-map :show-controls="true" :zoom="12" ref="map" />
    <div class="panel flex">
      <div class="group">
        <h1 class="label">Approx. Location</h1>
        <p class="value">{{ location ? location.address.label : "Unknown" }}</p>
      </div>
      <div class="group">
        <h1 class="label">Detailed Location</h1>
        <div class="passcode">
          <input
            class="input mono"
            type="text"
            placeholder="access code"
            v-model="code"
            @keyup.enter="unlock"
            :disabled="!location || !locked"
          />
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
import differenceInHours from "date-fns/difference_in_hours";
import { mapState } from "vuex";

import LocationService from "@/services/LocationService";
import { FETCH_LOCATION } from "@/store/actions";
import { prerendering } from "@/utils";

import LockIcon from "@/components/icons/LockIcon";
import LoadingIcon from "@/components/icons/LoadingIcon";
const Map = () => import(/* webpackChunkName: "map" */ "@/components/Map");

export default {
  data: () => ({
    locked: true,
    wrong: false,
    verifying: false,
    code: "",
  }),

  mounted() {
    if (prerendering) return;
    if (!this.location && !this.loading) this.$store.dispatch(FETCH_LOCATION);
  },

  computed: {
    ...mapState({
      location: "location",
      loading: "locationLoading",
      error: "locationError",
    }),
  },

  methods: {
    async unlock({ target }) {
      if (!this.locked) return; // no-op
      this.verifying = true;

      try {
        const segments = await LocationService.getRecentLocationHistory(
          this.code.trim()
        );
        target.blur();
        this.locked = false;

        const { map, setOpacity } = this.$refs.map;
        setOpacity(0.1);

        segments.forEach(({ coordinates, timeSpan: { begin } }) => {
          const id = uuidHash(begin);
          const difference = differenceInHours(new Date(), parse(begin));
          let opacity = (23 - difference) / 24;
          if (opacity < 0.1) opacity = 0.1;
          if (coordinates.length > 1)
            map.addLayer({
              id,
              type: "line",
              source: {
                type: "geojson",
                data: {
                  type: "Feature",
                  geometry: {
                    type: "LineString",
                    coordinates,
                  },
                },
              },
              layout: {
                "line-join": "round",
                "line-cap": "round",
              },
              paint: {
                "line-color": "#FF009B",
                "line-opacity": opacity,
                "line-width": 6,
              },
            });
        });

        const position = last(last(segments).coordinates);

        // Add 'current location' dot.
        map.addLayer({
          id: "current",
          type: "circle",
          source: {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: position,
              },
            },
          },
          paint: {
            "circle-radius": 6,
            "circle-color": "#3d00d6",
          },
        });

        map.addLayer({
          id: "current-radial",
          type: "circle",
          source: {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: position,
              },
            },
          },
          paint: {
            "circle-radius": 15,
            "circle-color": "#3d00d6",
            "circle-opacity": 0.3,
          },
        });

        map.flyTo({
          center: position,
          zoom: 15,
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
@import "@/styles/mixins.scss";

// prettier-ignore
.location {
  position: absolute;
  top: 0; right: 0; left: 0; bottom: 0;
}

// prettier-ignore
.map { flex: 1; }

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
    .input {
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
