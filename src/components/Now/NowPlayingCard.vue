<template>
  <card class="now-playing" v-bind="headers">
    <div
      class="artwork fullsize"
      :style="{ backgroundImage: `url(${artURL})` }"
    >
      <div class="overlay flex fullsize" :class="{ darker: !progress }">
        <div class="progress flex" v-if="track">
          <div class="slider" :style="{ width: `${progressPercent}%` }">
            <div class="knob" />
          </div>
          <div class="time-slider" :style="{ width: `${timePercent}%` }">
            <div class="time">{{ progressTime }}</div>
          </div>
        </div>
        <p class="no-music" v-else>
          Nothing is playing right now.
        </p>
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
import blankrecord from "@/assets/blankrecord.png";
import { prerendering } from "@/utils";

import { mapState, mapGetters } from "vuex";
import { FETCH_NOW_PLAYING } from "@/store/actions";
import {
  NOW_PLAYING,
  NOW_PLAYING_TRACK,
  NOW_PLAYING_PROGRESS,
} from "@/store/getters";

import Card from "./Card";

export default {
  mounted() {
    if (prerendering) return; // do not fetch during prerender
    this.fetchInterval = window.setInterval(
      () => this.$store.dispatch(FETCH_NOW_PLAYING),
      1000
    );
  },
  beforeDestroy() {
    window.clearInterval(this.fetchInterval);
  },
  computed: {
    ...mapState({ error: "nowPlayingError" }),
    ...mapGetters({
      track: NOW_PLAYING_TRACK,
      playing: NOW_PLAYING,
      progress: NOW_PLAYING_PROGRESS,
    }),

    /** @returns {{ title: string, label: string }} */
    headers() {
      if (!this.track) return { title: "Silence", label: "Now Playing" };
      const { name, url, artists } = this.track;
      const [artist] = artists;
      return {
        title: name,
        titleURL: url,
        label: artist.name,
        labelURL: artist.url,
      };
    },

    /** @returns {string} */
    artURL() {
      if (!this.track) return blankrecord;
      const [image] = this.track.album.images;
      return image.url;
    },

    /** @returns {number} */
    progressPercent() {
      if (!this.track) return 0;
      return Math.round((this.progress / this.track.duration) * 100);
    },

    /** @returns {string} */
    progressTime() {
      if (!this.progress) return "0:00";
      const progressSeconds = this.progress / 1000;
      const left = Math.round(progressSeconds / 60);
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
  height: 3px;
  border-radius: 2px;
  align-items: stretch;
  background-image: linear-gradient(90deg, #e5706a 1%, #e3a2fd 100%);

  .slider,
  .time-slider {
    position: relative;
    transition: width 250ms ease-in-out;
  }

  .slider {
    // prettier-ignore
    .knob {
      $radius: 6px;

      position: absolute;
      bottom: -$radius; right: -$radius;
      width: 2 * $radius;
      height: 2 * $radius;
      border-radius: $radius;

      background: white;
      box-shadow: 0 0 4px 0 rgba(black, 0.6)
    }
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
