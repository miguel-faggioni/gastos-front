<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field label="Valor" prefix="R$" v-model="valor"></v-text-field>
      </v-col>
      <v-col>
        <v-select
          :items="categorias"
          label="Categoria"
          v-model="categoria"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-datetime-picker
          label="Data"
          v-model="data"
          dateFormat="dd/MM/yyyy"
          timeFormat="HH'h'mm"
          clearText="Limpar"
          :text-field-props="datetimepickerProps"
          :time-picker-props="tpProps"
          :date-picker-props="dpProps"
        ></v-datetime-picker>

        <v-select
          :items="modos"
          label="Modo de pagamento"
          v-model="modoDePagamento"
          prepend-icon="credit_card"
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
      datetimepickerProps: {
        prependIcon: 'mdi-calendar',
      },
      tpProps: {
        format: '24hr',
      },
      dpProps: {
        locale: 'pt-BR',
      },
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
