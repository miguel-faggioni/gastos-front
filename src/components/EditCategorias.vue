<template>
  <v-container>
    <v-autocomplete
      class="mt-10"
      v-model="categoria"
      label="Categoria"
      :items="categorias"
      :prepend-icon="icons.categoria"
      return-object
      item-text="nome"
      :filter="customFilter"
    >
      <template v-slot:append-item>
        <v-divider class="mb-2"></v-divider>
        <v-list-item ripple @click="reset()">
          <v-list-item-content>
            <v-list-item-title>
              Nova categoria
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-autocomplete>

    <form class="mt-10">
      <v-row>
        <v-col>
          <v-text-field
            label="Nome da categoria"
            v-model="categoria.nome"
            ref="nome"
            required
            :error-messages="nomeErrors"
            @input="$v.categoria.nome.$touch()"
            @blur="$v.categoria.nome.$touch()"
            v-on:keyup.enter="$refs.sigla.focus()"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            label="Sigla"
            ref="sigla"
            v-model="categoria.sigla"
            required
            :error-messages="siglaErrors"
            @input="$v.categoria.sigla.$touch()"
            @blur="$v.categoria.sigla.$touch()"
            v-on:keyup.enter="$refs.icone.focus()"
          ></v-text-field>
        </v-col>
        <v-col style="min-width: 100px; max-width: 100px;">
          <v-select
            :items="validIcons"
            label="Ícone"
            ref="icone"
            v-model="categoria.icone"
            required
            :error-messages="iconeErrors"
            @input="$v.categoria.icone.$touch()"
            @blur="$v.categoria.icone.$touch()"
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
            :items="categorias"
            :prepend-icon="icons.replaceBy"
            return-object
            item-text="nome"
            :filter="customFilter"
            :disabled="!this.categoria.id || loading.remover"
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
          :disabled="!this.categoria.id || loading.remover"
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
      await Promise.all([this.$store.dispatch('categoria/get')])
    },

    data: () => ({
      loading: {
        salvar: false,
        remover: false,
      },
      categoria: {
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
        categoria: 'credit_card',
        replaceBy: 'credit_card',
      },
      snackbar: {
        show: false,
        timeout: 2000,
        message: 'Erro ao editar categoria',
      },
    }),

    watch: {
      categoria(newValue) {
        this.$v.$reset()
        if (newValue.icone === null) {
          this.icons.categoria = 'credit_card'
        } else {
          this.icons.categoria = newValue.icone
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
        this.categoria = {
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

        if (!this.categoria.id) {
          // new item => create
          try {
            await this.$store.dispatch('categoria/create', {
              nome: this.categoria.nome,
              sigla: this.categoria.sigla,
              icone: this.categoria.icone,
            })
          } catch (err) {
            this.snackbar.msg = 'Erro ao tentar criar categoria'
            this.snackbar.show = true
          }
        } else {
          // existing item => update
          try {
            await this.$store.dispatch('categoria/update', {
              id: this.categoria.id,
              nome: this.categoria.nome,
              sigla: this.categoria.sigla,
              icone: this.categoria.icone,
            })
          } catch (err) {
            this.snackbar.msg = 'Erro ao tentar editar categoria'
            this.snackbar.show = true
          }
        }

        this.loading.salvar = false
        this.$v.$reset()
      },
      remover: async function() {
        try {
          await this.$store.dispatch('categoria/delete', {
            id: this.categoria.id,
            replaceId: this.replaceBy.id,
          })
        } catch (err) {
          this.snackbar.msg = 'Erro ao tentar remover categoria'
          this.snackbar.show = true
        }
        if (this.snackbar.show === false) {
          this.categoria.id === null
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
      categoria: {
        nome: { required },
        sigla: { required },
        icone: { required },
      },
    },

    computed: {
      ...mapState({
        categorias: state => state.categoria.categorias,
        validIcons: state => state.categoria.icones,
      }),
      nomeErrors() {
        const errors = []
        if (!this.$v.categoria.nome.$dirty) return errors
        !this.$v.categoria.nome.required && errors.push('Insira um nome')
        return errors
      },
      siglaErrors() {
        const errors = []
        if (!this.$v.categoria.sigla.$dirty) return errors
        !this.$v.categoria.sigla.required && errors.push('Insira uma sigla')
        return errors
      },
      iconeErrors() {
        const errors = []
        if (!this.$v.categoria.icone.$dirty) return errors
        !this.$v.categoria.icone.required && errors.push('Selecione um ícone')
        return errors
      },
    },
  }
</script>
