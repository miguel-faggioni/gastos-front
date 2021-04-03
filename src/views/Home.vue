<template>
  <div>
    <v-tabs v-model="activeTab" background-color="primary" centered dark>
      <v-tab :to="{ path: '/', query: { tab: 'gastos' } }">
        <v-icon>monetization_on</v-icon>
      </v-tab>

      <v-tab :to="{ path: '/', query: { tab: 'debitos' } }">
        <v-icon>history</v-icon>
      </v-tab>

      <v-tab :to="{ path: '/', query: { tab: 'graficos' } }">
        <v-icon>mdi-chart-line</v-icon>
      </v-tab>

      <v-tab :to="{ path: '/', query: { tab: 'config' } }">
        <v-icon>miscellaneous_services</v-icon>
      </v-tab>
    </v-tabs>

    <v-tabs-items :value="tab">
      <v-tab-item value="gastos">
        <InputGastos />
        <ListGastos />
      </v-tab-item>

      <v-tab-item value="debitos">
        <InputDebitos />
        <v-divider></v-divider>
        <ListDebitos />
      </v-tab-item>

      <v-tab-item value="graficos">
        <Analysis />
      </v-tab-item>

      <v-tab-item value="config">
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
      if (lastActiveTab !== null) {
        this.activeTab = lastActiveTab
      } else {
        this.activeTab = 'gastos'
      }
      this.tab = this.activeTab
    },

    computed: {
      tab: {
        set(tab) {
          this.$router.replace({ query: { ...this.$route.query, tab } })
        },
        get() {
          return this.$route.query.tab
        },
      },
    },

    watch: {
      activeTab() {
        localStorage.setItem('home.lastActiveTab', this.tab)
      },
    },
  }
</script>

<style scoped lang="scss">
  :root {
    min-height: 100%;
  }
</style>
