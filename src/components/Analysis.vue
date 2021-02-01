<template>
  <v-container>
    <v-col>
      <v-card color="grey lighten-3">
        <LineChart :chartData="graphs.first.data" :options="graphs.first.options" />
      </v-card>
    </v-col>

    <v-col>
      <v-card color="grey lighten-3">
        <PieChart :chartData="graphs.second.data" :options="graphs.second.options" />
      </v-card>
    </v-col>

    <v-col>
      <v-card color="grey lighten-3">
        <PieChart :chartData="graphs.third.data" :options="graphs.third.options" />
      </v-card>
    </v-col>

    <v-col>
      <v-card color="grey lighten-3">
        <PieChart :chartData="graphs.fourth.data" :options="graphs.fourth.options" />
      </v-card>
    </v-col>
  </v-container>
</template>

<script>
  import { mapState } from 'vuex'
  import PieChart from '@/components/charts/PieChart.vue'
  import LineChart from '@/components/charts/LineChart.vue'

  export default {
    components: {
      PieChart,
      LineChart,
    },

    async beforeCreate() {
      await Promise.all([this.$store.dispatch('gasto/get')])
    },

    async mounted() {
      // shuffle colors
      this.colors.shuffle()
    },

    data: () => ({
      graphs: {
        first: {
          data: {
            labels: [],
            datasets: [
              {
                data: [],
              },
            ],
          },
          options: {},
        },
        second: {
          data: {
            labels: [],
            datasets: [
              {
                data: [],
              },
            ],
          },
          options: {},
        },
        third: {
          data: {
            labels: [],
            datasets: [
              {
                data: [],
              },
            ],
          },
          options: {},
        },
        fourth: {
          data: {
            labels: [],
            datasets: [
              {
                data: [],
              },
            ],
          },
          options: {},
        },
      },
      colors: [
        // colors taken from https://davidmathlogic.com/colorblind/
        // Tol
        '#332288',
        '#117733',
        '#44AA99',
        '#88CCEE',
        '#DDCC77',
        '#CC6677',
        '#AA4499',
        '#882255',
        // Wong
        //'#1C90B6',
        //'#E6F144',
        '#E69F00',
        //'#56B4E9',
        //'#009E73',
        //'#F0E442',
        //'#0072B2',
        '#D55E00',
        '#CC79A7',
      ],
    }),

    methods: {
      parseGastos(gastos) {
        // empty base
        let first = {
          datasets: [],
        }
        let second = {
          labels: [],
          data: [],
        }
        let third = {
          labels: [],
          data: [],
        }
        let fourth = {
          labels: [],
          data: [],
        }

        // default options
        let options = {
          legend: {
            position: 'right',
          },
          tooltips: {
            intersect: false,
            callbacks: {
              label: function(tooltipItems, data) {
                let sum = data.datasets[tooltipItems.datasetIndex].data.reduce(
                  (acc, cur) => acc + cur
                )
                let value = data.datasets[tooltipItems.datasetIndex].data[
                  tooltipItems.index
                ].toFixed(0)
                let percentage = ((value * 100) / sum).toFixed(0) + '%'
                let name = data.labels[tooltipItems.index]
                return ` ${name}: R$ ${value} (${percentage})`
              },
            },
          },
        }

        // iterate over the data
        gastos.forEach(gasto => {
          // parse for the first graph
          let firstIndex = first.datasets.findIndex(dataset => dataset.label === gasto.tipo)
          if (firstIndex === -1) {
            first.datasets.push({
              label: gasto.tipo,
              data: [null, null, null, null, null, null, null, null, null, null, null, null],
            })
            firstIndex = first.datasets.length - 1
          }
          first.datasets[firstIndex].data[gasto.data.mes] =
            first.datasets[firstIndex].data[gasto.data.mes] || 0
          first.datasets[firstIndex].data[gasto.data.mes] += parseFloat(gasto.valor)

          // ignore tipo='Renda' for graphs 2,3,4
          if (gasto.tipo === 'Renda') {
            return
          }

          // parse for the second graph
          let secondIndex = second.labels.indexOf(gasto.categoria.nome)
          if (secondIndex === -1) {
            second.labels.push(gasto.categoria.nome)
            second.data.push(0)
            secondIndex = second.labels.length - 1
          }
          second.data[secondIndex] += parseFloat(gasto.valor)

          // parse for the third graph
          let thirdIndex = third.labels.indexOf(gasto.modo_de_pagamento.nome)
          if (thirdIndex === -1) {
            third.labels.push(gasto.modo_de_pagamento.nome)
            third.data.push(0)
            thirdIndex = third.labels.length - 1
          }
          third.data[thirdIndex] += parseFloat(gasto.valor)

          // parse for the fourth graph
          let fourthIndex = fourth.labels.indexOf(gasto.tipo)
          if (fourthIndex === -1) {
            fourth.labels.push(gasto.tipo)
            fourth.data.push(0)
            fourthIndex = fourth.labels.length - 1
          }
          fourth.data[fourthIndex] += parseFloat(gasto.valor)
        })

        // set first graph
        this.graphs.first = {
          data: {
            labels: [
              'Jan',
              'Fev',
              'Mar',
              'Abr',
              'Mai',
              'Jun',
              'Jul',
              'Ago',
              'Set',
              'Out',
              'Nov',
              'Dez',
            ],
            datasets: first.datasets.map((dataset, i) => {
              return Object.assign(
                {
                  //borderWidth: 0,
                  backgroundColor: this.colors[i],
                  borderColor: this.colors[i],
                  fill: false,
                  pointRadius: 0,
                },
                dataset
              )
            }),
          },
          options: {
            tooltips: {
              intersect: false,
              mode: 'index',

              callbacks: {
                label: function(tooltipItems, data) {
                  let value = data.datasets[tooltipItems.datasetIndex].data[
                    tooltipItems.index
                  ].toFixed(0)
                  let name = data.datasets[tooltipItems.datasetIndex].label
                  return ` ${name}: R$ ${value}`
                },
              },
            },
          },
        }

        // set second graph
        this.graphs.second = {
          data: {
            labels: second.labels,
            datasets: [
              {
                label: 'Modo de pagamento',
                data: second.data,
                borderWidth: 0,
                backgroundColor: this.colors,
              },
            ],
          },
          options: options,
        }

        // set third graph
        this.graphs.third = {
          data: {
            labels: third.labels,
            datasets: [
              {
                label: 'Categoria',
                data: third.data,
                borderWidth: 0,
                backgroundColor: this.colors,
              },
            ],
          },
          options: options,
        }

        // set fourth graph
        this.graphs.fourth = {
          data: {
            labels: fourth.labels,
            datasets: [
              {
                label: 'Tipo',
                data: fourth.data,
                borderWidth: 0,
                backgroundColor: this.colors,
              },
            ],
          },
          options: options,
        }
      },
    },

    watch: {
      gastos(newValue) {
        this.parseGastos(newValue)
      },
    },

    computed: {
      ...mapState({
        gastos: state => state.gasto.gastos,
      }),
    },
  }
</script>

<style scoped lang="scss"></style>
