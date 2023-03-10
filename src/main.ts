import Vue from 'vue';
import Vuelidate from 'vuelidate';
import VueMoment from 'vue-moment';

import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import VueHelper from './plugins/vue-helper';
import App from './App.vue';

import './styles/global.scss';

import WaterMark from './components/WaterMark.vue';

class AppBootstrap {
  constructor() {
    Vue.config.productionTip = false;

    Vue.use(Vuelidate);
    Vue.use(VueMoment);
    Vue.use(VueHelper);  
    
    Vue.component('water-mark', WaterMark);

    new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app');
  }
}



new AppBootstrap()



