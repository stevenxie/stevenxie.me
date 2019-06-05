<template>
  <div class="availability flex" ref="frame">
    <div class="timeline flex" :style="{ right: `${offset}px` }">
      <div class="segments">
        <div
          class="busy"
          v-for="(busy, i) in busyPeriods"
          :key="ohash(busy)"
          :style="busyRelativeStyles[i]"
        >
          <div class="container mono">
            <p class="start">{{ formatTime(busy.start) }}</p>
            <p class="end">{{ formatTime(busy.end) }}</p>
          </div>
        </div>
      </div>
      <div class="timebar flex" :style="{ left: `${currentTimeRelative}%` }">
        <div class="time mono" ref="timebar">{{ currentTime }}</div>
      </div>
    </div>
    <div class="status flex">
      <div>
        <h2 class="text">
          I'm probably
          <b v-if="currentlyBusy" class="not-free">not free to do stuff</b>
          <b v-else>free to hang</b>
          right now.
          <b v-if="!currentlyBusy">hmu!</b>
        </h2>
        <h3 class="text small not-free" v-if="currentlyBusy">
          Check back later!
        </h3>
      </div>
    </div>
  </div>
</template>

<script>
import * as yup from "yup";
import ohash from "object-hash";
import { format, getHours, getMinutes } from "date-fns";
import { period } from "@/schemas/availability";

/**
 * @param {number} hours
 * @param {number} mins
 * @returns {number} The percentage of day that this time represents.
 */
const percentOfDay = (hours, mins) =>
  Math.round(((hours * 60 + mins) * 100) / (24 * 60));

export default {
  data: () => ({
    busyPeriods: [],
    time: new Date(),
    offset: 0,
  }),
  async created() {
    try {
      const { data } = await this.$apic.getAvailability();
      const { busy } = data;
      yup
        .array()
        .of(period)
        .validateSync(busy);
      this.busyPeriods = this.correctLastPeriod(busy);
    } catch (err) {
      console.error(err);
    }
  },
  mounted() {
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
    busyRelative() {
      return this.busyPeriods.map(({ start, end }) => {
        [start, end] = [start, end].map(str => {
          const [hours, mins] = str.split(":").map(bit => parseInt(bit));
          return percentOfDay(hours, mins);
        });
        return { start, end, diff: end - start };
      });
    },
    busyRelativeStyles() {
      return this.busyRelative.map(({ start, diff }) => ({
        left: `${start}%`,
        width: `${diff}%`,
      }));
    },
    currentTime() {
      return format(this.time, "h:mm A");
    },
    currentTimeRelative() {
      const hours = getHours(this.time);
      const mins = getMinutes(this.time);
      return percentOfDay(hours, mins);
    },
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
    ohash,

    /**
     * @param {string} military The time, in military (24h) format.
     * @returns {string} The time, in 12h format.
     */
    formatTime(military) {
      let [hour, minute] = military.split(":");
      const nhour = parseInt(hour);
      hour = nhour % 12;
      return `${hour}:${minute} ${nhour > 12 ? "PM" : "AM"}`;
    },

    /**
     * @param {Array} periods An array of time periods.
     * @returns {Array} An array of time periods, with the last one corrected.
     */
    correctLastPeriod(periods) {
      const { start, end } = periods.pop();
      if (end === "00:00") periods.push({ start, end: "24:00" });
      return periods;
    },

    // Updates the x-offset of the timeline in order to centre the current-time
    // bar in the viewport.
    updateTimelineOffset() {
      // Calculate frame center position.
      const { offsetWidth: frameWidth } = this.$refs.frame;
      const frameCenterX = frameWidth / 2;

      // Calculate timebar center position.
      const timebar = this.$refs.timebar;
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
};
</script>

<style lang="scss" scoped>
$bradius: 8px;

.availability {
  padding: 40px 0;
  justify-content: center;
  align-items: stretch;
  overflow: hidden;
  background: #1f292e;
}

.timeline {
  margin: 45px 50px 110px 50px;
  min-width: 750px;
  height: 60px;
  border-radius: $bradius;
  position: relative;

  background-image: linear-gradient(135deg, #4e8cf1 0%, #29d39b 100%);
  box-shadow: 0 5px 20px 0 rgba(black, 0.5);
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

    // prettier-ignore
    &:first-child {
      border-radius: $bradius 0 0 $bradius;
      .start { display: none; }
    }

    // prettier-ignore
    &:last-child {
      border-radius: 0 $bradius $bradius 0;
      .end { display: none; }
    }
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
  padding: 0 35px;
  align-items: center;

  .text {
    font-size: 17pt;
    font-weight: 500;
    color: white;

    &.small {
      margin-top: 14px;
      font-size: 13pt;
      font-weight: 600;
    }
  }

  // prettier-ignore
  .not-free { color: #92b2c4; }
}
</style>
