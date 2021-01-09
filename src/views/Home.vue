<template>
  <div>
    <InputGastos/>
  </div>
</template>

<script>
  // @ is an alias to /src
  import InputGastos from '@/components/InputGastos.vue'
  import Login from '@/components/Login.vue'
  import Register from '@/components/Register.vue'

  export default {
    components: {
      InputGastos,
      Login,
      Register,
    },
  }
</script>
