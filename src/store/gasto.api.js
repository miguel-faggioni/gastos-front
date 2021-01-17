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
    push(state, gasto) {
      state.gastos.push(gasto)
    },
  },
  actions: {
    // asynchronous
    async get(context) {
      let response = await axios.get('/gastos')
      context.commit('set', response.data)
    },
    async create(context, { valor, data, categoria, pagamento }) {
      return axios
        .post('/gastos', {
          valor: valor,
          data: data,
          idCategoria: categoria.id,
          idModoDePagamento: pagamento.id,
        })
        .then(response => {
          context.commit('push', response.data)
        })
    },
    async deleteAll(context) {
      return axios.delete('/gastos').then(() => {
        context.commit('set', [])
      })
    },
    async downloadAll(context, { format, startDate, endDate }) {
      let params = {}

      if (startDate !== undefined) {
        params['startDate'] = startDate
      }
      if (endDate !== undefined) {
        params['endDate'] = endDate
      }

      return axios({
        url: `/gastos/download/${format}`,
        method: 'get',
        responseType: 'blob',
        params: params,
      }).then(response => {
        const blob = new Blob([response.data])
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = 'Gastos.' + format
        link.click()
        URL.revokeObjectURL(link.href)
      })
    },
    async update(context, { id, valor, data, categoria, pagamento }) {
      return axios.put(`/gastos/${id}`, {
        valor: valor,
        data: data,
        idCategoria: categoria.id,
        idModoDePagamento: pagamento.id,
      })
    },
    async delete(context, { id }) {
      return axios.delete(`/gastos/${id}`)
    },
  },
  modules: {},
  getters: {},
}
