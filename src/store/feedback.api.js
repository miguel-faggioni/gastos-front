import axios from 'axios'

export default {
  namespaced: true,
  state: {},
  mutations: {
    // synchronous
  },
  actions: {
    // asynchronous
    async submit(context, { text }) {
      let response = await axios.post('/auth/feedback', { text: text })
    },
  },
  modules: {},
  getters: {},
}
