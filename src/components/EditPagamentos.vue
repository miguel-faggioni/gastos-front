<template>
  <v-container>
    <v-autocomplete
      class="mt-10"
      v-model="modo_de_pagamento"
      label="Modo de pagamento"
      :items="modos"
      :prepend-icon="icons.modo_de_pagamento"
      return-object
      item-text="nome"
      :filter="customFilter"
    >
      <template v-slot:append-item>
        <v-divider class="mb-2"></v-divider>
        <v-list-item ripple @click="reset()">
          <v-list-item-content>
            <v-list-item-title>
              Novo modo de pagamento
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-autocomplete>

    <form class="mt-10">
      <v-row>
        <v-col>
          <v-text-field
            label="Nome do modo de pagamento"
            v-model="modo_de_pagamento.nome"
            ref="nome"
            required
            :error-messages="nomeErrors"
            @input="$v.modo_de_pagamento.nome.$touch()"
            @blur="$v.modo_de_pagamento.nome.$touch()"
            v-on:keyup.enter="$refs.sigla.focus()"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            label="Sigla"
            ref="sigla"
            v-model="modo_de_pagamento.sigla"
            required
            :error-messages="siglaErrors"
            @input="$v.modo_de_pagamento.sigla.$touch()"
            @blur="$v.modo_de_pagamento.sigla.$touch()"
            v-on:keyup.enter="$refs.icone.focus()"
          ></v-text-field>
        </v-col>
        <v-col style="min-width: 100px; max-width: 100px;">
          <v-select
            :items="validIcons"
            label="Ícone"
            ref="icone"
            v-model="modo_de_pagamento.icone"
            required
            :error-messages="iconeErrors"
            @input="$v.modo_de_pagamento.icone.$touch()"
            @blur="$v.modo_de_pagamento.icone.$touch()"
          >
            <template slot="selection" slot-scope="data">
              <v-icon>{{ data.item }}</v-icon>
            </template>
            <template slot="item" slot-scope="data">
              <v-icon>{{ data.item }}</v-icon>
            </template>
          </v-select>
        </v-col>
      </v-row>

      <v-row class="mb-10">
        <v-btn
          block
          text
          color="accent"
          v-on:click="salvar()"
          :loading="loading.salvar"
          :disabled="loading.salvar"
        >
          Salvar
        </v-btn>
      </v-row>
      <v-divider></v-divider>
      <v-row class="mt-10">
        <v-col>
          <v-autocomplete
            v-model="replaceBy"
            label="Ao remover trocar por"
            :items="modos"
            :prepend-icon="icons.replaceBy"
            return-object
            item-text="nome"
            :filter="customFilter"
            :disabled="!this.modo_de_pagamento.id || loading.remover"
          ></v-autocomplete>
        </v-col>
      </v-row>

      <v-row>
        <v-btn
          block
          text
          color="error"
          v-on:click="remover()"
          :loading="loading.remover"
          :disabled="!this.modo_de_pagamento.id || loading.remover"
        >
          Remover
        </v-btn>
      </v-row>
    </form>

    <!-- generic snackbar -->
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
  import { mapState } from 'vuex'

  export default {
    mixins: [validationMixin],

    async beforeCreate() {
      await Promise.all([this.$store.dispatch('pagamento/get')])
    },

    data: () => ({
      loading: {
        salvar: false,
        remover: false,
      },
      modo_de_pagamento: {
        nome: null,
        sigla: null,
        icone: null,
      },
      replaceBy: {
        nome: null,
        sigla: null,
        icone: null,
      },
      icons: {
        modo_de_pagamento: 'credit_card',
        replaceBy: 'credit_card',
      },
      snackbar: {
        show: false,
        timeout: 2000,
        message: 'Erro ao editar pagamento',
      },
    }),

    watch: {
      modo_de_pagamento(newValue) {
        this.$v.$reset()
        if (newValue.icone === null) {
          this.icons.modo_de_pagamento = 'credit_card'
        } else {
          this.icons.modo_de_pagamento = newValue.icone
        }
      },
      replaceBy(newValue) {
        if (newValue.icone === null) {
          this.icons.replaceBy = 'credit_card'
        } else {
          this.icons.replaceBy = newValue.icone
        }
      },
    },

    methods: {
      reset: function() {
        this.modo_de_pagamento = {
          nome: null,
          sigla: null,
          icone: null,
        }
        this.replaceBy = {
          nome: null,
          sigla: null,
          icone: null,
        }
        this.$refs.nome.focus()
      },
      salvar: async function() {
        this.$v.$touch()
        if (this.$v.$invalid) {
          return
        }

        this.loading.salvar = true

        if (!this.modo_de_pagamento.id) {
          // new item => create
          try {
            await this.$store.dispatch('pagamento/create', {
              nome: this.modo_de_pagamento.nome,
              sigla: this.modo_de_pagamento.sigla,
              icone: this.modo_de_pagamento.icone,
            })
          } catch (err) {
            this.snackbar.msg = 'Erro ao tentar criar modo de pagamento'
            this.snackbar.show = true
          }
        } else {
          // existing item => update
          try {
            await this.$store.dispatch('pagamento/update', {
              id: this.modo_de_pagamento.id,
              nome: this.modo_de_pagamento.nome,
              sigla: this.modo_de_pagamento.sigla,
              icone: this.modo_de_pagamento.icone,
            })
          } catch (err) {
            this.snackbar.msg = 'Erro ao tentar editar modo de pagamento'
            this.snackbar.show = true
          }
        }

        this.loading.salvar = false
        this.$v.$reset()
      },
      remover: async function() {
        try {
          await this.$store.dispatch('pagamento/delete', {
            id: this.modo_de_pagamento.id,
            replaceId: this.replaceBy.id,
          })
        } catch (err) {
          this.snackbar.msg = 'Erro ao tentar remover modo de pagamento'
          this.snackbar.show = true
        }
        if (this.snackbar.show === false) {
          this.modo_de_pagamento.id === null
          this.reset()
        }
      },
      customFilter: function(item, queryText) {
        const textOne = item.nome.toLowerCase()
        const textTwo = item.sigla.toLowerCase()
        const searchText = queryText.toLowerCase()

        return textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1
      },
    },

    validations: {
      modo_de_pagamento: {
        nome: { required },
        sigla: { required },
        icone: { required },
      },
    },

    computed: {
      ...mapState({
        modos: state => state.pagamento.modos,
        validIcons: state => state.pagamento.icones,
      }),
      nomeErrors() {
        const errors = []
        if (!this.$v.modo_de_pagamento.nome.$dirty) return errors
        !this.$v.modo_de_pagamento.nome.required && errors.push('Insira um nome')
        return errors
      },
      siglaErrors() {
        const errors = []
        if (!this.$v.modo_de_pagamento.sigla.$dirty) return errors
        !this.$v.modo_de_pagamento.sigla.required && errors.push('Insira uma sigla')
        return errors
      },
      iconeErrors() {
        const errors = []
        if (!this.$v.modo_de_pagamento.icone.$dirty) return errors
        !this.$v.modo_de_pagamento.icone.required && errors.push('Selecione um ícone')
        return errors
      },
    },
  }
</script>
