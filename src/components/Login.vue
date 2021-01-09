<template>
  <v-container>
    <form>
      <v-row>
        <v-text-field
          label="Email"
          v-model="email"
          required
          :error-messages="emailErrors"
          @input="$v.email.$touch()"
          @blur="$v.email.$touch()"
          ref="email"
          v-on:keyup.enter="$refs.senha.focus()"
        ></v-text-field>
      </v-row>
      <v-row>
        <v-text-field
          label="Senha"
          v-model="senha"
          required
          :error-messages="senhaErrors"
          @input="$v.senha.$touch()"
          @blur="$v.senha.$touch()"
          ref="senha"
          type="password"
          v-on:keyup.enter="login()"
        ></v-text-field>
      </v-row>
      <v-row class="mt-5">
        <v-btn block v-on:click="login()" color="primary">
          Login
        </v-btn>
      </v-row>
    </form>
    <v-snackbar
      v-model="snackbar.show"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.msg }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="snackbar.show = false"
        >
          OK
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
  import { validationMixin} from 'vuelidate'
  import { required, email} from 'vuelidate/lib/validators'

  export default{
    mixins: [validationMixin],

    data: () => ({
      email: null,
      senha: null,
      snackbar: {
        msg: 'Erro ao realizar login',
        show: false,
        timeout: 2000
      }
    }),

    methods: {
      login: async function(){
        this.$v.$touch()
        if(this.$v.$invalid){
          return
        }
        try{
          await this.$store.dispatch('auth/login', { email: this.email, senha: this.senha })
        }catch(err){
          this.snackbar.show = true
          return
        }
        this.$router.push({
          path: '/'
        })
      }
    },

    validations: {
      email: {required,email},
      senha: {required},
    },

    computed: {
      emailErrors() {
        const errors = []
        if (!this.$v.email.$dirty) return errors
        !this.$v.email.required && errors.push('Insira um email')
        !this.$v.email.email && errors.push('Insira um email válido')
        return errors
      },
      senhaErrors() {
        const errors = []
        if (!this.$v.senha.$dirty) return errors
        !this.$v.senha.required && errors.push('Insira a senha')
        return errors
      },
    }
  }
</script>

<style scoped lang="scss">
</style>
