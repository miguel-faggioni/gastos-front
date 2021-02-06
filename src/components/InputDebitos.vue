<template>
  <v-container>
    <form>
      <v-row>
        <v-col>
          <v-text-field
            label="Valor"
            v-model="debito.valor"
            required
            type="number"
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
          <v-autocomplete
            v-model="debito.categoria"
            label="Categoria"
            :items="categorias"
            :prepend-icon="icons.categoria"
            return-object
            item-text="nome"
            :filter="customFilter"
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
          </v-autocomplete>
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
          <v-autocomplete
            :items="modos"
            label="Modo de pagamento"
            :filter="customFilter"
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
          </v-autocomplete>
        </v-col>
      </v-row>

      <v-row>
        <v-col class="mb-3 py-0">
          <v-btn text block x-small @click="showMore = !showMore">
            mostrar {{ showMore ? 'menos' : 'mais' }}
          </v-btn>
        </v-col>
      </v-row>

      <v-row v-if="showMore">
        <v-col class="py-0">
          <v-select :items="tipos" label="Tipo" v-model="debito.tipo"></v-select>
        </v-col>
      </v-row>

      <v-row v-if="showMore">
        <v-col class="py-0">
          <v-textarea v-model="debito.obs" label="Observações"></v-textarea>
        </v-col>
      </v-row>

      <v-btn block v-on:click="salvar()" color="primary" class="min-height">
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
      if (this.debito.categoria === null) {
        let lastCategoria = localStorage.getItem('debito.lastCategoria')
        if (
          'lastCategoria' in localStorage &&
          lastCategoria !== undefined &&
          lastCategoria !== null
        ) {
          this.debito.categoria = JSON.parse(lastCategoria)
        }
      }
      if (this.debito.modo_de_pagamento === null) {
        let lastModo = localStorage.getItem('debito.lastModo')
        if ('lastModo' in localStorage && lastModo !== undefined && lastModo !== null) {
          this.debito.modo_de_pagamento = JSON.parse(lastModo)
        }
      }
      if (this.debito.tipo === null) {
        let lastTipo = localStorage.getItem('debito.lastTipo')
        if ('lastTipo' in localStorage && lastTipo !== undefined && lastTipo !== null) {
          this.debito.tipo = JSON.parse(lastTipo)
        } else {
          this.debito.tipo = 'Fixo'
        }
      }
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
            tipo: null,
            obs: '',
          }
        },
      },
    },

    data: () => ({
      showMore: false,
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
          localStorage.setItem('debito.lastCategoria', JSON.stringify(this.debito.categoria))
          localStorage.setItem('debito.lastModo', JSON.stringify(this.debito.modo_de_pagamento))
          this.limpar()
          this.$refs.valor.focus()
        }
        this.$emit('update:show', false)
      },
      limpar: function() {
        this.$v.debito.$reset()
        this.debito.valor = null
        this.debito.obs = ''
      },
      customFilter: function(item, queryText) {
        const textOne = item.nome.toLowerCase()
        const textTwo = item.sigla.toLowerCase()
        const searchText = queryText.toLowerCase()

        return textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1
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
        tipos: state => state.gasto.tipos,
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
  .min-height {
    min-height: 50px;
  }
  .prepend-text {
    heith: 24px;
    width: 24px;
    line-height: 24px;
    color: rgba(0, 0, 0, 0.54);
    padding-left: 0.15em;
    font-weight: bold;
  }
</style>
