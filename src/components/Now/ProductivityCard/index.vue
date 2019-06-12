<template>
  <card
    class="productivity"
    title="Productivity Pulse"
    titleURL="https://help.rescuetime.com/article/73-how-is-my-productivity-pulse-calculated"
    label="RescueTime"
    labelURL="https://www.rescuetime.com/"
    :error="errorMessage"
  >
    <div class="container fullsize">
      <div class="ring outer fullsize">
        <div class="ring inner background flex">
          <h1 class="score mono">{{ score }}</h1>
        </div>
        <chart class="chart" :chartData="chartData" />
        <div class="ring inner shadow" />
        <div class="ring shadow" />
      </div>
    </div>
  </card>
</template>

<script>
import kebabCase from "lodash/kebabCase";
import isEmpty from "lodash/isEmpty";
import Card from "../Card";

import { prerendering } from "@/utils";
import { mapState } from "vuex";
import { FETCH_PRODUCTIVITY } from "@/store/actions";

const Chart = () =>
  import(/* webpackChunkName: "productivity-chart" */ "./Chart");

export default {
  data: () => ({
    colormap: {
      "2": "#4a66c3",
      "1": "#738ee6",
      "0": "#bdbdbd",
      "-1": "#fc819b",
      "-2": "#e84366",
    },
  }),
  mounted() {
    if (prerendering) return;
    this.$store.dispatch(FETCH_PRODUCTIVITY);
  },
  computed: {
    ...mapState({
      segments: "productivity",
      loading: "productivityLoading",
      error: "productivityError",
    }),

    score() {
      if (isEmpty(this.segments)) return null;

      // Noramlize segments into values keyed by name initials.
      const segs = {};
      this.segments.forEach(({ name, duration }) => {
        const initials = name
          .split(" ")
          .map(substr => substr[0].toLowerCase())
          .join("");
        segs[initials] = duration;
      });

      // Calculation derived from:
      // https://help.rescuetime.com/article/73-how-is-my-productivity-pulse-calculated
      const { d = 0, n = 0, p = 0, vp = 0 } = segs;
      const total = this.segments.reduce(
        (sum, { duration }) => sum + duration,
        0
      );
      return Math.round(((d + n * 2 + p * 3 + vp * 4) / (total * 4)) * 100);
    },

    chartData() {
      if (isEmpty(this.segments)) return { datasets: [] };
      const labels = this.segments.map(({ name }) => name);
      const mapColors = ({ id }) => this.colormap[id.toString()];
      const dataset = {
        data: this.segments.map(({ duration }) => duration),
        backgroundColor: this.segments.map(mapColors),
        borderWidth: 0,
      };
      return { labels, datasets: [dataset] };
    },

    errorMessage() {
      return this.error && "Failed to load productivity data.";
    },
  },
  methods: { kebabCase },
  components: { card: Card, chart: Chart },
};
</script>

<style lang="scss" scoped>
.fullsize {
  width: 100%;
  height: 100%;
}

.container {
  padding: 10px;
  box-sizing: border-box;
}

.ring {
  $size: 30px;

  &.outer {
    border-radius: 50%;
    position: relative;
    background: #bdbdbd;
  }

  // prettier-ignore
  &.shadow {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    border-radius: 50%;
    box-shadow: inset 0 0 5px 0 rgba(black, 0.5);
    pointer-events: none;
  }

  // prettier-ignore
  &.inner {
    position: absolute;
    top: $size; left: $size; right: $size; bottom: $size;
    border-radius: 50%;

    &.background {
      align-items: center;
      justify-content: center;
      background: white;
    }
    &.shadow { box-shadow: 0 0 5px 0 rgba(black, 0.5); }
  }
}

// prettier-ignore
.chart {
  position: absolute;
  top: 0; right: 0; left: 0; bottom: 0;
}

.score {
  font-size: 52pt;
  font-weight: 700;
  color: #4d4d4d;
}
</style>
