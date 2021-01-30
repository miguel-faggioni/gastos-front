import axios from 'axios'

export default {
  namespaced: true,
  state: {
    categorias: [],
    icones: [
      // https://materialdesignicons.com/
      'mdi-home', // aluguel
      'mdi-silverware-variant', // alimentação
      'mdi-cart', // compras
      'mdi-glass-wine', // álcool
      'mdi-glass-mug-variant', // álcool
      'mdi-car-side', // transporte
      'mdi-gas-station', // transporte
      'mdi-gamepad-variant', // jogos
      'mdi-sofa-single', // lazer
      'mdi-asterisk', // outros
      'mdi-account-tie', // salário
      'mdi-desktop-tower-monitor', // salário
      'mdi-airplane', // viagens
      'mdi-image-filter-drama', // SaaS
      'mdi-tshirt-crew', // roupas
      'mdi-smoking', // tabaco
      'mdi-mushroom-outline', // drogas
      'mdi-pill', // drogas
      'mdi-heart-pulse', // saúde
      'mdi-hospital-box-outline', // saúde
      'mdi-paw', // animais
      'mdi-brain', // educação
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
