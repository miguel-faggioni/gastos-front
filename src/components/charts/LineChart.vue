<script>
  import { Line, mixins } from 'vue-chartjs'
  const { reactiveProp } = mixins

  export default {
    mixins: [Line, reactiveProp],
    props: ['chartData', 'options'],

    data: () => ({}),

    mounted() {
      this.renderChart(this.chartData, this.options)
    },
  }
</script>

<style lang="scss"></style>
