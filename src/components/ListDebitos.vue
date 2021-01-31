<template>
  <v-container class="pa-0">
    <v-skeleton-loader v-show="loading" type="table"></v-skeleton-loader>

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
      :items="debitos"
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
      <template v-slot:item.dia="{ item }">
        {{ item.dia_do_mes }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(debitos, item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(debitos, item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <!-- dialog to delete row -->
    <v-dialog v-model="dialogs.delete">
      <v-card>
        <v-card-title>
          <span class="headline">Tem certeza que deseja remover este débito automático?</span>
        </v-card-title>
        <v-card-text>
          Esta ação é irreversível.
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" text @click="finishDeleteItem()">
            Sim, remover débito automático
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn text @click="dialogs.delete = false">
            Não, voltar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- end of dialog to remove row -->

    <!-- dialog to edit row -->
    <v-dialog v-model="dialogs.edit">
      <v-card>
        <v-card-title>
          <span class="headline">Editar débito automático</span>
        </v-card-title>
        <v-card-text>
          <InputDebitos
            class="pa-0"
            v-bind:debito.sync="editedItem"
            v-on:update:show="dialogs.edit = $event"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" text @click="dialogs.delete = true">
            Remover débito automático
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- end of dialog to edit row -->
  </v-container>
</template>

<script>
  import { mapState } from 'vuex'
  import InputDebitos from '@/components/InputDebitos.vue'

  export default {
    components: {
      InputDebitos,
    },

    data: () => ({
      loading: true,
      currency: 'R$',
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
          text: 'Dia do mês',
          value: 'dia',
          sort: (a, b) => {
            return a - b
          },
        },
        {
          text: 'Ações',
          value: 'actions',
          sortable: false,
          align: 'end',
        },
      ],
      search: '',
      editedIndex: -1,
      editedItem: {
        valor: null,
        categoria: null,
        modo_de_pagamento: null,
        dia: null,
        tipo: null,
        obs: null,
      },
      dialogs: {
        edit: false,
        delete: false,
      },
    }),

    async beforeCreate() {
      await Promise.all([this.$store.dispatch('debito/get')])
      this.loading = false
    },

    computed: {
      ...mapState({
        debitos: state => state.debito.debitos,
      }),
    },

    methods: {
      tableFilter(value, search, item) {
        search = search.toLowerCase()
        return (
          String(item.valor).indexOf(search) !== -1 ||
          item.categoria.sigla.toLowerCase().indexOf(search) !== -1 ||
          item.categoria.nome.toLowerCase().indexOf(search) !== -1 ||
          String(item.dia).indexOf(search) !== -1
        )
      },

      editItem(list, item) {
        this.editedIndex = list.indexOf(item)
        this.dialogs.edit = true
        this.editedItem = Object.assign(
          {
            dia: item.dia_do_mes,
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
        this.$store.dispatch('debito/update', {
          id: this.editedItem.id,
          valor: this.editedItem.valor,
          categoria: this.editedItem.categoria,
          pagamento: this.editedItem.modo_de_pagamento,
          dia: this.editedItem.dia,
          tipo: this.editedItem.tipo,
          obs: this.editedItem.obs,
        })
        this.dialogs.edit = false
      },

      finishDeleteItem() {
        this.$store.dispatch('debito/delete', {
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
    },
  }
</script>

<style scoped lang="scss">
  .full-height {
    height: 100% !important;
  }
</style>
