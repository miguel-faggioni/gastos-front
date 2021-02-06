<template>
  <div>
    <v-tabs v-model="activeTab" background-color="primary" fixed-tabs centered dark>
      <v-tab href="#tab-1">
        <v-icon>monetization_on</v-icon>
      </v-tab>

      <v-tab href="#tab-2">
        <v-icon>history</v-icon>
      </v-tab>

      <v-tab href="#tab-3">
        <v-icon>mdi-chart-line</v-icon>
      </v-tab>

      <v-tab href="#tab-4">
        <v-icon>miscellaneous_services</v-icon>
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="activeTab">
      <v-tab-item value="tab-1">
        <InputGastos />
        <ListGastos />
      </v-tab-item>

      <v-tab-item value="tab-2">
        <InputDebitos />
        <v-divider></v-divider>
        <ListDebitos />
      </v-tab-item>

      <v-tab-item value="tab-3">
        <Analysis />
      </v-tab-item>

      <v-tab-item value="tab-4">
        <Configurations />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
  // @ is an alias to /src
  import InputGastos from '@/components/InputGastos.vue'
  import ListGastos from '@/components/ListGastos.vue'
  import InputDebitos from '@/components/InputDebitos.vue'
  import ListDebitos from '@/components/ListDebitos.vue'
  import Configurations from '@/components/Configurations.vue'
  import Analysis from '@/components/Analysis.vue'

  export default {
    components: {
      InputGastos,
      ListGastos,
      InputDebitos,
      ListDebitos,
      Configurations,
      Analysis,
    },

    data: () => ({
      activeTab: null,
    }),

    mounted() {
      let lastActiveTab = localStorage.getItem('home.lastActiveTab')
      this.activeTab = lastActiveTab
    },

    watch: {
      activeTab(newValue) {
        localStorage.setItem('home.lastActiveTab', newValue)
      },
    },
  }
</script>

<style scoped lang="scss">
  :root {
    min-height: 100%;
  }
</style>
