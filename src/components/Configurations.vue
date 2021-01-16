<template>
  <v-container class="d-flex flex-column align-start min-height">
    <v-btn v-on:click="downloadData()" outlined class="mb-8 mt-2 full-width" color="primary">
      <v-icon left>
        mdi-cash-multiple
      </v-icon>
      Baixar gastos
    </v-btn>
    <v-btn v-on:click="eraseData()" outlined class="mb-5 full-width" color="error">
      <v-icon left>
        mdi-cash-remove
      </v-icon>
      Apagar gastos
    </v-btn>
    <v-btn
      class="mt-auto align-self-center"
      text
      color="error"
      v-on:click="logout()"
    >
      Logout
    </v-btn>
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
  export default {
    data: () => ({
      snackbar: {
        msg: 'Erro ao realizar logout',
        show: false,
        timeout: 2000
      }
    }),
    methods: {
      logout: function() {
        this.$store.dispatch('auth/logout')
        this.$router.push({
          name: 'Login',
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .min-height {
    min-height: 500px;
  }
  .full-width {
    width: 100%;
  }
</style>
