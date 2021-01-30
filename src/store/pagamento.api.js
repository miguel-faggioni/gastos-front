import axios from 'axios'

export default {
  namespaced: true,
  state: {
    modos: [],
    icones: [
      // https://materialdesignicons.com/
      'mdi-credit-card-outline', // cartão
      'mdi-credit-card-sync', // fatura
      'mdi-account-cash', // dinheiro vivo
      'mdi-piggy-bank', // savings
      'mdi-briefcase', // salário
      'mdi-cash-multiple', // dinheiro
      'mdi-cash-refund', // pagamento de dívida
      'mdi-cash-usd', // simples
      'mdi-currency-btc', // bitcoin
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
