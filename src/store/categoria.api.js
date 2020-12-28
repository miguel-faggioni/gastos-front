import axios from 'axios'

export default {
  namespaced: true,
  state: {
    categorias: [],
  },
  mutations: {
    // synchronous
    set(state, categorias) {
      state.categorias = categorias
    },
  },
  actions: {
    // asynchronous
    async get(context) {
      let response = await axios.get('/categorias')
      context.commit('set',response.data)
    },
  },
  modules: {},
  getters: {},
}
