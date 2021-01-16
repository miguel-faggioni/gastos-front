import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

// console.log(colors)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: colors.lightGreen.darken1,
        secondary: colors.lightGreen.lighten1,
        accent: colors.green.base,
      }
    }
  }
})
