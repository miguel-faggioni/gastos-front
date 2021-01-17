<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <p v-for="row in text" :key="row">
        {{ row }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    data: () => ({
      title: 'Trabalho em andamento',
      text: [
        'Iniciei este projeto com o intuito de facilitar a anotação de meus gastos diários e sua classificação com categorias para que eu possa analisar mais tarde como têm se distribuído meus gastos ao longo do mês e do ano.',
        'Atualmente é possível inserir e baixar os dados para inseri-los em alguma outra planilha para facilitar uma visualização mais ampla dos gastos. Mas um dos próximos passos será incluir no sistema algo para visualizar em gráficos a evolução e distribuição dos gastos.',
        'Este projeto ainda é um trabalho em andamento, por isso conto com a paciência de todas as pessoas que resolvam usá-lo.',
        'Peço também que usem o "Fale conosco" para submeter quaisquer problemas, dúvidas, e sugestões.',
        '😁',
      ],
    }),
  }
</script>
