<template>
  <card class="music" v-bind="headers">
    <div class="content fullsize">
      <progressive-img
        class="artwork fullsize"
        :src="artworkURL"
        :placeholder="artworkPlaceholderURL"
        :key="artworkURL"
        alt="Artwork"
      />
      <div class="overlay flex fullsize">
        <div class="progress flex" v-if="track">
          <div class="slider" :style="{ width: `${progressPercent}%` }">
            <div class="knob" />
          </div>
          <div class="time-slider" :style="{ width: `${timePercent}%` }">
            <div class="time">{{ progressTime }}</div>
          </div>
        </div>
        <p class="no-music" v-else>Nothing is playing right now.</p>
        <div class="status">
          <i class="icofont-stop" v-if="!track" />
          <i class="icofont-ui-play" v-else-if="playing" />
          <i class="icofont-ui-pause" v-else />
        </div>
      </div>
    </div>
  </card>
</template>

<script>
import gql from "graphql-tag";
import blankrecord from "@/assets/blankrecord.png";

import Card from "./Card";
import { prerendering } from "../../utils/prerender";

export default {
  data: () => ({
    track: null,
    playing: false,
    progress: 0,
    error: null,
  }),

  created() {
    this.closeErrorListener = this.$apollo.provider.defaultClient.wsClient.on(
      "error",
      err => (this.error = err)
    );
  },

  // prettier-ignore
  beforeDestroy() { this.closeErrorListener() },

  apollo: {
    $subscribe: {
      music: {
        // prettier-ignore
        query: gql`
          subscription {
            music {
              playing
              progress
              track {
                name,
                externalURL,
                duration
                artists { name, externalURL }
                album { images { url } }
              }
            }
          }
        `,
        skip: prerendering,
        result({ data }) {
          if (!data.music) {
            this.track = null;
            return;
          }

          const { track, playing, progress } = data.music;
          this.track = track;
          this.playing = playing;
          this.progress = progress;
        },
        error(err) {
          this.error = err;
        },
      },
    },
  },

  computed: {
    /** @returns {{ title: string, label: string }} */
    headers() {
      const { error, track } = this;
      const headers = {
        error: error && "Failed to load currently playing track.",
      };
      if (this.track) {
        const { name, externalURL, artists } = track;
        const [artist] = artists;
        headers.title = name;
        headers.titleURL = externalURL;
        headers.label = artist.name;
        headers.labelURL = artist.externalURL;
      } else {
        headers.title = "Silence";
        headers.label = "Now Playing";
      }
      return headers;
    },

    /** @returns {string} */
    artworkURL() {
      if (!this.track) return blankrecord;
      const [large, med] = this.track.album.images;
      if (med) return med.url;
      return large.url;
    },

    /** @returns {string} */
    artworkPlaceholderURL() {
      if (!this.track) return "";
      const [large, med, small] = this.track.album.images;
      if (small) return small.url;
      if (med) return med.url;
      return large.url;
    },

    /** @returns {number} */
    progressPercent() {
      const { progress, track } = this;
      if (!track) return 0;
      return Math.round((progress / track.duration) * 100);
    },

    /** @returns {string} */
    progressTime() {
      if (!this.progress) return "0:00";
      const progressSeconds = this.progress / 1000;
      const left = Math.floor(progressSeconds / 60);
      const right = Math.round(progressSeconds % 60);
      return `${left}:${right.toString().padStart(2, "0")}`;
    },

    /** @returns {number} */
    timePercent() {
      const pp = this.progressPercent;
      if (pp > 90) return 90;
      if (pp < 10) return 10;
      return pp;
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

.artwork {
  position: absolute;
  z-index: 0;
  background-color: rgb(170, 170, 170);
  background-size: cover;
}

.overlay {
  padding: 12px;
  box-sizing: border-box;
  justify-content: center;
  align-items: stretch;
  position: relative;

  color: white;
  background: rgba(black, 0.45);

  // prettier-ignore
  &.darker { background: rgba(black, 0.7); }
}

.no-music {
  width: 150px;
  text-align: center;
  align-self: center;
  font-size: 13pt;
}

.status {
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.progress {
  $progress-height: 3px;
  $knob-radius: 6px;

  height: $progress-height;
  border-radius: 2px;
  align-items: stretch;
  background-image: linear-gradient(90deg, #e5706a 1%, #e3a2fd 100%);

  .slider,
  .time-slider {
    position: relative;
    transition: width 250ms ease-in-out;
  }

  // prettier-ignore
  .slider .knob {
      $offset: -$knob-radius - ($progress-height / 2);

      position: absolute;
      bottom: $offset; right: $offset;
      width: 2 * $knob-radius;
      height: 2 * $knob-radius;
      border-radius: $knob-radius;

      background: white;
      box-shadow: 0 0 4px 0 rgba(black, 0.6)
    }

  .time-slider {
    font-weight: 500;

    // prettier-ignore
    .time {
      $width: 64px;

      position: absolute;
      top: 10px; right: -($width/ 2);
      width: $width;
      text-align: center;
    }
  }
}
</style>
