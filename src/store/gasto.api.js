import axios from 'axios'

export default {
  namespaced: true,
  state: {
    gastos: [],
    tipos: ['Variável', 'Fixo', 'Renda'],
  },
  mutations: {
    // synchronous
    set(state, gastos) {
      state.gastos = gastos
    },
    push(state, gasto) {
      state.gastos.push(gasto)
    },
    removeById(state, id) {
      let indexToRemove = state.gastos.findIndex(gasto => gasto.id === id)
      if (indexToRemove !== -1) {
        state.gastos.splice(indexToRemove, 1)
      }
    },
    update(state, updatedGasto) {
      let indexToUpdate = state.gastos.findIndex(gasto => gasto.id === updatedGasto.id)
      if (indexToUpdate !== -1) {
        state.gastos.splice(indexToUpdate, 1, updatedGasto)
      }
    },
  },
  actions: {
    // asynchronous
    async get(context) {
      let response = await axios.get('/gastos')
      context.commit('set', response.data)
    },
    async create(context, { valor, data, categoria, pagamento, obs, tipo }) {
      return axios
        .post('/gastos', {
          valor: valor,
          data: data,
          idCategoria: categoria.id,
          idModoDePagamento: pagamento.id,
          obs: obs,
          tipo: tipo,
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
    async update(context, { id, valor, data, categoria, pagamento, obs, tipo }) {
      return axios
        .put(`/gastos/${id}`, {
          valor: valor,
          data: data,
          idCategoria: categoria.id,
          idModoDePagamento: pagamento.id,
          obs: obs,
          tipo: tipo,
        })
        .then(response => {
          context.commit('update', response.data)
        })
    },
    async delete(context, { id }) {
      return axios.delete(`/gastos/${id}`).then(() => {
        context.commit('removeById', id)
      })
    },
  },
  modules: {},
  getters: {},
}
