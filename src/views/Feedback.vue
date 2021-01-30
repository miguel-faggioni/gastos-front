<template>
  <v-container class="more-width">
    <h2 class="mb-5">{{ title }}</h2>

    <p v-for="row in text" :key="row">
      {{ row }}
    </p>

    <form>
      <v-textarea
        filled
        name="feedback-text"
        v-model="feedback.text"
        required
        :error-messages="feedbackErrors"
      ></v-textarea>

      <v-btn block v-on:click="submit()" color="primary" :loading="loading" :disabled="loading">
        Enviar
      </v-btn>
    </form>

    <v-snackbar v-model="snackbar.show" :timeout="snackbar.timeout">
      {{ snackbar.msg }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false">
          OK
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'

  export default {
    mixins: [validationMixin],
    data: () => ({
      title: 'Feedback anônimo',
      text: [
        'Primeiramente obrigado por usar o sistema, e por se dar ao trabalho de dar um feedback.',
        'Isto me ajuda a decidir o que ainda precisa ser feito para que você possa usar o sistema do melhor jeito possível.',
        'Deixe aqui uma mensagem anônima com sugestões de funcionalidades, bugs encontrados, ou palavras de incentivo.',
        'Todo feedback é bem vindo 😁',
      ],
      feedback: {
        text: '',
      },
      snackbar: {
        msg: 'Erro ao realizar login',
        show: false,
        timeout: 2000,
      },
      loading: false,
    }),
    methods: {
      submit: async function() {
        this.$v.$touch()
        if (this.$v.$invalid) {
          return
        }
        this.loading = true
        try {
          await this.$store.dispatch('feedback/submit', {
            text: this.feedback.text,
          })
        } catch (err) {
          this.loading = false
          this.snackbar.show = true
          return
        }
        this.loading = false
        this.feedback.text = ''
        this.$v.feedback.$reset()
      },
    },
    validations: {
      feedback: { text: { required } },
    },
    computed: {
      feedbackErrors() {
        const errors = []
        if (!this.$v.feedback.text.$dirty) return errors
        !this.$v.feedback.text.required && errors.push('Insira um texto para enviar')
        return errors
      },
    },
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
