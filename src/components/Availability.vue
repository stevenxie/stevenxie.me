<template>
  <div class="availability flex" :class="{ busy: currentlyBusy }" ref="frame">
    <div
      class="timeline flex"
      :class="{ error }"
      :style="{ right: `${offset}px` }"
    >
      <div class="segments" :class="segmentClasses">
        <div
          class="busy"
          v-for="({ start, end }, i) in busy"
          :key="`${start.toString()}--${end.toString()}`"
          :style="busyRelativeStyles[i]"
        >
          <div class="container mono">
            <p class="start">{{ formatPretty(start) }}</p>
            <p class="end">{{ formatPretty(end) }}</p>
          </div>
        </div>
      </div>
      <div class="timebar flex" :style="{ left: `${currentTimeRelative}%` }">
        <div class="time mono" ref="timebar">
          {{ formatPretty(time) }}
        </div>
      </div>
    </div>
    <div class="status flex">
      <div class="error" v-if="error">
        <alert-icon :width="40" :height="40" />
        <p>Failed to load availability data.</p>
      </div>
      <div :class="{ busy: currentlyBusy }" v-else>
        <h2 class="text">
          I'm probably
          <b class="highlight" v-if="currentlyBusy">not free to do stuff</b>
          <b class="highlight" v-else>free to hang</b>
          right now.
          <b class="highlight" v-if="!currentlyBusy">hmu!</b>
        </h2>
        <h3 class="text small highlight" v-if="currentlyBusy">
          Check back later!
        </h3>
      </div>
    </div>
  </div>
</template>

<script>
import isEmpty from "lodash/isEmpty";
import first from "lodash/first";
import last from "lodash/last";
import format from "date-fns/format";
import getHours from "date-fns/get_hours";
import getMinutes from "date-fns/get_minutes";

import { prerendering } from "@/utils";
import { mapState } from "vuex";
import { FETCH_AVAILABILITY } from "@/store/actions";

import AlertIcon from "@/components/icons/AlertIcon";

/**
 * @param {Date} time
 * @returns {number} The percentage of day that this time represents.
 */
const percentOfDay = time =>
  Math.round(((getHours(time) * 60 + getMinutes(time)) * 100) / (24 * 60));

export default {
  data: () => ({
    time: new Date(),
    offset: 0,
  }),
  mounted() {
    if (prerendering) return;

    // Fetch availability from API.
    this.$store.dispatch(FETCH_AVAILABILITY);

    // Init timeline offset interval.
    this.updateTimelineOffset();
    const updateTime = () => (this.time = new Date());
    this.timeUpdateInterval = window.setInterval(updateTime, 1000);
    window.addEventListener("resize", this.updateTimelineOffset);
  },
  beforeDestroy() {
    window.clearInterval(this.timeUpdateInterval);
    window.removeEventListener("resize", this.updateTimelineOffset);
  },
  computed: {
    ...mapState({
      busy: ({ availability }) => availability.data,
      error: ({ availability }) => availability.error,
    }),

    busyRelative() {
      return this.busy.map(({ start, end }) => {
        [start, end] = [start, end].map(percentOfDay);
        if (start > 0 && end === 0) end = 100;
        return { start, end, diff: end - start };
      });
    },

    busyRelativeStyles() {
      return this.busyRelative.map(({ start, diff }) => ({
        left: `${start}%`,
        width: `${diff}%`,
      }));
    },

    segmentClasses() {
      const classes = [];
      if (isEmpty(this.busyRelative)) return classes;
      if (first(this.busyRelative).start === 0) classes.push("cap-start");
      if (last(this.busyRelative).end === 100) classes.push("cap-end");
      return classes;
    },

    // prettier-ignore
    currentTimeRelative() { return percentOfDay(this.time); },

    currentlyBusy() {
      const current = this.currentTimeRelative;
      for (let i = 0; i < this.busyRelative.length; i++) {
        const { start, end } = this.busyRelative[i];
        if (start <= current && current <= end) return true;
      }
      return false;
    },
  },
  methods: {
    /**
     * @param {Date} date The time to pretty-format.
     * @returns {string} The time string, in a 'pretty' 12h format.
     */
    formatPretty: date => format(date, "h:mm A"),

    // Updates the x-offset of the timeline in order to centre the current-time
    // bar in the viewport.
    updateTimelineOffset() {
      // Calculate frame center position.
      const { offsetWidth: frameWidth } = this.$refs.frame;
      const frameCenterX = frameWidth / 2;

      // Calculate timebar center position.
      const { timebar } = this.$refs;
      const { offsetWidth: width } = timebar;
      const posX = timebar.getBoundingClientRect().left;
      const centerX = posX + width / 2;

      // Set offset.
      this.offset = this.offset + centerX - frameCenterX;
    },
  },
  watch: {
    time() {
      this.updateTimelineOffset();
    },
  },
  components: { "alert-icon": AlertIcon },
};
</script>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";
$bradius: 8px;

.availability {
  position: relative;
  padding: 50px 0;
  justify-content: center;
  align-items: stretch;
  overflow: hidden;
  background: #1f292e;

  @include breakpoint(850px) {
    padding: 60px 0;
  }
}

.timeline {
  $min-width: 750px;
  $x-margin: 50px;

  height: 60px;
  min-width: $min-width;
  margin: 45px $x-margin 110px $x-margin;
  border-radius: $bradius;
  position: relative;

  background-image: linear-gradient(135deg, #4e8cf1 0%, #29d39b 100%);
  box-shadow: 0 5px 20px 0 rgba(black, 0.5);

  @include breakpoint($min-width + (2 * $x-margin)) {
    left: 0 !important;
  }

  @include breakpoint(laptop) {
    align-self: center;
    width: 1200px;
  }

  &.error {
    margin-bottom: 45px;

    $primary: #4e4e4e;
    $secondary: #646464;
    background: repeating-linear-gradient(
      45deg,
      $primary,
      $primary 10px,
      $secondary 10px,
      $secondary 20px
    );

    // prettier-ignore
    .timebar { visibility: hidden; }
  }
}

.segments {
  flex: 1;
  display: flex;
  align-items: stretch;
  position: relative;

  .busy {
    height: 100%;
    position: absolute;

    color: white;
    background: #4b5e6b;

    .container {
      $text-width: 70px;
      $y-offset: 25px;

      width: 100%;
      height: 100%;
      position: relative;
      font-size: 10pt;

      > * {
        position: absolute;
        text-align: center;
        width: $text-width;
      }

      .start {
        left: $text-width / -2;
        bottom: -$y-offset;
      }

      .end {
        right: $text-width / -2;
        top: -$y-offset;
      }
    }
  }

  // prettier-ignore
  &.cap-start .busy:first-child {
    border-radius: $bradius 0 0 $bradius;
    .start { display: none; }
  }

  // prettier-ignore
  &.cap-end .busy:last-child {
    border-radius: 0 $bradius $bradius 0;
    .end { display: none; }
  }
}

// prettier-ignore
.timebar {
  $h-ext: 45px;
  $width: 5px;

  position: absolute;
  top: 0; bottom: 0;
  width: $width;
  margin-left: -$width / 2;
  margin-bottom: -$h-ext;
  margin-top: -$h-ext;
  border-radius: 1px;

  justify-content: flex-end;
  align-items: stretch;

  color: white;
  background: white;
  box-shadow: 0 2px 5px 0 rgba(black, 0.5);

  // prettier-ignore
  &.error { display: none !important; }

  .time {
    $twidth: 90px;

    position: relative;
    top: 34px;
    right: ($twidth / 2) - ($width / 2);
    width: $twidth;
    text-align: center;

    font-size: 13pt;
    font-weight: 700;
  }
}

.status {
  margin-top: 6px;
  padding: 0 35px;
  align-items: center;

  .text {
    font-size: 17pt;
    font-weight: 500;
    color: #c3dff0;

    &.small {
      margin-top: 20px;
      font-size: 13pt;
      font-weight: 600;
    }
  }

  // prettier-ignore
  .highlight { color: white; }

  // prettier-ignore
  .busy {
    .text { color: #92b2c4; }
    .highlight { color: #c3dff0; }
  }

  .error::v-deep {
    $color: rgb(160, 160, 160);

    display: flex;
    align-items: center;

    font-size: 13pt;
    font-weight: 500;
    color: $color;

    // prettier-ignore
    .alert-icon {
      margin-right: 5px !important;
      path { stroke: $color; }
    }
  }
}
</style>
