<template>
  <v-container class="d-flex flex-column align-start min-height">
    <v-btn
      v-on:click="downloadData()"
      :loading="loading.downloadData"
      :disabled="loading.downloadData"
      outlined
      class="mb-8 mt-2 full-width"
      color="primary"
    >
      <v-icon left>
        mdi-cash-multiple
      </v-icon>
      Baixar gastos
    </v-btn>
    <v-btn
      v-on:click="eraseData()"
      :loading="loading.eraseData"
      :disabled="loading.eraseData"
      outlined
      class="mb-5 full-width"
      color="error"
    >
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
  export default {
    data: () => ({
      snackbar: {
        msg: 'Erro ao realizar logout',
        show: false,
        timeout: 2000,
      },
      loading: {
        downloadData: false,
        eraseData: false,
      },
    }),
    methods: {
      logout: function() {
        this.$store.dispatch('auth/logout')
        this.$router.push({
          name: 'Login',
        })
      },
      downloadData: async function() {
        console.log('ue')
        this.loading.downloadData = true
        try {
          await this.$store.dispatch('gasto/downloadAll', { format: 'csv' })
        } catch (err) {
          this.snackbar.msg = 'Erro ao tentar baixar gastos'
          this.snackbar.show = true
        }
        this.loading.downloadData = false
      },
      eraseData: async function() {
        this.loading.eraseData = true
        try {
          await this.$store.dispatch('gasto/deleteAll')
        } catch (err) {
          this.snackbar.msg = 'Erro ao tentar apagar gastos'
          this.snackbar.show = true
        }
        this.loading.eraseData = false
      },
    },
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
