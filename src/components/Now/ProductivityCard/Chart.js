import { Doughnut, mixins } from "vue-chartjs";

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

export default Chart;
