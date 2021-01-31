<script>
  import { Pie, mixins } from 'vue-chartjs'
  const { reactiveProp } = mixins

  export default {
    mixins: [Pie, reactiveProp],
    props: ['chartData', 'options'],

    data: () => ({}),

    mounted() {
      this.renderChart(this.chartData, this.options)
    },
  }
</script>

<style lang="scss"></style>
