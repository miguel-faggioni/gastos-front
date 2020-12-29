<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <InputGastos msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
  // @ is an alias to /src
  import InputGastos from '@/components/InputGastos.vue'

  export default {
    name: 'Home',
    components: {
      InputGastos,
    },
  }
</script>
