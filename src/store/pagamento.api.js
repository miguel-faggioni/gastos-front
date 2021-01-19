import axios from 'axios'

export default {
  namespaced: true,
  state: {
    modos: [],
    icones: [
      // https://materialdesignicons.com/
      'mdi-account-cash',
      'mdi-account-clock',
      'mdi-account-switch',
      'mdi-briefcase',
      'mdi-cash-multiple',
      'mdi-cash-refund',
      'mdi-cash-usd',
      'mdi-cash-usd-outline',
      'mdi-credit-card-outline',
      'mdi-credit-card-sync',
      'mdi-currency-btc',
    ],
  },
  mutations: {
    // synchronous
    set(state, modos) {
      state.modos = modos
    },
    push(state, modo) {
      state.modos.push(modo)
    },
  },
  actions: {
    // asynchronous
    async get(context) {
      let response = await axios.get('/modos-de-pagamento')
      context.commit('set', response.data)
    },
    async create(context, { nome, sigla, icone }) {
      return axios
        .post('/modos-de-pagamento', {
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
