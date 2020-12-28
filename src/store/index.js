import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import AuthAPI from './auth.api'
import CategoriaAPI from './categoria.api'
import PagamentoAPI from './pagamento.api'
import GastoAPI from './gasto.api'

export default new Vuex.Store({
  state: {},
  mutations: {
    // synchronous
  },
  actions: {
    // asynchronous
  },
  modules: {
    auth: AuthAPI,
    categoria: CategoriaAPI,
    pagamento: PagamentoAPI,
    gasto: GastoAPI,
  },
})
