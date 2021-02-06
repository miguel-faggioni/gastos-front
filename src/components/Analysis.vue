<template>
  <v-container class="ma-0 pt-5 d-flex justify-space-around full-width">
    <v-row v-if="show"
      ><!-- the `show` variable is used to flash the graphs when screen size changes -->
      <!-- debug info -->
      <!-- <v-col cols="12">
           <v-card color="grey lighten-3" @click="onResize()">
           {{
             $vuetify.breakpoint.lgAndUp
             ? 'desktop'
             : $vuetify.breakpoint.smAndUp
             ? 'tablet'
             : 'mobile'
             }}
           </v-card>
           </v-col> -->

      <!-- sum of all info -->
      <v-col
        :cols="$vuetify.breakpoint.lgAndUp ? 9 : 12"
        class="order-1"
        :class="$vuetify.breakpoint.lgAndUp ? 'pr-2' : null"
      >
        <v-card color="grey lighten-3">
          <v-row>
            <v-col class="d-flex justify-center">
              <!-- toggle values visibility -->
              <v-btn icon class="toggle-button" @click="hideValues = !hideValues">
                <v-icon>{{ hideValues ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
              </v-btn>
            </v-col>

            <!-- sum of values by Tipo -->
            <v-col
              v-for="tipo in Object.keys(sums)"
              :key="tipo"
              :cols="$vuetify.breakpoint.lgAndUp ? 3 : $vuetify.breakpoint.smAndUp ? 6 : 12"
            >
              <v-container class="ma-0 pa-0" :class="$vuetify.breakpoint.lgAndUp ? null : 'px-2'">
                {{ tipo }}: R$ {{ sums[tipo].toFixed(2) | formatCurrency(hideValues) }}
              </v-container>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <!-- year selector -->
      <v-col
        :cols="$vuetify.breakpoint.lgAndUp ? 3 : 12"
        class="order-2"
        :class="$vuetify.breakpoint.lgAndUp ? 'pl-2' : 'mt-3'"
      >
        <v-card color="grey lighten-3">
          <v-row class="px-5">
            <v-select dense v-model="selectedYear" :items="years"></v-select>
          </v-row>
        </v-card>
      </v-col>

      <!-- line chart by Tipo & doughnut chart by Categoria -->
      <v-col
        :cols="$vuetify.breakpoint.lgAndUp ? 6 : 12"
        class="order-3"
        :class="$vuetify.breakpoint.lgAndUp ? 'pr-2' : null"
      >
        <v-row>
          <v-col cols="12">
            <v-card color="grey lighten-3">
              <!-- line chart by Tipo -->
              <LineChart
                :height="
                  $vuetify.breakpoint.lgAndUp ? 150 : $vuetify.breakpoint.smAndUp ? 150 : 300
                "
                :width="
                  $vuetify.breakpoint.lgAndUp ? null : $vuetify.breakpoint.smAndUp ? null : 300
                "
                :chartData="graphs.first.data"
                :options="graphs.first.options"
              />
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-card color="grey lighten-3">
              <!-- doughnut chart by Categoria -->
              <PieChart
                :height="
                  $vuetify.breakpoint.lgAndUp ? 125 : $vuetify.breakpoint.smAndUp ? 115 : 125
                "
                :width="
                  $vuetify.breakpoint.lgAndUp ? null : $vuetify.breakpoint.smAndUp ? null : 150
                "
                :chartData="graphs.second.data"
                :options="graphs.second.options"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <!-- line chart by Categoria & pie chart by Pagamento & pie chart by Tipo & table of values-->
      <v-col
        :cols="$vuetify.breakpoint.lgAndUp ? 6 : 12"
        :class="$vuetify.breakpoint.lgAndUp ? 'order-4 pl-2' : 'order-5 pt-0'"
      >
        <v-row>
          <v-col cols="12">
            <v-card color="grey lighten-3">
              <!-- line chart by Categoria -->
              <LineChart
                :height="
                  $vuetify.breakpoint.lgAndUp ? 150 : $vuetify.breakpoint.smAndUp ? 150 : 400
                "
                :width="
                  $vuetify.breakpoint.lgAndUp ? null : $vuetify.breakpoint.smAndUp ? null : 300
                "
                :chartData="graphs.sixth.data"
                :options="graphs.sixth.options"
              />
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="6" class="pr-2">
            <v-card color="grey lighten-3">
              <!-- pie chart by Pagamento -->
              <PieChart
                :height="
                  $vuetify.breakpoint.lgAndUp ? 125 : $vuetify.breakpoint.smAndUp ? 150 : 200
                "
                :width="
                  $vuetify.breakpoint.lgAndUp ? null : $vuetify.breakpoint.smAndUp ? null : 150
                "
                :chartData="graphs.third.data"
                :options="
                  $vuetify.breakpoint.smAndUp
                    ? graphs.third.options
                    : Object.assign({}, graphs.third.options, { legend: { position: 'top' } })
                "
              />
            </v-card>
          </v-col>

          <v-col cols="6" class="pl-2">
            <v-card color="grey lighten-3">
              <!-- pie chart by Tipo -->
              <PieChart
                :height="
                  $vuetify.breakpoint.lgAndUp ? 125 : $vuetify.breakpoint.smAndUp ? 150 : 200
                "
                :width="
                  $vuetify.breakpoint.lgAndUp ? null : $vuetify.breakpoint.smAndUp ? null : 150
                "
                :chartData="graphs.fourth.data"
                :options="
                  $vuetify.breakpoint.smAndUp
                    ? graphs.fourth.options
                    : Object.assign({}, graphs.fourth.options, { legend: { position: 'top' } })
                "
              />
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-card color="grey lighten-3">
              <!-- table of values -->
              <TableChart
                :chartData="graphs.fifth.data"
                :hideValues="hideValues"
                backgroundColor="grey lighten-3"
              />
            </v-card>
          </v-col>
        </v-row>
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

    mounted() {
      // shuffle colors
      this.colors.shuffle()
      // add watcher on screen resize
      window.addEventListener('resize', this.onResize, { passive: true })
    },

    beforeDestroy() {
      // remove watcher on screen resize
      window.removeEventListener('resize', this.onResize, { passive: true })
    },

    data: () => ({
      hideValues: false,
      sums: {},
      years: [],
      selectedYear: new Date().getFullYear(),
      allData: [],
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
        fifth: {
          data: [],
        },
        sixth: {
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
      months: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      show: true,
    }),

    methods: {
      onResize() {
        this.show = false
        setTimeout(() => {
          this.show = true
        }, 200) // any less than 200ms and the graphs don't resize correctly
      },

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
        let sixth = {
          datasets: [],
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

        // reset the sums
        this.sums = {}

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
          if (Object.keys(this.sums).indexOf(gasto.tipo) === -1) {
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

          // parse for the sixth graph
          // split by date
          let sixthIndex = sixth.datasets.findIndex(
            dataset => dataset.label === gasto.categoria.nome
          )
          if (sixthIndex === -1) {
            sixth.datasets.push({
              label: gasto.categoria.nome,
              data: [null, null, null, null, null, null, null, null, null, null, null, null],
            })
            sixthIndex = sixth.datasets.length - 1
          }
          sixth.datasets[sixthIndex].data[gasto.data.mes] =
            sixth.datasets[sixthIndex].data[gasto.data.mes] || 0
          sixth.datasets[sixthIndex].data[gasto.data.mes] += parseFloat(gasto.valor)
        })

        // set first graph
        this.graphs.first = {
          data: {
            labels: this.months,
            datasets: first.datasets.map((dataset, i) => {
              return Object.assign(
                {
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
            responsive: true,
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

        // set fifth graph
        this.graphs.fifth = {
          data: gastos,
        }

        // set sixth graph
        this.graphs.sixth = {
          data: {
            labels: this.months,
            datasets: sixth.datasets.map((dataset, i) => {
              return Object.assign(
                {
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
            responsive: true,
            tooltips: {
              intersect: false,
              mode: 'index',
              callbacks: {
                label: this.lineTooltipCallback,
              },
            },
          },
        }
      },
    },

    watch: {
      gastos(newValue) {
        this.allData = newValue
        this.parseGastos(
          this.allData.filter(gasto => {
            return gasto.data.ano === this.selectedYear
          })
        )
      },
      selectedYear(newValue) {
        this.parseGastos(
          this.allData.filter(gasto => {
            return gasto.data.ano === newValue
          })
        )
      },
    },

    computed: {
      ...mapState({
        gastos(state) {
          state.gasto.gastos.forEach(gasto => {
            // parse for the available years
            if (this.years.indexOf(gasto.data.ano) === -1) {
              this.years.push(gasto.data.ano)
              this.years.sort((a, b) => b - a)
            }
          })

          return state.gasto.gastos
        },
      }),
      screenSize() {
        switch (this.$vuetify.breakpoint.name) {
          default:
            this.flashGraphs()
        }
        return this.$vuetify.breakpoint.name
      },
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
