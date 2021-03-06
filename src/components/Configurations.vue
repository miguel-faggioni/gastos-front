<template>
  <v-container class="d-flex flex-column align-start min-height">
    <!-- edit categorias -->
    <v-btn @click="dialogs.editCategoria = true" outlined class="mb-5 full-width">
      Editar categorias
    </v-btn>

    <!-- edit categorias dialog -->
    <v-dialog v-model="dialogs.editCategoria" fullscreen>
      <v-card>
        <v-btn icon @click="dialogs.editCategoria = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <EditCategorias />
      </v-card>
    </v-dialog>

    <!-- edit pagamentos -->
    <v-btn @click="dialogs.editPagamento = true" outlined class="mb-5 full-width">
      Editar modos de pagamento
    </v-btn>

    <!-- edit pagamentos dialog -->
    <v-dialog v-model="dialogs.editPagamento" fullscreen>
      <v-card>
        <v-btn icon @click="dialogs.editPagamento = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <EditPagamentos />
      </v-card>
    </v-dialog>

    <!-- download all -->
    <v-btn @click="dialogs.download = true" outlined class="mt-2 mb-5 full-width" color="primary">
      <v-icon left>
        mdi-cash-multiple
      </v-icon>
      Baixar gastos
    </v-btn>

    <!-- remove all -->
    <v-btn @click="dialogs.erase = true" outlined class="mt-2 mb-5 full-width" color="error">
      <v-icon left>
        mdi-cash-remove
      </v-icon>
      Apagar gastos
    </v-btn>

    <!-- feedback -->
    <v-btn class="mt-auto align-self-center" text v-on:click="dialogs.feedback = true">
      Fale conosco
    </v-btn>

    <!-- about -->
    <v-btn class="mt-5 align-self-center" text v-on:click="dialogs.about = true">
      Sobre o aplicativo
    </v-btn>

    <!-- logout -->
    <v-btn class="mt-5 align-self-center" text color="error" v-on:click="logout()">
      Logout
    </v-btn>

    <!-- generic snackbar -->
    <v-snackbar v-model="snackbar.show" :timeout="snackbar.timeout">
      {{ snackbar.msg }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false">
          OK
        </v-btn>
      </template>
    </v-snackbar>

    <!-- download dialog -->
    <v-dialog v-model="dialogs.download" width="500px">
      <v-card>
        <v-card-text>
          <form>
            <v-menu
              ref="periodMenu"
              v-model="downloadDetails.periodMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  class="pt-8"
                  label="Período a ser baixado"
                  v-model="downloadDetails.formattedPeriod"
                  @blur="downloadDetails.period = parsePeriod(downloadDetails.formattedPeriod)"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                range
                ref="picker"
                v-model="downloadDetails.period"
                locale="pt-BR"
                type="month"
              >
                <v-spacer></v-spacer>
                <v-btn text @click="clearPeriod()">
                  Limpar
                </v-btn>
                <v-btn text color="primary" @click="$refs.periodMenu.save(downloadDetails.period)">
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>

            <v-select
              :items="downloadDetails.formats"
              label="Formato"
              v-model="downloadDetails.format"
              return-object
              required
              :error-messages="formatErrors"
              @input="$v.downloadDetails.format.$touch()"
              @blur="$v.downloadDetails.format.$touch()"
            ></v-select>
          </form>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn
            text
            color="accent"
            v-on:click="downloadData()"
            :loading="loading.downloadData"
            :disabled="loading.downloadData"
          >
            Baixar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- remove dialog 1/2 -->
    <v-dialog v-model="dialogs.erase" width="500px">
      <v-card>
        <v-card-title>
          <span class="headline"
            >Tem certeza que deseja remover <b>todos</b> os gastos cadastrados?</span
          >
        </v-card-title>
        <v-card-text>
          Esta ação é irreversível.
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" text v-on:click="dialogs.eraseConfirmation = true">
            Remover
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn text @click="dialogs.erase = false">
            Voltar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- remove dialog 2/2 -->
    <v-dialog v-model="dialogs.eraseConfirmation" width="500px">
      <v-card>
        <v-card-title>
          <span class="headline"
            >Tem certeza <b>mesmo</b> que deseja remover <b>todos</b> os gastos cadastrados?</span
          >
        </v-card-title>
        <v-card-text> Esta ação é <b>realmente</b> irreversível. </v-card-text>
        <v-card-actions>
          <v-btn
            color="error"
            text
            v-on:click="eraseData()"
            :loading="loading.eraseData"
            :disabled="loading.eraseData"
          >
            Remover
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="
              dialogs.erase = false
              dialogs.eraseConfirmation = false
            "
          >
            Voltar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- dialog about -->
    <v-dialog v-model="dialogs.about" fullscreen>
      <v-card>
        <v-btn icon @click="dialogs.about = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <About />
      </v-card>
    </v-dialog>

    <!-- dialog feedback -->
    <v-dialog v-model="dialogs.feedback" fullscreen>
      <v-card>
        <v-btn icon @click="dialogs.feedback = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <Feedback />
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'
  import About from '@/views/About.vue'
  import Feedback from '@/views/Feedback.vue'
  import EditCategorias from '@/components/EditCategorias.vue'
  import EditPagamentos from '@/components/EditPagamentos.vue'

  export default {
    mixins: [validationMixin],

    components: {
      About,
      Feedback,
      EditCategorias,
      EditPagamentos,
    },

    data: () => ({
      snackbar: {
        msg: 'Erro ao realizar logout',
        show: false,
        timeout: 2000,
      },
      loading: {
        downloadData: false,
        eraseData: false,
      },
      dialogs: {
        download: false,
        erase: false,
        eraseConfirmation: false,
        about: false,
        feedback: false,
        editPagamento: false,
        editCategoria: false,
      },
      downloadDetails: {
        periodMenu: false,
        period: null,
        formattedPeriod: null,
        format: null,
        formats: ['csv', 'xlsx'],
      },
    }),

    validations: {
      downloadDetails: {
        format: { required },
      },
    },

    methods: {
      logout: function() {
        this.$store.dispatch('auth/logout')
        this.$router.push({
          name: 'Login',
        })
      },

      downloadData: async function() {
        this.$v.$touch()
        if (this.$v.$invalid) {
          return
        }
        this.loading.downloadData = true
        let parameters = {
          format: this.downloadDetails.format,
        }
        if (this.downloadDetails.period !== null) {
          if (this.downloadDetails.period[0] !== undefined) {
            let [start_year, start_month] = this.downloadDetails.period[0].split('-')
            parameters['startDate'] = new Date(start_year, start_month - 1).toISOString()
          }
          if (this.downloadDetails.period[1] !== undefined) {
            let [end_year, end_month] = this.downloadDetails.period[1].split('-')
            parameters['endDate'] = new Date(end_year, end_month - 1).toISOString()
          }
        }
        try {
          await this.$store.dispatch('gasto/downloadAll', parameters)
        } catch (err) {
          this.snackbar.msg = 'Erro ao tentar baixar gastos'
          this.snackbar.show = true
        }
        this.$v.$reset()
        this.dialogs.download = false
        this.loading.downloadData = false
      },

      eraseData: async function() {
        this.loading.eraseData = true
        try {
          await this.$store.dispatch('gasto/deleteAll')
        } catch (err) {
          this.snackbar.msg = 'Erro ao tentar apagar gastos'
          this.snackbar.show = true
        }
        this.dialogs.erase = false
        this.dialogs.eraseConfirmation = false
        this.loading.eraseData = false
      },

      clearPeriod: function() {
        this.downloadDetails.periodMenu = false
        this.downloadDetails.period = null
      },

      formatPeriod: function(period) {
        if (!period) return null

        const [year_0, month_0] = period[0].split('-')
        let date_0 = new Date(year_0, month_0 - 1)
        let formatted = [
          date_0
            .getMonthAbbreviation()
            .toUpperCase()
            .substring(0, 3) +
            '/' +
            year_0,
        ]
        if (period.length > 1) {
          const [year_1, month_1] = period[1].split('-')
          let date_1 = new Date(year_1, month_1 - 1)
          // make sure the order stays correct
          if (date_0.getTime() < date_1.getTime()) {
            formatted.push(
              date_1
                .getMonthAbbreviation()
                .toUpperCase()
                .substring(0, 3) +
                '/' +
                year_1
            )
          } else {
            formatted.splice(
              0,
              0,
              date_1
                .getMonthAbbreviation()
                .toUpperCase()
                .substring(0, 3) +
                '/' +
                year_1
            )
          }
        }
        return formatted.join(' ~ ')
      },

      parsePeriod: function(period) {
        if (!period) return null

        const monthMap = {
          JAN: 1,
          FEV: 2,
          MAR: 3,
          ABR: 4,
          MAI: 5,
          JUN: 6,
          JUL: 7,
          AGO: 8,
          SET: 9,
          OUT: 10,
          NOV: 11,
          DEZ: 12,
        }

        const [date_0, date_1] = period.split(' ~ ')

        const [month_0, year_0] = date_0.split('/')
        let parsed = [String(year_0) + '-' + monthMap[month_0]]

        if (date_1 !== undefined) {
          const [month_1, year_1] = date_1.split('/')
          parsed.push(String(year_1) + '-' + monthMap[month_1])
        }

        return parsed
      },
    },

    watch: {
      'downloadDetails.period': function() {
        this.downloadDetails.formattedPeriod = this.formatPeriod(this.downloadDetails.period)
      },
    },

    computed: {
      formatErrors() {
        const errors = []
        if (!this.$v.downloadDetails.format.$dirty) return errors
        !this.$v.downloadDetails.format.required && errors.push('Selecione um formato')
        return errors
      },
      formattedDownloadPeriod() {
        return this.formatPeriod(this.downloadDetails.period)
      },
    },
  }
</script>

<style scoped lang="scss">
  .min-height {
    min-height: 700px;
  }
  .full-width {
    width: 100%;
  }
</style>
