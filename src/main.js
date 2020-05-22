import Vue from 'vue';
import App from './App.vue';

import router from "./router";

// import Default from "./layouts/Default.vue";

// Vue.component("default-layout", Default);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
