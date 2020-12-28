import axios from 'axios'

export default {
  namespaced: true,
  state: {
    token: null,
  },
  mutations: {
    // synchronous
    setToken(state, token) {
      state.token = token
    },
  },
  actions: {
    // asynchronous
    async login(context, { email, senha }) {
      let response = await axios.post('/auth',{email:email,senha:senha})
      localStorage.setItem('token',response.data.token)
      context.commit('setToken',response.data.token)
    },
  },
  modules: {},
  getters: {},
}
