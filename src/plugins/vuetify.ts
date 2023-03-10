import Vue from 'vue';
import Vuetify, { colors } from 'vuetify/lib';
import '@mdi/font/css/materialdesignicons.css';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    dark: false,
    themes: {
      light: {
        //primary: colors.green.darken1
      }
    }
  },
});
