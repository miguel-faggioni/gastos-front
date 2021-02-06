import axios from 'axios'

export default {
  namespaced: true,
  state: {
    debitos: [],
  },
  mutations: {
    // synchronous
    set(state, debitos) {
      state.debitos = debitos
    },
    push(state, debito) {
      state.debitos.splice(0, 0, debito)
    },
    removeById(state, id) {
      let indexToRemove = state.debitos.findIndex(debito => debito.id === id)
      if (indexToRemove !== -1) {
        state.debitos.splice(indexToRemove, 1)
      }
    },
    update(state, updatedDebito) {
      let indexToUpdate = state.debitos.findIndex(debito => debito.id === updatedDebito.id)
      if (indexToUpdate !== -1) {
        state.debitos.splice(indexToUpdate, 1, updatedDebito)
      }
    },
  },
  actions: {
    // asynchronous
    async get(context) {
      let response = await axios.get('/debitos-automaticos')
      context.commit('set', response.data)
    },
    async create(context, { valor, dia, categoria, pagamento, tipo, obs }) {
      return axios
        .post('/debitos-automaticos', {
          valor: valor,
          dia: dia,
          idCategoria: categoria.id,
          idModoDePagamento: pagamento.id,
          tipo: tipo,
          obs: obs,
        })
        .then(response => {
          context.commit('push', response.data)
        })
    },
    async update(context, { id, valor, dia, categoria, pagamento, tipo, obs }) {
      return axios
        .put(`/debitos-automaticos/${id}`, {
          valor: valor,
          dia: dia,
          idCategoria: categoria.id,
          idModoDePagamento: pagamento.id,
          tipo: tipo,
          obs: obs,
        })
        .then(response => {
          context.commit('update', response.data)
        })
    },
    async delete(context, { id }) {
      return axios.delete(`/debitos-automaticos/${id}`).then(() => {
        context.commit('removeById', id)
      })
    },
  },
  modules: {},
  getters: {},
}
