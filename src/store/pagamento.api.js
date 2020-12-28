import axios from 'axios'

export default {
  namespaced: true,
  state: {
    modos: [],
  },
  mutations: {
    // synchronous
    set(state, modos) {
      state.modos = modos
    },
  },
  actions: {
    // asynchronous
    async get(context) {
      let response = await axios.get('/modos-de-pagamento')
      context.commit('set',response.data)
    },
  },
  modules: {},
  getters: {},
}
