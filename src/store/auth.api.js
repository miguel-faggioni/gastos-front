import axios from 'axios'
import * as Sentry from '@sentry/vue'

const parseJwt = token => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    return null
  }
}

export default {
  namespaced: true,
  state: {
    token: null,
  },
  mutations: {
    // synchronous
    setToken(state, token) {
      state.token = token
      let jwt = parseJwt(token)
      if (jwt) {
        Sentry.setUser({ id: jwt.id })
      }
    },
    unsetToken(state) {
      state.token = null
    },
  },
  actions: {
    // asynchronous
    async login(context, { email, senha }) {
      let response = await axios.post('/auth', { email: email, senha: senha })
      localStorage.setItem('token', response.data.token)
      context.commit('setToken', response.data.token)
    },
    async logout(context) {
      localStorage.removeItem('token')
      context.commit('unsetToken')
    },
    async register(context, { nome, email, senha }) {
      let response = await axios
        .post('/auth/register', {
          nome: nome,
          email: email,
          senha: senha,
        })
        .then(() => {
          return context.dispatch('login', {
            email: email,
            senha: senha,
          })
        })
    },
  },
  modules: {},
  getters: {
    isAuthenticated: state => {
      return state.token !== null && state.token !== undefined
    },
  },
}
