import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)
//axios.defaults.baseURL = process.env.VUE_APP_API_URL || ''
axios.defaults.baseURL = 'https://api.coisa.online:5001/'

/* *
axios.defaults.baseURL = 'https://localhost:5001/'
/* */

axios.interceptors.request.use(
  config => {
    // Do something before request is sent
    // If request is different than any of the URLS in urlsExcludedForBearerHeader
    // then send Authorization header with token from localstorage
    const urlsExcludedForBearerHeader = [
      '/auth',
      '/auth/register',
      '/health/uptime',
      '/health/version',
      '/health/ping',
      //`${window.location.origin}/version.json`
    ]
    if (urlsExcludedForBearerHeader.indexOf(config.url) === -1) {
      config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    }
    //config.headers.common['Content-Type'] = 'application/json'
    return config
  },
  error => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
axios.interceptors.response.use(
  response => {
    // Do something with response data
    // Checks if app is being used in mobile
    /*
    if (
      response.config.url !== `${process.env.VUE_APP_API_URL}/token` &&
      response.config.url !== `${window.location.origin}/version.json`
    ) {
      checkForUpdates()
      checkIfTokenNeedsRefresh()
    }
    */
    return response
  },
  error => {
    // Do something with response error
    return Promise.reject(error)
  }
)

// eslint-disable-next-line no-shadow
Plugin.install = Vue => {
  Vue.axios = axios
  window.axios = axios
  /*Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return axios
      },
    },
    $axios: {
      get() {
        return axios
      },
    },
  })*/
}

Vue.use(Plugin)

export default Plugin
