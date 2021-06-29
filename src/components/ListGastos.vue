<template>
  <v-container class="pa-0">
    <v-tabs v-model="activeTab" show-arrows background-color="secondary">
      <v-tab v-for="tabName in tabs" :key="tabName" :href="'#tab-' + tabName">
        {{ tabName }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="activeTab">
      <v-skeleton-loader v-show="loading" type="table"></v-skeleton-loader>

      <v-tab-item v-for="tabName in tabs" :key="tabName" :value="'tab-' + tabName">
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
          :custom-filter="tableFilter"
          :footer-props="{
            showFirstLastPage: true,
          }"
        >
          <template v-slot:item.valor="{ item }">
            {{ currency }} {{ item.valor | formatCurrency }}
          </template>
          <template v-slot:item.categoria="{ item }">
            <v-icon class="d-none d-sm-inline-block">{{ item.categoria.icone }}</v-icon>
            {{ item.categoria.nome }}
            <v-icon class="d-sm-none">{{ item.categoria.icone }}</v-icon>
          </template>
          <template v-slot:item.data="{ item }">
            {{ item.data | formatDate }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon
              small
              class="mr-2"
              @click="editItem(gastosByMonth[tabName.replace('tab-', '')], item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteItem(gastosByMonth[tabName.replace('tab-', '')], item)">
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-tab-item>
    </v-tabs-items>

    <!-- dialog to delete row -->
    <v-dialog v-model="dialogs.delete" width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Tem certeza que deseja remover este gasto?</span>
        </v-card-title>
        <v-card-text>
          Esta ação é irreversível.
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" text @click="finishDeleteItem()">
            remover
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn text @click="dialogs.delete = false">
            voltar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- end of dialog to remove row -->

    <!-- dialog to edit row -->
    <v-dialog v-model="dialogs.edit" width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Editar gasto</span>
        </v-card-title>
        <v-card-text>
          <InputGastos
            class="pa-0"
            v-bind:gasto.sync="editedItem"
            v-on:update:show="dialogs.edit = $event"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" text @click="dialogs.delete = true">
            Remover gasto
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- end of dialog to edit row -->
  </v-container>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import { required, decimal } from 'vuelidate/lib/validators'
  import { mapState } from 'vuex'
  import InputGastos from '@/components/InputGastos.vue'

  export default {
    mixins: [validationMixin],
    components: {
      InputGastos,
    },

    data: () => ({
      loading: true,
      currency: 'R$',
      activeTab: null,
      gastosByMonth: {},
      tabs: [],
      tableHeaders: [
        {
          text: 'Valor',
          value: 'valor',
        },
        {
          text: 'Categoria',
          value: 'categoria',
          sort: (a, b) => {
            return ('' + a.sigla).localeCompare(b.sigla)
          },
        },
        {
          text: 'Dia',
          value: 'data',
          sort: (a, b) => {
            return a.unix_timestamp - b.unix_timestamp
          },
        },
        {
          text: 'Tipo',
          value: 'tipo',
        },
        {
          text: 'Obs',
          value: 'obs_abr',
        },
        {
          text: 'Ações',
          value: 'actions',
          sortable: false,
          align: 'end',
        },
      ],
      search: '',
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
        tipo: null,
        obs: null,
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
      this.loading = false
    },

    watch: {
      gastos(newValue) {
        this.parseGastos(newValue)
      },
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
        !this.$v.editedItem.valor.decimal && errors.push('O valor deve seguir o formato 1234.56')
        return errors
      },
      categoriaErrors() {
        const errors = []
        if (!this.$v.editedItem.categoria.$dirty) return errors
        !this.$v.editedItem.categoria.required && errors.push('Selecione uma categoria')
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
      parseGastos(gastos) {
        // clear values
        this.tabs = []
        this.gastosByMonth = {}

        let currentYear = new Date().getFullYear()
        // for each row received
        gastos.forEach(gasto => {
          // alter some values
          let obs_max_size = 20
          gasto.obs_abr = gasto.obs.slice(0, obs_max_size)
          if (gasto.obs.length > obs_max_size) {
            gasto.obs_abr = gasto.obs_abr + '...'
          }

          let gastoDate = new Date(Number(gasto.data.unix_timestamp))
          gasto.date = gastoDate
          // split into buckets for each each month
          let key = gastoDate
            .getMonthAbbreviation()
            .toUpperCase()
            .substring(0, 3)
          // if it's not from the current year, add the year to it
          if (gastoDate.getFullYear() !== currentYear) {
            key = key + '/' + String(gastoDate.getFullYear())
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
        let key = new Date()
          .getMonthAbbreviation()
          .toUpperCase()
          .substring(0, 3)
        if (this.tabs.indexOf(key) === -1) {
          this.tabs.push(key)
          this.gastosByMonth[key] = this.gastosByMonth[key] || []
        }
      },

      tableFilter(value, search, item) {
        search = search.toLowerCase()
        return (
          String(item.valor).indexOf(search) !== -1 ||
          item.categoria.sigla.toLowerCase().indexOf(search) !== -1 ||
          item.categoria.nome.toLowerCase().indexOf(search) !== -1 ||
          item.modo_de_pagamento.sigla.toLowerCase().indexOf(search) !== -1 ||
          item.modo_de_pagamento.nome.toLowerCase().indexOf(search) !== -1 ||
          item.obs.toLowerCase().indexOf(search) !== -1 ||
          item.tipo.toLowerCase().indexOf(search) !== -1 ||
          String(item.date.getDate()).indexOf(search) !== -1 ||
          item.date
            .getDayOfWeekAbbreviation(item.date.getDay())
            .toLowerCase()
            .indexOf(search) !== -1
        )
      },

      editItem(list, item) {
        this.$v.$reset()
        this.editedIndex = list.indexOf(item)
        this.dialogs.edit = true
        this.editedItem = Object.assign(
          {
            date: new Date(Number(item.data.unix_timestamp)),
          },
          item
        )
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
          tipo: this.editedItem.tipo,
          obs: this.editedItem.obs,
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

    filters: {
      formatCurrency: function(value) {
        if (!value) return '0.00'
        let val = (value / 1).toFixed(2)
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      },
      formatDate: function(value) {
        if (!value) return 'Sem data'
        let val = new Date(Number(value.unix_timestamp))
        return `${val.getDate()} (${val.getDayOfWeekAbbreviation(val.getDay()).substring(0, 3)})`
      },
    },
  }
</script>

<style scoped lang="scss">
  .full-height {
    height: 100% !important;
  }
</style>
