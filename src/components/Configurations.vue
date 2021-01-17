<template>
  <v-container class="d-flex flex-column align-start min-height">
    <v-btn
      @click="dialogs.download = true"
      outlined
      class="mb-8 mt-2 full-width"
      color="primary"
    >
      <v-icon left>
        mdi-cash-multiple
      </v-icon>
      Baixar gastos
    </v-btn>

    <v-btn
      @click="dialogs.erase = true"
      outlined
      class="mb-5 full-width"
      color="error"
    >
      <v-icon left>
        mdi-cash-remove
      </v-icon>
      Apagar gastos
    </v-btn>

    <v-btn
      class="mt-auto align-self-center"
      text
      color="error"
      v-on:click="logout()"
    >
      Logout
    </v-btn>

    <v-snackbar v-model="snackbar.show" :timeout="snackbar.timeout">
      {{ snackbar.msg }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false">
          OK
        </v-btn>
      </template>
    </v-snackbar>

    <v-dialog v-model="dialogs.download">
      <v-card>
        <v-card-text>
          <form>
            <v-menu
              ref="periodMenu"
              v-model="downloadDetails.periodMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              :return-value.sync="downloadDetails.period"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  disabled
                  class="pt-8"
                  label="Período a ser baixado"
                  v-model="downloadDetails.formattedPeriod"
                  @blur="
                    downloadDetails.period = parsePeriod(
                      downloadDetails.formattedPeriod
                    )
                  "
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                range
                ref="picker"
                clearText="Limpar"
                v-model="downloadDetails.period"
                locale="pt-BR"
                type="month"
              >
                <v-spacer></v-spacer>
                <v-btn text @click="clearPeriod()">
                  Limpar
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.periodMenu.save(downloadDetails.period)"
                >
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

    <v-dialog v-model="dialogs.erase">
      <v-card>
        <v-card-title>
          <span class="headline"
            >Tem certeza que deseja remover <b>todos</b> os gastos
            cadastrados?</span
          >
        </v-card-title>
        <v-card-text>
          Esta ação é irreversível.
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="error"
            text
            v-on:click="dialogs.eraseConfirmation = true"
          >
            Sim, remover todos os gastos
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn text @click="dialogs.erase = false">
            Não, voltar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogs.eraseConfirmation">
      <v-card>
        <v-card-title>
          <span class="headline"
            >Tem certeza <b>mesmo</b> que deseja remover <b>todos</b> os gastos
            cadastrados?</span
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
            Sim, remover todos os gastos
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="
              dialogs.erase = false
              dialogs.eraseConfirmation = false
            "
          >
            Não, voltar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'

  export default {
    mixins: [validationMixin],

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
        try {
          await this.$store.dispatch('gasto/downloadAll', {
            format: this.downloadDetails.format,
          })
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
        let formatted = [date_0.getMonthAbbreviation() + '/' + year_0]
        if (period.length > 1) {
          const [year_1, month_1] = period[1].split('-')
          let date_1 = new Date(year_1, month_1 - 1)
          // make sure the order stays correct
          if (date_0.getTime() < date_1.getTime()) {
            formatted.push(date_1.getMonthAbbreviation() + '/' + year_1)
          } else {
            formatted.splice(0, 0, date_1.getMonthAbbreviation() + '/' + year_1)
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
        this.downloadDetails.formattedPeriod = this.formatPeriod(
          this.downloadDetails.period
        )
      },
    },

    computed: {
      formatErrors() {
        const errors = []
        if (!this.$v.downloadDetails.format.$dirty) return errors
        !this.$v.downloadDetails.format.required &&
          errors.push('Selecione um formato')
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
    min-height: 500px;
  }
  .full-width {
    width: 100%;
  }
</style>
