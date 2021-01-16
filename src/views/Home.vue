<template>
  <div>
    <v-tabs
      v-model="activeTab"
      background-color="light-green"
      fixed-tabs
      centered
      dark
    >
      <v-tabs-slider></v-tabs-slider>

      <v-tab href="#tab-1">
        <!-- <v-icon>mdi-currency-usd-circle-outline</v-icon> -->
        <!-- <v-icon>mdi-currency-usd</v-icon> -->
        <!-- <v-icon>mdi-currency-brl</v-icon> -->
        <v-icon>monetization_on</v-icon>
      </v-tab>

      <v-tab href="#tab-2">
        <v-icon>history</v-icon>
      </v-tab>

      <v-tab href="#tab-3">
        <v-icon>miscellaneous_services</v-icon>
        <!-- <v-icon>settings</v-icon> -->
        <!-- <v-icon>build</v-icon> -->
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="activeTab">
      <v-tab-item
        v-for="i in 3"
        :key="i"
        :value="'tab-' + i"
      >
        <InputGastos/>
        <!-- <v-card flat>
             <v-card-text>{{ text }}</v-card-text>
             </v-card> -->
      </v-tab-item>
    </v-tabs-items>

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

    data: () => ({
      activeTab: null,
    })
  }
</script>
