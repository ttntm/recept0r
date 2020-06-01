import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import attemptToAuthoriseTokens from './helpers/authorise-tokens';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

store.dispatch("user/initAuth");

attemptToAuthoriseTokens();
