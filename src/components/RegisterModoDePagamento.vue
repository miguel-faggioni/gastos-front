<template>
  <v-dialog v-model="localShow" persistent>
    <v-card class="pt-2">
      <v-card-text>
        <form>
          <v-row>
            <v-col>
              <v-text-field
                label="Nome do modo de pagamento"
                v-model="nome"
                ref="nome"
                required
                :error-messages="nomeErrors"
                @input="$v.nome.$touch()"
                @blur="$v.nome.$touch()"
                v-on:keyup.enter="$refs.sigla.focus()"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                label="Sigla"
                ref="sigla"
                v-model="sigla"
                required
                :error-messages="siglaErrors"
                @input="$v.sigla.$touch()"
                @blur="$v.sigla.$touch()"
                v-on:keyup.enter="$refs.icone.focus()"
              ></v-text-field>
            </v-col>
            <v-col style="min-width: 100px; max-width: 100px;">
              <v-select
                :items="validIcons"
                label="Ícone"
                ref="icone"
                v-model="icone"
                required
                :error-messages="iconeErrors"
                @input="$v.icone.$touch()"
                @blur="$v.icone.$touch()"
              >
                <!-- HTML that describe how select should render selected items -->
                <template slot="selection" slot-scope="data">
                  <v-icon>{{ data.item }}</v-icon>
                </template>

                <!-- HTML that describe how select should render items when the select is open -->
                <template slot="item" slot-scope="data">
                  <v-icon>{{ data.item }}</v-icon>
                </template>
              </v-select>
            </v-col>
          </v-row>
        </form>
      </v-card-text>
      <v-card-actions class="d-flex justify-space-between">
        <v-btn text v-on:click="fechar()">
          Voltar
        </v-btn>
        <v-btn text color="accent" v-on:click="inserir()" :loading="loading" :disabled="loading">
          Criar modo de pagamento
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'
  import { mapState } from 'vuex'

  export default {
    mixins: [validationMixin],
    name: 'RegisterModoDePagamento',

    props: ['show'],

    data: () => ({
      localShow: false,
      loading: false,
      nome: null,
      sigla: null,
      icone: null,
    }),

    methods: {
      inserir: async function() {
        this.$v.$touch()
        if (this.$v.$invalid) {
          return
        }
        this.loading = true
        await this.$store.dispatch('pagamento/create', {
          nome: this.nome,
          sigla: this.sigla,
          icone: this.icone,
        })
        this.loading = false
        this.limpar()
        this.$refs.nome.focus()
        this.fechar()
      },
      limpar: function() {
        this.$v.$reset()
        this.nome = null
        this.sigla = null
        this.icone = null
      },
      fechar: function() {
        this.$emit('update:show', false)
      },
    },

    watch: {
      show(newValue) {
        this.localShow = newValue
      },
    },

    validations: {
      nome: { required },
      sigla: { required },
      icone: { required },
    },

    computed: {
      ...mapState({
        validIcons: state => state.pagamento.icones,
      }),
      nomeErrors() {
        const errors = []
        if (!this.$v.nome.$dirty) return errors
        !this.$v.nome.required && errors.push('Insira um nome')
        return errors
      },
      siglaErrors() {
        const errors = []
        if (!this.$v.sigla.$dirty) return errors
        !this.$v.sigla.required && errors.push('Insira uma sigla')
        return errors
      },
      iconeErrors() {
        const errors = []
        if (!this.$v.icone.$dirty) return errors
        !this.$v.icone.required && errors.push('Selecione um ícone')
        return errors
      },
    },
  }
</script>
