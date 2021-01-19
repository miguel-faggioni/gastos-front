<template>
  <v-container>
    <form>
      <v-row>
        <v-col>
          <v-text-field
            label="Valor"
            prefix="R$"
            v-model="valor"
            required
            :error-messages="valorErrors"
            @input="$v.valor.$touch()"
            @blur="$v.valor.$touch()"
            ref="valor"
            v-on:keyup.enter="$refs.categoria.focus()"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-select
            :items="categorias"
            label="Categoria"
            v-model="categoria"
            :prepend-icon="icons.categoria"
            return-object
            item-text="nome"
            required
            ref="categoria"
            :error-messages="categoriaErrors"
            @input="$v.categoria.$touch()"
            @blur="$v.categoria.$touch()"
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
            v-model="data"
            dateFormat="dd/MM/yyyy"
            timeFormat="HH'h'mm"
            clearText="Limpar"
            :text-field-props="datetimepickerProps"
            :time-picker-props="tpProps"
            :date-picker-props="dpProps"
            required
            :error-messages="dataErrors"
            @input="$v.data.$touch()"
            @blur="$v.data.$touch()"
          ></v-datetime-picker>

          <v-select
            :items="modos"
            label="Modo de pagamento"
            v-model="modoDePagamento"
            return-object
            item-text="nome"
            :prepend-icon="icons.modoDePagamento"
            required
            ref="modo"
            :error-messages="modoErrors"
            @input="$v.modoDePagamento.$touch()"
            @blur="$v.modoDePagamento.$touch()"
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
          <v-btn block v-on:click="inserir()" color="primary">
            Inserir gasto
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

    data: () => ({
      valor: null,
      categoria: null,
      modoDePagamento: null,
      data: new Date(),
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
        modoDePagamento: 'credit_card',
        categoria: 'mdi-card-text-outline',
      },
    }),

    watch: {
      categoria(newValue) {
        this.icons.categoria = newValue.icone
      },
      modoDePagamento(newValue) {
        this.icons.modoDePagamento = newValue.icone
      },
    },

    methods: {
      inserir: function() {
        this.$v.$touch()
        if (this.$v.$invalid) {
          return
        }
        this.$store.dispatch('gasto/create', {
          valor: this.valor,
          categoria: this.categoria,
          pagamento: this.modoDePagamento,
          data: this.data,
        })
        this.limpar()
        this.$refs.valor.focus()
      },
      limpar: function() {
        this.$v.$reset()
        this.valor = null
      },
    },

    validations: {
      valor: { required, decimal },
      categoria: { required },
      modoDePagamento: { required },
      data: { required },
    },

    computed: {
      ...mapState({
        categorias: state => state.categoria.categorias,
        modos: state => state.pagamento.modos,
      }),
      valorErrors() {
        const errors = []
        if (!this.$v.valor.$dirty) return errors
        !this.$v.valor.required && errors.push('Insira um valor')
        !this.$v.valor.decimal &&
          errors.push('O valor deve seguir o formato 1234.56')
        return errors
      },
      categoriaErrors() {
        const errors = []
        if (!this.$v.categoria.$dirty) return errors
        !this.$v.categoria.required && errors.push('Selecione uma categoria')
        return errors
      },
      dataErrors() {
        const errors = []
        if (!this.$v.data.$dirty) return errors
        !this.$v.data.required && errors.push('Selecione uma data')
        return errors
      },
      modoErrors() {
        const errors = []
        if (!this.$v.modoDePagamento.$dirty) return errors
        !this.$v.modoDePagamento.required &&
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
