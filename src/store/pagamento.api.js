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
    update(state, updatedModo) {
      let indexToUpdate = state.modos.findIndex(modo => modo.id === updatedModo.id)
      if (indexToUpdate !== -1) {
        state.modos.splice(indexToUpdate, 1, updatedModo)
      }
    },
    removeById(state, id) {
      let indexToRemove = state.modos.findIndex(modo => modo.id === id)
      if (indexToRemove !== -1) {
        state.modos.splice(indexToRemove, 1)
      }
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
    async update(context, { id, nome, sigla, icone }) {
      return axios
        .put(`/modos-de-pagamento/${id}`, {
          nome: nome,
          sigla: sigla,
          icone: icone,
        })
        .then(response => {
          context.commit('update', response.data)
        })
    },
    async delete(context, { id, replaceId }) {
      return axios
        .delete(`/modos-de-pagamento/${id}`, {
          params: {
            substituirPor: replaceId,
          },
        })
        .then(() => {
          context.commit('removeById', id)
          if (replaceId !== undefined) {
            // refetch all Gastos
            context.dispatch('gasto/get', null, { root: true })
          }
        })
    },
  },
  modules: {},
  getters: {},
}
