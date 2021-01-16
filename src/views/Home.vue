<template>
  <div>
    <v-tabs
      v-model="activeTab"
      background-color="primary"
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
      <v-tab-item value="tab-1">
        <InputGastos />
        <ListGastos />
      </v-tab-item>
      <v-tab-item value="tab-2">
        <Configurations />
      </v-tab-item>
      <v-tab-item value="tab-3">
        <Configurations />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
  // @ is an alias to /src
  import InputGastos from '@/components/InputGastos.vue'
  import ListGastos from '@/components/ListGastos.vue'
  import Configurations from '@/components/Configurations.vue'

  export default {
    components: {
      InputGastos,
      ListGastos,
      Configurations,
    },

    data: () => ({
      activeTab: null,
    }),
  }
</script>

<style scoped lang="scss">
  :root {
    min-height: 100%;
  }
</style>
