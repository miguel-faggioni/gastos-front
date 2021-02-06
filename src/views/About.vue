<template>
  <v-container class="more-width">
    <h2 class="mb-5">{{ title }}</h2>

    <p v-for="row in text" :key="row">
      {{ row }}
    </p>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      title: 'Trabalho em andamento',
      text: [
        'Iniciei este projeto com o intuito de facilitar a anotação de meus gastos diários e sua classificação com categorias para que eu possa analisar mais tarde como têm se distribuído meus gastos ao longo do mês e do ano.',
        'Um dos próximos passos será funcionar offline. E atualmente é possível inserir e baixar os dados para inseri-los em alguma outra planilha para facilitar uma visualização mais ampla dos gastos.',
        'Este projeto ainda é um trabalho em andamento, por isso conto com a paciência de todas as pessoas que resolvam usá-lo.',
        'Peço também que usem o "Fale conosco" para submeter quaisquer problemas, dúvidas, e sugestões.',
        '😁',
      ],
    }),
  }
</script>

<style lang="scss">
  .more-width {
    padding: 20px !important;
  }
  p {
    text-align: justify;
  }
</style>
