<template>
  <v-container class="pa-0">
    <v-tabs v-model="activeTab" show-arrows background-color="secondary">
      <v-tab v-for="tabName in tabs" :key="tabName" :href="'#tab-' + tabName">
        {{ tabName }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="activeTab">
      <v-tab-item
        v-for="tabName in tabs"
        :key="tabName"
        :value="'tab-' + tabName"
      >
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Busca"
          single-line
          hide-details
          class="pa-2"
        ></v-text-field>
        <v-data-table
          dense
          item-key="id"
          :headers="tableHeaders"
          :items="gastosByMonth[tabName.replace('tab-', '')]"
          :search="search"
          multi-sort
          :footer-props="{
            showFirstLastPage: true,
          }"
        >
          <template v-slot:item.valor="{ item }">
            {{ currency }} {{ item.valor }}
          </template>
          <template v-slot:item.categoria="{ item }">
            {{ item.categoria.sigla }}
          </template>
          <template v-slot:item.data="{ item }">
            {{ item.data.dia }} ({{
              new Date().getDayOfWeekAbbreviation(item.data.dia_da_semana)
            }})
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon
              small
              class="mr-2"
              @click="
                editItem(gastosByMonth[tabName.replace('tab-', '')], item)
              "
            >
              mdi-pencil
            </v-icon>
            <v-icon
              small
              @click="
                deleteItem(gastosByMonth[tabName.replace('tab-', '')], item)
              "
            >
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-tab-item>
    </v-tabs-items>

    <v-dialog v-model="dialogs.delete">
      <v-card>
        <v-card-title>
          <span class="headline"
            >Tem certeza que deseja remover este gasto?</span
          >
        </v-card-title>
        <v-card-text>
          Esta ação é irreversível.
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" text @click="finishDeleteItem()">
            Sim, remover gasto
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn text @click="dialogs.delete = false">
            Não, voltar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogs.edit">
      <v-card>
        <v-card-title>
          <span class="headline">Editar gasto</span>
        </v-card-title>
        <v-card-text>
          <form>
            <v-row>
              <v-col>
                <v-text-field
                  label="Valor"
                  prefix="R$"
                  v-model="editedItem.valor"
                  required
                  :error-messages="valorErrors"
                  @input="$v.editedItem.valor.$touch()"
                  @blur="$v.editedItem.valor.$touch()"
                  ref="valor"
                  v-on:keyup.enter="$refs.categoria.focus()"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-select
                  :items="categorias"
                  label="Categoria"
                  v-model="editedItem.categoria"
                  return-object
                  item-text="nome"
                  required
                  ref="categoria"
                  :error-messages="categoriaErrors"
                  @input="$v.editedItem.categoria.$touch()"
                  @blur="$v.editedItem.categoria.$touch()"
                  v-on:keyup.enter="$refs.modo.focus()"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-datetime-picker
                  label="Data"
                  v-model="editedItem.date"
                  dateFormat="dd/MM/yyyy"
                  timeFormat="HH'h'mm"
                  clearText="Limpar"
                  :text-field-props="datetimepickerProps"
                  :time-picker-props="tpProps"
                  :date-picker-props="dpProps"
                  required
                  :error-messages="dataErrors"
                  @input="$v.editedItem.data.$touch()"
                  @blur="$v.editedItem.data.$touch()"
                ></v-datetime-picker>

                <v-select
                  :items="modos"
                  label="Modo de pagamento"
                  v-model="editedItem.modo_de_pagamento"
                  return-object
                  item-text="nome"
                  prepend-icon="credit_card"
                  required
                  ref="modo"
                  :error-messages="modoErrors"
                  @input="$v.editedItem.modo_de_pagamento.$touch()"
                  @blur="$v.editedItem.modo_de_pagamento.$touch()"
                ></v-select>
              </v-col>
              <v-col>
                <v-btn
                  block
                  v-on:click="finishEditItem()"
                  color="primary"
                  class="full-height"
                >
                  Salvar gasto
                </v-btn>
              </v-col>
            </v-row>
          </form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" text @click="dialogs.delete = true">
            Remover gasto
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import { required, decimal } from 'vuelidate/lib/validators'
  import { mapState } from 'vuex'

  export default {
    mixins: [validationMixin],

    data: () => ({
      currency: 'R$',
      activeTab: null,
      gastosByMonth: {},
      tabs: [],
      search: '',
      tableHeaders: [
        {
          text: 'Valor',
          value: 'valor',
        },
        { text: 'Categoria', value: 'categoria' },
        { text: 'Dia', value: 'data' },
        { text: 'Ações', value: 'actions', sortable: false, align: 'end' },
      ],
      datetimepickerProps: {
        prependIcon: 'mdi-calendar',
      },
      tpProps: {
        format: '24hr',
      },
      dpProps: {
        locale: 'pt-BR',
      },
      editedIndex: -1,
      editedItem: {
        valor: null,
        categoria: null,
        modo_de_pagamento: null,
        data: null,
      },
      dialogs: {
        edit: false,
        delete: false,
      },
    }),

    async beforeCreate() {
      await Promise.all([
        this.$store.dispatch('categoria/get'),
        this.$store.dispatch('pagamento/get'),
        this.$store.dispatch('gasto/get'),
      ])
      let currentYear = new Date().getFullYear()
      // for each row received
      this.gastos.forEach(gasto => {
        let gastoDate = new Date(Number(gasto.data.unix_timestamp))
        // split into buckets for each each month
        let key = gastoDate.getMonthAbbreviation()
        // if it's not from the current year, add the year to it
        if (gasto.data.ano !== currentYear) {
          key = key + '/' + String(gasto.data.ano)
        }
        this.gastosByMonth[key] = this.gastosByMonth[key] || []
        this.gastosByMonth[key].push(gasto)
        // if this is the first item of this month
        if (this.tabs.indexOf(key) === -1) {
          // add it to the tabs list
          this.tabs.push(key)
        }
      })

      // create the 1st tab for this month
      let key = new Date().getMonthAbbreviation()
      if (this.tabs.indexOf(key) === -1) {
        this.tabs.push(key)
        this.gastosByMonth[key] = this.gastosByMonth[key] || []
      }

      this.activeTab = this.tabs[0]
    },

    computed: {
      ...mapState({
        gastos: state => state.gasto.gastos,
        categorias: state => state.categoria.categorias,
        modos: state => state.pagamento.modos,
      }),

      valorErrors() {
        const errors = []
        if (!this.$v.editedItem.valor.$dirty) return errors
        !this.$v.editedItem.valor.required && errors.push('Insira um valor')
        !this.$v.editedItem.valor.decimal &&
          errors.push('O valor deve seguir o formato 1234.56')
        return errors
      },
      categoriaErrors() {
        const errors = []
        if (!this.$v.editedItem.categoria.$dirty) return errors
        !this.$v.editedItem.categoria.required &&
          errors.push('Selecione uma categoria')
        return errors
      },
      dataErrors() {
        const errors = []
        if (!this.$v.editedItem.date.$dirty) return errors
        !this.$v.editedItem.date.required && errors.push('Selecione uma data')
        return errors
      },
      modoErrors() {
        const errors = []
        if (!this.$v.editedItem.modo_de_pagamento.$dirty) return errors
        !this.$v.editedItem.modo_de_pagamento.required &&
          errors.push('Selecione um modo de pagamento')
        return errors
      },
    },

    validations: {
      editedItem: {
        valor: { required, decimal },
        categoria: { required },
        modo_de_pagamento: { required },
        date: { required },
      },
    },

    methods: {
      editItem(list, item) {
        this.$v.$reset()
        this.editedIndex = list.indexOf(item)
        this.editedItem = Object.assign(
          {
            date: new Date(Number(item.data.unix_timestamp)),
          },
          item
        )
        this.dialogs.edit = true
      },

      deleteItem(list, item) {
        this.editedIndex = list.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogs.delete = true
      },

      finishEditItem() {
        this.$v.$touch()
        if (this.$v.$invalid) {
          return
        }
        this.$store.dispatch('gasto/update', {
          id: this.editedItem.id,
          valor: this.editedItem.valor,
          categoria: this.editedItem.categoria,
          pagamento: this.editedItem.modo_de_pagamento,
          data: this.editedItem.date,
        })
        this.dialogs.edit = false
      },

      finishDeleteItem() {
        this.$store.dispatch('gasto/delete', {
          id: this.editedItem.id,
        })
        this.dialogs.edit = false
        this.dialogs.delete = false
      },
    },
  }
</script>

<style scoped lang="scss">
  .full-height {
    height: 100% !important;
  }
</style>
