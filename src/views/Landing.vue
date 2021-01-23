<template>
  <div class="d-flex flex-column primary lighten-3" id="landing">
    <v-container class="d-flex justify-space-between">
      <router-link to="/welcome/login">Login</router-link> |
      <router-link to="/welcome/register">Cadastrar-se</router-link> |
      <router-link to="/welcome/about">Sobre o projeto</router-link>
      <!-- <router-link to="/welcome/feedback">Fale conosco</router-link> -->
    </v-container>

    <router-view class="my-auto px-10"></router-view>
  </div>
</template>

<script>
  export default {
    mounted() {
      let token = localStorage.getItem('token')
      if ('token' in localStorage && token !== undefined && token !== null) {
        this.$store.commit('auth/setToken', token)
        this.$router.push({
          path: '/',
        })
      }
    },
  }
</script>

<style scoped lang="scss">
  #landing {
    height: 100%;
  }
</style>
