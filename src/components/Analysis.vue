<template>
  <v-container class="ma-0 pt-5 d-flex justify-space-around full-width">
    <!-- desktop layout -->
    <v-row class="d-none d-lg-flex">
      <v-col cols="12">
        <v-card color="grey lighten-3">
          <v-row>
            <v-col class="d-flex justify-center">
              <v-btn icon class="toggle-button" @click="hideValues = !hideValues">
                <v-icon>{{ hideValues ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
              </v-btn>
            </v-col>

            <v-col v-for="tipo in Object.keys(sums)" :key="tipo">
              {{ tipo }}: R$ {{ sums[tipo].toFixed(2) | formatCurrency(hideValues) }}
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="5" class="pr-0">
        <v-card color="grey lighten-3">
          <TableChart
            :chartData="gastos"
            :hideValues="hideValues"
            backgroundColor="grey lighten-3"
          />
        </v-card>

        <v-row class="pt-3">
          <v-col cols="6" class="pr-2">
            <v-card color="grey lighten-3">
              <PieChart
                :height="200"
                :chartData="graphs.fourth.data"
                :options="graphs.fourth.options"
              />
            </v-card>
          </v-col>

          <v-col cols="6" class="pl-2">
            <v-card color="grey lighten-3">
              <PieChart
                :height="200"
                :chartData="graphs.third.data"
                :options="graphs.third.options"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="7">
        <v-row>
          <v-col cols="12">
            <v-card color="grey lighten-3">
              <!-- this value (147) was hand adjusted to match the heights of both columns -->
              <LineChart
                :height="147"
                :chartData="graphs.first.data"
                :options="graphs.first.options"
              />
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-card color="grey lighten-3">
              <PieChart
                :height="150"
                :chartData="graphs.second.data"
                :options="graphs.second.options"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- tablet layout -->
    <v-row class="d-none d-sm-flex d-md-none">
      <v-col cols="12">
        <v-card color="grey lighten-3">
          <v-row>
            <v-col class="d-flex justify-center" cols="2">
              <v-btn icon class="toggle-button" @click="hideValues = !hideValues">
                <v-icon>{{ hideValues ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
              </v-btn>
            </v-col>

            <v-col v-for="tipo in Object.keys(sums)" :key="tipo">
              {{ tipo }}: R$ {{ sums[tipo].toFixed(2) | formatCurrency(hideValues) }}
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-row>
          <v-col cols="12">
            <v-card color="grey lighten-3">
              <LineChart
                :height="200"
                :chartData="graphs.first.data"
                :options="graphs.first.options"
              />
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-card color="grey lighten-3">
              <PieChart
                :height="150"
                :chartData="graphs.second.data"
                :options="graphs.second.options"
              />
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="6" class="pr-2">
            <v-card color="grey lighten-3">
              <PieChart
                :height="200"
                :chartData="graphs.fourth.data"
                :options="graphs.fourth.options"
              />
            </v-card>
          </v-col>

          <v-col cols="6" class="pl-2">
            <v-card color="grey lighten-3">
              <PieChart
                :height="200"
                :chartData="graphs.third.data"
                :options="graphs.third.options"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col class="max-width pt-0" cols="12">
        <v-card color="grey lighten-3">
          <TableChart
            :chartData="gastos"
            :hideValues="hideValues"
            backgroundColor="grey lighten-3"
          />
        </v-card>
      </v-col>
    </v-row>

    <!-- mobile layout -->
    <v-row class="d-flex d-sm-none">
      <v-col cols="12">
        <v-card color="grey lighten-3 px-4">
          <v-row>
            <v-col class="d-flex justify-center">
              <v-btn icon class="toggle-button" @click="hideValues = !hideValues">
                <v-icon>{{ hideValues ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row v-for="tipo in Object.keys(sums)" :key="tipo">
            <v-col class="d-flex justify-space-between">
              <div class="d-inline">{{ tipo }}:</div>
              <div class="d-inline">
                R$ {{ sums[tipo].toFixed(2) | formatCurrency(hideValues) }}
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card color="grey lighten-3">
          <LineChart
            :height="300"
            :width="300"
            :chartData="graphs.first.data"
            :options="graphs.first.options"
          />
        </v-card>
      </v-col>

      <v-col class="pt-0">
        <v-card color="grey lighten-3">
          <PieChart
            :height="200"
            :width="250"
            :chartData="graphs.second.data"
            :options="graphs.second.options"
          />
        </v-card>
      </v-col>

      <v-col class="pt-0" cols="12">
        <v-row>
          <v-col cols="6" class="pr-2">
            <v-card color="grey lighten-3">
              <PieChart
                :height="150"
                :width="150"
                :chartData="graphs.third.data"
                :options="Object.assign({}, graphs.third.options, { legend: { position: 'top' } })"
              />
            </v-card>
          </v-col>

          <v-col cols="6" class="pl-2">
            <v-card color="grey lighten-3">
              <PieChart
                :height="150"
                :width="150"
                :chartData="graphs.fourth.data"
                :options="Object.assign({}, graphs.fourth.options, { legend: { position: 'top' } })"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col class="max-width pt-0" cols="12">
        <v-card color="grey lighten-3">
          <TableChart
            :chartData="gastos"
            :hideValues="hideValues"
            backgroundColor="grey lighten-3"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapState } from 'vuex'
  import PieChart from '@/components/charts/PieChart.vue'
  import LineChart from '@/components/charts/LineChart.vue'
  import TableChart from '@/components/charts/TableChart.vue'

  export default {
    components: {
      PieChart,
      LineChart,
      TableChart,
    },

    async beforeCreate() {
      await Promise.all([this.$store.dispatch('gasto/get')])
    },

    async mounted() {
      // shuffle colors
      this.colors.shuffle()
    },

    data: () => ({
      hideValues: false,
      sums: {},
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
      lineTooltipCallback(tooltipItems, data) {
        let value = data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index].toFixed(0)
        let name = data.datasets[tooltipItems.datasetIndex].label
        let valueToShow = this.$options.filters.formatCurrency(value, this.hideValues)
        return ` ${name}: R$ ${valueToShow}`
      },

      pieTooltipCallback(tooltipItems, data) {
        let sum = data.datasets[tooltipItems.datasetIndex].data.reduce((acc, cur) => acc + cur)
        let value = data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index].toFixed(0)
        let percentage = ((value * 100) / sum).toFixed(0) + '%'
        let name = data.labels[tooltipItems.index]
        let valueToShow = this.$options.filters.formatCurrency(value, this.hideValues)
        return ` ${name}: R$ ${valueToShow} (${percentage})`
      },

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
              label: this.pieTooltipCallback,
            },
          },
        }

        // iterate over the data
        gastos.forEach(gasto => {
          // parse for the first graph
          // split by date
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

          // parse for the sum of values
          if (Object.keys(this.sums).indexOf(gasto.tipo)) {
            this.sums[gasto.tipo] = 0
          }
          this.sums[gasto.tipo] += parseFloat(gasto.valor)

          // ignore tipo='Renda' for graphs 2,3,4
          if (gasto.tipo === 'Renda') {
            return
          }

          // parse for the second graph
          // split by categoria
          let secondIndex = second.labels.indexOf(gasto.categoria.nome)
          if (secondIndex === -1) {
            second.labels.push(gasto.categoria.nome)
            second.data.push(0)
            secondIndex = second.labels.length - 1
          }
          second.data[secondIndex] += parseFloat(gasto.valor)

          // parse for the third graph
          // split by modo_de_pagamento
          let thirdIndex = third.labels.indexOf(gasto.modo_de_pagamento.nome)
          if (thirdIndex === -1) {
            third.labels.push(gasto.modo_de_pagamento.nome)
            third.data.push(0)
            thirdIndex = third.labels.length - 1
          }
          third.data[thirdIndex] += parseFloat(gasto.valor)

          // parse for the fourth graph
          // split by tipo
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
            //aspectRatio: 1400,
            responsive: true,
            //maintainAspectRatio: false,
            tooltips: {
              intersect: false,
              mode: 'index',
              callbacks: {
                label: this.lineTooltipCallback,
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
          options: Object.assign(
            {
              cutoutPercentage: 100 - 61,
            },
            options
          ),
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

    filters: {
      formatCurrency: function(value, hideValues) {
        if (!value) return ''
        if (hideValues === true) return '•••••••'
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      },
    },
  }
</script>

<style scoped lang="scss">
  .full-width {
    width: 100%;
    max-width: 100vw;
  }
  .max-width {
    max-width: 100vw !important;
  }
  button.toggle-button {
    height: 24px;
    width: 24px;
  }
</style>
