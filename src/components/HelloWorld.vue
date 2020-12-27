<template>
  <v-container>
    <v-row>
      <v-text-field label="Valor" prefix="R$" v-model="valor"></v-text-field>
      <v-select
        :items="categorias"
        label="Categoria"
        v-model="categoria"
      ></v-select>
    </v-row>
    <v-row>
      <v-col>
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="date"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date"
              label="Picker in menu"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false">
              Cancel
            </v-btn>
            <v-btn text color="primary" @click="$refs.menu.save(date)">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>

        <v-select
          :items="modos"
          label="Modo de pagamento"
          v-model="modoDePagamento"
        ></v-select>
      </v-col>
      <v-col>
        <v-btn block v-on:click="inserir()">
          Inserir gasto
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'HelloWorld',

    data: () => ({
      valor: null,
      categoria: null,
      modoDePagamento: null,
      data: new Date(),
      categorias: ['cA', 'cB', 'cC'],
      modos: ['cartao', 'dinheiro'],
      menu: false,
      date: new Date().toISOString().substr(0, 10),
      modal: false,
      menu2: false,
    }),

    methods: {
      inserir: function() {
        console.log({
          valor: this.valor,
          categoria: this.categoria,
          modoDePagamento: this.modoDePagamento,
          data: this.data,
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  button {
    height: 100% !important;
  }
</style>
