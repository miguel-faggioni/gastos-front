<template>
  <v-container>
    <v-data-table
      dense
      item-key="id"
      :headers="tableHeaders"
      :items="chartData"
      :footer-props="{
        showFirstLastPage: true,
      }"
      :class="backgroundColor"
    >
      <template v-slot:item.valor="{ item }">
        {{ currency }} {{ item.valor | formatCurrency(hideValues) }}
      </template>
      <template v-slot:item.categoria="{ item }">
        <v-icon class="d-none d-sm-inline-block">{{ item.categoria.icone }}</v-icon>
        {{ item.categoria.nome }}
        <v-icon class="d-sm-none">{{ item.categoria.icone }}</v-icon>
      </template>
      <template v-slot:item.data="{ item }">
        {{ item.data | formatDate }}
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
  export default {
    props: ['chartData', 'hideValues', 'backgroundColor'],

    data: () => ({
      currency: 'R$',
      tableData: [],
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
          text: 'Data',
          value: 'data',
          sort: (a, b) => {
            return a.unix_timestamp - b.unix_timestamp
          },
        },
      ],
    }),

    filters: {
      formatCurrency: function(value, hideValues) {
        if (!value) return ''
        if (hideValues === true) return '•••••••'
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      },
      formatDate: function(value) {
        if (!value) return 'Sem data'
        let val = new Date(Number(value.unix_timestamp))
        return `${val.getDate()} ${val
          .getMonthAbbreviation(val.getDay())
          .substring(0, 3)}, ${val.getFullYear()}`
      },
    },
  }
</script>

<style lang="scss" scoped></style>
