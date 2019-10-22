<template>
  <card
    class="productivity"
    title="Productivity Pulse"
    titleURL="https://help.rescuetime.com/article/73-how-is-my-productivity-pulse-calculated"
    label="RescueTime"
    labelURL="https://www.rescuetime.com/"
    :error="errorMsg"
  >
    <div class="container fullsize">
      <div class="ring outer fullsize">
        <div class="ring inner background flex">
          <h1
            class="score mono"
            :class="{ full: score === 100 }"
            v-if="score !== null"
          >
            {{ score }}
          </h1>
          <p class="no-data mono" v-else>(no data)</p>
        </div>
        <chart class="chart" :chartData="chartData" />
        <div class="ring inner shadow" />
        <div class="ring shadow" />
      </div>
    </div>
  </card>
</template>

<script>
import gql from "graphql-tag";
import kebabCase from "lodash/kebabCase";
import isEmpty from "lodash/isEmpty";
import { prerendering } from "@/utils/prerender";

import Card from "../Card";
const Chart = () =>
  import(/* webpackChunkName: "productivity-chart" */ "./Chart");

export default {
  data: () => ({
    records: null,
    score: null,
    error: null,
    colors: {
      "1": "#e84366",
      "2": "#fc819b",
      "3": "#bdbdbd",
      "4": "#738ee6",
      "5": "#4a66c3",
    },
  }),

  apollo: {
    // prettier-ignore
    productivity: {
      query: gql`
        {
          productivity {
            records {
              category { id, name }
              duration
            }
            score
          }
        }
      `,
      skip: prerendering,
      manual: true,
      result({ data }) {
        if (!data) return;
        const { records, score } = data.productivity;
        this.records = records;
        this.score = score;
        this.error = null;
      },
      error(err) { this.error = err; },
    }
  },

  computed: {
    chartData() {
      // Return early if no records.
      const { records } = this;
      if (isEmpty(records)) return { datasets: [] };

      // Construct dataset.
      const mapColors = ({ category }) => this.colors[category.id.toString()];
      const dataset = {
        data: records.map(({ duration }) => duration),
        backgroundColor: records.map(mapColors),
        borderWidth: 0,
      };
      return {
        labels: records.map(({ category }) => category.name),
        datasets: [dataset],
      };
    },
    errorMsg() {
      return this.error && "Failed to load productivity data.";
    },
  },
  methods: { kebabCase },
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

    &.background {
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: white;

      .score {
        font-size: 52pt;
        font-weight: 700;
        color: #4d4d4d;

        &.full { font-size: 42pt; }
      }

      .no-data {
        text-align: center;
        font-weight: 500;
        color: #464646;
      }
    }

    &.shadow { box-shadow: 0 0 5px 0 rgba(black, 0.5); }
  }
}

// prettier-ignore
.chart {
  position: absolute;
  top: 0; right: 0; left: 0; bottom: 0;
}
</style>
