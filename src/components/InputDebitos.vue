<template>
  <v-container>
    <form>
      <v-row>
        <v-col>
          <v-text-field
            label="Valor"
            v-model="debito.valor"
            required
            :error-messages="valorErrors"
            @input="$v.debito.valor.$touch()"
            @blur="$v.debito.valor.$touch()"
            ref="valor"
            v-on:keyup.enter="$refs.categoria.focus()"
          >
            <div slot="prepend" class="prepend-text">
              R$
            </div>
          </v-text-field>
        </v-col>
        <v-col>
          <v-select
            :items="categorias"
            label="Categoria"
            v-model="debito.categoria"
            :prepend-icon="icons.categoria"
            return-object
            item-text="nome"
            required
            ref="categoria"
            :error-messages="categoriaErrors"
            @input="$v.debito.categoria.$touch()"
            @blur="$v.debito.categoria.$touch()"
            v-on:keyup.enter="$refs.modo.focus()"
          >
            <template v-slot:append-item>
              <v-divider class="mb-2"></v-divider>
              <v-list-item ripple @click="dialogs.registerCategoria = true">
                <v-list-item-content>
                  <v-list-item-title>
                    Nova categoria
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-select
            :items="dias"
            label="Dia do mês"
            v-model="debito.dia"
            prepend-icon="mdi-calendar"
            required
            :error-messages="dataErrors"
            @input="$v.debito.dia.$touch()"
            @blur="$v.debito.dia.$touch()"
            v-on:keyup.enter="$refs.modo.focus()"
          ></v-select>
        </v-col>

        <v-col>
          <v-select
            :items="modos"
            label="Modo de pagamento"
            v-model="debito.modo_de_pagamento"
            return-object
            item-text="nome"
            :prepend-icon="icons.modo_de_pagamento"
            required
            ref="modo"
            :error-messages="modoErrors"
            @input="$v.debito.modo_de_pagamento.$touch()"
            @blur="$v.debito.modo_de_pagamento.$touch()"
          >
            <template v-slot:append-item>
              <v-divider class="mb-2"></v-divider>
              <v-list-item ripple @click="dialogs.registerModoDePagamento = true">
                <v-list-item-content>
                  <v-list-item-title>
                    Novo modo de pagamento
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
      </v-row>

      <v-btn block v-on:click="salvar()" color="primary">
        Salvar débito automático
      </v-btn>
    </form>

    <RegisterModoDePagamento v-bind:show.sync="dialogs.registerModoDePagamento" />

    <RegisterCategoria v-bind:show.sync="dialogs.registerCategoria" />
  </v-container>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import { required, decimal } from 'vuelidate/lib/validators'
  import { mapState } from 'vuex'
  import RegisterModoDePagamento from '@/components/RegisterModoDePagamento.vue'
  import RegisterCategoria from '@/components/RegisterCategoria.vue'

  export default {
    mixins: [validationMixin],
    name: 'InputDebitos',
    components: {
      RegisterModoDePagamento,
      RegisterCategoria,
    },

    async beforeCreate() {
      await Promise.all([
        this.$store.dispatch('categoria/get'),
        this.$store.dispatch('pagamento/get'),
      ])
    },

    props: {
      debito: {
        type: Object,
        default: function() {
          return {
            valor: null,
            categoria: null,
            modo_de_pagamento: null,
            dia: new Date().getDate(),
          }
        },
      },
    },

    data: () => ({
      dialogs: {
        registerModoDePagamento: false,
        registerCategoria: false,
      },
      icons: {
        modo_de_pagamento: 'credit_card',
        categoria: 'mdi-card-text-outline',
      },
    }),

    watch: {
      'debito.categoria'(newValue) {
        this.icons.categoria = newValue.icone
      },
      'debito.modo_de_pagamento'(newValue) {
        this.icons.modo_de_pagamento = newValue.icone
      },
    },

    methods: {
      salvar: async function() {
        this.$v.debito.$touch()
        if (this.$v.debito.$invalid) {
          return
        }
        if (this.debito.id !== null && this.debito.id !== undefined) {
          await this.$store.dispatch('debito/update', {
            id: this.debito.id,
            valor: this.debito.valor,
            categoria: this.debito.categoria,
            pagamento: this.debito.modo_de_pagamento,
            dia: this.debito.dia,
          })
        } else {
          await this.$store.dispatch('debito/create', {
            valor: this.debito.valor,
            categoria: this.debito.categoria,
            pagamento: this.debito.modo_de_pagamento,
            dia: this.debito.dia,
          })
          this.limpar()
          this.$refs.valor.focus()
        }
        this.$emit('update:show', false)
      },
      limpar: function() {
        this.$v.debito.$reset()
        this.debito.valor = null
      },
    },

    validations: {
      debito: {
        valor: { required, decimal },
        categoria: { required },
        modo_de_pagamento: { required },
        dia: { required },
      },
    },

    computed: {
      ...mapState({
        categorias: state => state.categoria.categorias,
        modos: state => state.pagamento.modos,
      }),
      dias() {
        let list = []
        for (let i = 1; i <= 31; i++) {
          list.push(i)
        }
        return list
      },
      valorErrors() {
        const errors = []
        if (!this.$v.debito.valor.$dirty) return errors
        !this.$v.debito.valor.required && errors.push('Insira um valor')
        !this.$v.debito.valor.decimal && errors.push('O valor deve seguir o formato 1234.56')
        return errors
      },
      categoriaErrors() {
        const errors = []
        if (!this.$v.debito.categoria.$dirty) return errors
        !this.$v.debito.categoria.required && errors.push('Selecione uma categoria')
        return errors
      },
      dataErrors() {
        const errors = []
        if (!this.$v.debito.dia.$dirty) return errors
        !this.$v.debito.dia.required && errors.push('Selecione um dia')
        return errors
      },
      modoErrors() {
        const errors = []
        if (!this.$v.debito.modo_de_pagamento.$dirty) return errors
        !this.$v.debito.modo_de_pagamento.required && errors.push('Selecione um modo de pagamento')
        return errors
      },
    },
  }
</script>

<style scoped lang="scss">
  button {
    min-height: 50px;
  }
  .prepend-text {
    heith: 24px;
    width: 24px;
    line-height: 24px;
    color: rgba(0, 0, 0, 0.54);
    padding-left: 0.15em;
  }
</style>
