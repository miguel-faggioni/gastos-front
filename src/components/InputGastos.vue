<template>
  <v-container>
    <form>
      <v-row>
        <v-col>
          <v-text-field
            label="Valor"
            prefix="R$"
            v-model="gasto.valor"
            required
            :error-messages="valorErrors"
            @input="$v.gasto.valor.$touch()"
            @blur="$v.gasto.valor.$touch()"
            ref="valor"
            v-on:keyup.enter="$refs.categoria.focus()"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-select
            :items="categorias"
            label="Categoria"
            v-model="gasto.categoria"
            :prepend-icon="icons.categoria"
            return-object
            item-text="nome"
            required
            ref="categoria"
            :error-messages="categoriaErrors"
            @input="$v.gasto.categoria.$touch()"
            @blur="$v.gasto.categoria.$touch()"
            v-on:keyup.enter="$refs.modo.focus()"
          >
            <template v-slot:prepend-item>
              <v-list-item ripple @click="dialogs.registerCategoria = true">
                <v-list-item-content>
                  <v-list-item-title>
                    Nova categoria
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider class="mt-2"></v-divider>
            </template>
          </v-select>
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

          <v-select
            :items="modos"
            label="Modo de pagamento"
            v-model="gasto.modo_de_pagamento"
            return-object
            item-text="nome"
            :prepend-icon="icons.modo_de_pagamento"
            required
            ref="modo"
            :error-messages="modoErrors"
            @input="$v.gasto.modo_de_pagamento.$touch()"
            @blur="$v.gasto.modo_de_pagamento.$touch()"
          >
            <template v-slot:prepend-item>
              <v-list-item
                ripple
                @click="dialogs.registerModoDePagamento = true"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    Novo modo de pagamento
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider class="mt-2"></v-divider>
            </template>
          </v-select>
        </v-col>
        <v-col>
          <v-btn block v-on:click="salvar()" color="primary">
            Salvar gasto
          </v-btn>
        </v-col>
      </v-row>
    </form>

    <RegisterModoDePagamento
      v-bind:show.sync="dialogs.registerModoDePagamento"
    />

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
          }
        },
      },
    },

    data: () => ({
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
          })
        } else {
          await this.$store.dispatch('gasto/create', {
            valor: this.gasto.valor,
            categoria: this.gasto.categoria,
            pagamento: this.gasto.modo_de_pagamento,
            data: this.gasto.date,
          })
          this.limpar()
          this.$refs.valor.focus()
        }
        this.$emit('update:show', false)
      },
      limpar: function() {
        this.$v.gasto.$reset()
        this.gasto.valor = null
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
      }),
      valorErrors() {
        const errors = []
        if (!this.$v.gasto.valor.$dirty) return errors
        !this.$v.gasto.valor.required && errors.push('Insira um valor')
        !this.$v.gasto.valor.decimal &&
          errors.push('O valor deve seguir o formato 1234.56')
        return errors
      },
      categoriaErrors() {
        const errors = []
        if (!this.$v.gasto.categoria.$dirty) return errors
        !this.$v.gasto.categoria.required &&
          errors.push('Selecione uma categoria')
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
        !this.$v.gasto.modo_de_pagamento.required &&
          errors.push('Selecione um modo de pagamento')
        return errors
      },
    },
  }
</script>

<style scoped lang="scss">
  button {
    height: 100% !important;
  }
</style>
