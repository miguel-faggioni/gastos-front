<template>
  <v-container>
    <form>
      <v-row>
        <v-col>
          <v-text-field
            label="Valor"
            v-model="gasto.valor"
            required
            type="number"
            :error-messages="valorErrors"
            @input="$v.gasto.valor.$touch()"
            @blur="$v.gasto.valor.$touch()"
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
            v-model="gasto.categoria"
            label="Categoria"
            :items="categorias"
            :prepend-icon="icons.categoria"
            return-object
            item-text="nome"
            :filter="customFilter"
            required
            ref="categoria"
            :error-messages="categoriaErrors"
            @input="$v.gasto.categoria.$touch()"
            @blur="$v.gasto.categoria.$touch()"
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
          <v-datetime-picker
            label="Data"
            v-model="gasto.date"
            dateFormat="dd/MM/yyyy"
            timeFormat="HH'h'mm"
            clearText="Limpar"
            :text-field-props="datetimepickerProps"
            :time-picker-props="tpProps"
            :date-picker-props="dpProps"
            required
            :error-messages="dataErrors"
            @input="$v.gasto.date.$touch()"
            @blur="$v.gasto.date.$touch()"
          ></v-datetime-picker>
        </v-col>

        <v-col>
          <v-autocomplete
            :items="modos"
            label="Modo de pagamento"
            v-model="gasto.modo_de_pagamento"
            :filter="customFilter"
            return-object
            item-text="nome"
            :prepend-icon="icons.modo_de_pagamento"
            required
            ref="modo"
            :error-messages="modoErrors"
            @input="$v.gasto.modo_de_pagamento.$touch()"
            @blur="$v.gasto.modo_de_pagamento.$touch()"
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
          <v-select :items="tipos" label="Tipo" v-model="gasto.tipo"></v-select>
        </v-col>
      </v-row>

      <v-row v-if="showMore">
        <v-col class="py-0">
          <v-textarea v-model="gasto.obs" label="Observações"></v-textarea>
        </v-col>
      </v-row>

      <v-btn block v-on:click="salvar()" color="primary" class="min-height">
        Salvar gasto
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
    name: 'InputGastos',
    components: {
      RegisterModoDePagamento,
      RegisterCategoria,
    },

    async beforeCreate() {
      await Promise.all([
        this.$store.dispatch('categoria/get'),
        this.$store.dispatch('pagamento/get'),
      ])
      if (this.gasto.categoria === null) {
        let lastCategoria = localStorage.getItem('gasto.lastCategoria')
        if (
          'lastCategoria' in localStorage &&
          lastCategoria !== undefined &&
          lastCategoria !== null
        ) {
          this.gasto.categoria = JSON.parse(lastCategoria)
        }
      }
      if (this.gasto.modo_de_pagamento === null) {
        let lastModo = localStorage.getItem('gasto.lastModo')
        if ('lastModo' in localStorage && lastModo !== undefined && lastModo !== null) {
          this.gasto.modo_de_pagamento = JSON.parse(lastModo)
        }
      }
      if (this.gasto.tipo === null) {
        let lastTipo = localStorage.getItem('gasto.lastTipo')
        if ('lastTipo' in localStorage && lastTipo !== undefined && lastTipo !== null) {
          this.gasto.tipo = JSON.parse(lastTipo)
        } else {
          this.gasto.tipo = 'Variável'
        }
      }
    },

    props: {
      gasto: {
        type: Object,
        default: function() {
          return {
            valor: null,
            categoria: null,
            modo_de_pagamento: null,
            date: new Date(),
            obs: '',
            tipo: null,
          }
        },
      },
    },

    data: () => ({
      showMore: false,
      datetimepickerProps: {
        prependIcon: 'mdi-calendar',
      },
      tpProps: {
        format: '24hr',
      },
      dpProps: {
        locale: 'pt-BR',
      },
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
      'gasto.categoria'(newValue) {
        this.icons.categoria = newValue.icone
      },
      'gasto.modo_de_pagamento'(newValue) {
        this.icons.modo_de_pagamento = newValue.icone
      },
    },

    methods: {
      salvar: async function() {
        this.$v.gasto.$touch()
        if (this.$v.gasto.$invalid) {
          return
        }
        if (this.gasto.id !== null && this.gasto.id !== undefined) {
          await this.$store.dispatch('gasto/update', {
            id: this.gasto.id,
            valor: this.gasto.valor,
            categoria: this.gasto.categoria,
            pagamento: this.gasto.modo_de_pagamento,
            data: this.gasto.date,
            obs: this.gasto.obs,
            tipo: this.gasto.tipo,
          })
        } else {
          await this.$store.dispatch('gasto/create', {
            valor: this.gasto.valor,
            categoria: this.gasto.categoria,
            pagamento: this.gasto.modo_de_pagamento,
            data: this.gasto.date,
            obs: this.gasto.obs,
            tipo: this.gasto.tipo,
          })
          localStorage.setItem('gasto.lastCategoria', JSON.stringify(this.gasto.categoria))
          localStorage.setItem('gasto.lastModo', JSON.stringify(this.gasto.modo_de_pagamento))
          this.limpar()
          this.$refs.valor.focus()
        }
        this.$emit('update:show', false)
      },
      limpar: function() {
        this.$v.gasto.$reset()
        this.gasto.valor = null
        this.gasto.obs = ''
      },
      customFilter: function(item, queryText) {
        const textOne = item.nome.toLowerCase()
        const textTwo = item.sigla.toLowerCase()
        const searchText = queryText.toLowerCase()

        return textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1
      },
    },

    validations: {
      gasto: {
        valor: { required, decimal },
        categoria: { required },
        modo_de_pagamento: { required },
        date: { required },
      },
    },

    computed: {
      ...mapState({
        categorias: state => state.categoria.categorias,
        modos: state => state.pagamento.modos,
        tipos: state => state.gasto.tipos,
      }),
      valorErrors() {
        const errors = []
        if (!this.$v.gasto.valor.$dirty) return errors
        !this.$v.gasto.valor.required && errors.push('Insira um valor')
        !this.$v.gasto.valor.decimal && errors.push('O valor deve seguir o formato 1234.56')
        return errors
      },
      categoriaErrors() {
        const errors = []
        if (!this.$v.gasto.categoria.$dirty) return errors
        !this.$v.gasto.categoria.required && errors.push('Selecione uma categoria')
        return errors
      },
      dataErrors() {
        const errors = []
        if (!this.$v.gasto.date.$dirty) return errors
        !this.$v.gasto.date.required && errors.push('Selecione uma data')
        return errors
      },
      modoErrors() {
        const errors = []
        if (!this.$v.gasto.modo_de_pagamento.$dirty) return errors
        !this.$v.gasto.modo_de_pagamento.required && errors.push('Selecione um modo de pagamento')
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
