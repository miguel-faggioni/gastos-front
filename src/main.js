import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import DatetimePicker from 'vuetify-datetime-picker'
import Vuelidate from 'vuelidate'
import './plugins/axios'
import './plugins/date'
import './plugins/array'
import './plugins/sentry'
import { VuePlausible } from 'vue-plausible'

Vue.use(Vuelidate)
Vue.use(DatetimePicker)
Vue.config.productionTip = false
Vue.use(VuePlausible, {
  hashMode: true,
  apiHost: 'https://analisar.coisa.online',
})
Vue.$plausible.enableAutoPageviews()

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
