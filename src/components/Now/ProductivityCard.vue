<template>
  <card
    class="productivity"
    title="Productivity Pulse"
    titleURL="https://help.rescuetime.com/article/73-how-is-my-productivity-pulse-calculated"
    label="RescueTime"
    labelURL="https://www.rescuetime.com/"
  >
    <div class="container fullsize">
      <div class="ring outer fullsize">
        <div class="ring inner bg" />
        <chart class="chart" :chartData="chartData" />
        <div class="ring shadow" />
        <div class="ring inner fg flex center-children">
          <h1 class="score mono">{{ score }}</h1>
        </div>
      </div>
    </div>
  </card>
</template>

<script>
import * as yup from "yup";
import { Doughnut, mixins } from "vue-chartjs";
import { kebabCase, isEmpty } from "lodash";

import Card from "./Card";
import { segment } from "@/schemas/productivity";

const Chart = {
  extends: Doughnut,
  mixins: [mixins.reactiveProp],
  data: () => ({
    options: {
      legend: { display: false },
      responsive: true,
      cutoutPercentage: 70,
      tooltips: {
        callbacks: {
          label: (item, data) => " " + data.labels[item.index],
        },
      },
    },
  }),
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};

export default {
  props: {
    segments: {
      type: Array,
      default: () => [],
      validator: val =>
        yup
          .array()
          .of(segment)
          .isValidSync(val, { strict: true }),
    },
  },
  data: () => ({
    colormap: {
      "2": "#4a66c3",
      "1": "#738ee6",
      "0": "#bdbdbd",
      "-1": "#fc819b",
      "-2": "#e84366",
    },
  }),
  computed: {
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
      if (isEmpty(this.segments)) return {};
      const mapColors = ({ id }) => this.colormap[id.toString()];
      const labels = this.segments.map(({ name }) => name);
      const dataset = {
        data: this.segments.map(({ duration }) => duration),
        backgroundColor: this.segments.map(mapColors),
        borderWidth: 0,
      };
      return { labels, datasets: [dataset] };
    },
  },
  methods: {
    kebabCase,
  },
  components: {
    card: Card,
    chart: Chart,
  },
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

    &.bg {
      background: white;
      z-index: 0;
    }
    &.fg {
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 5px 0 rgba(black, 0.5);
    }
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
