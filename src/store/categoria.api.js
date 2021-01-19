import axios from 'axios'

export default {
  namespaced: true,
  state: {
    categorias: [],
    icones: [
      // https://materialdesignicons.com/
      'mdi-account-tie',
      'mdi-airplane',
      'mdi-aws',
      'mdi-car-side',
      'mdi-cart',
      'mdi-cookie-outline',
      'mdi-gas-station',
      'mdi-glass-wine',
      'mdi-brain',
    ],
  },
  mutations: {
    // synchronous
    set(state, categorias) {
      state.categorias = categorias
    },
    push(state, categoria) {
      state.categorias.push(categoria)
    },
  },
  actions: {
    // asynchronous
    async get(context) {
      let response = await axios.get('/categorias')
      context.commit('set', response.data)
    },
    async create(context, { nome, sigla, icone }) {
      return axios
        .post('/categorias', {
          nome: nome,
          sigla: sigla,
          icone: icone,
        })
        .then(response => {
          context.commit('push', response.data)
        })
    },
  },
  modules: {},
  getters: {},
}
