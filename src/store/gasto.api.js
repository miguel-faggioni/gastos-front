import axios from 'axios'

export default {
  namespaced: true,
  state: {
    gastos: [],
  },
  mutations: {
    // synchronous
    set(state, gastos) {
      state.gastos = gastos
    },
  },
  actions: {
    // asynchronous
    async get(context) {
      let response = await axios.get('/gastos')
      context.commit('set', response.data)
    },
    async create(context, { valor, data, categoria, pagamento }) {
      return axios.post('/gastos', {
        valor: valor,
        data: data,
        idCategoria: categoria.id,
        idModoDePagamento: pagamento.id,
      })
    },
    async deleteAll(context) {
      return axios.delete('/gastos').then(() => {
        context.commit('set', [])
      })
    },
    async downloadAll(context, { format }) {
      return axios.get(`/gastos/download/${format}`)
    },
  },
  modules: {},
  getters: {},
}