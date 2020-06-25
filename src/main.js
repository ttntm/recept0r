import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import attemptToAuthoriseTokens from './helpers/authorise-tokens';
import VueShortkey from 'vue-shortkey';
import './registerServiceWorker'

import(/* webpackPreload: true */ '@/assets/styles/index.css');

Vue.config.productionTip = false;

// GLOBAL DIRECTIVE - click outside element should close the respective element
// source: https://tahazsh.com/detect-outside-click-in-vue
let handleOutsideClick;
Vue.directive('closable', {
  bind (el, binding, vnode) {
    handleOutsideClick = (e) => {
      e.stopPropagation();
      const { handler, exclude } = binding.value;
      let clickedOnExcludedEl = false;
      exclude.forEach(refName => {
        if (!clickedOnExcludedEl) {
          const excludedEl = vnode.context.$refs[refName];
          clickedOnExcludedEl = excludedEl.contains(e.target);
        }
      })
      if (!el.contains(e.target) && !clickedOnExcludedEl) {
        vnode.context[handler]();
      }
    }
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
  },
  unbind () {
    document.removeEventListener('click', handleOutsideClick);
    document.removeEventListener('touchstart', handleOutsideClick);
  }
})

//GLOBAL "blur" directive
Vue.directive('blur', {
  inserted: function (el) {
    el.onclick = (ev) => ev.target.blur();
  }
});

Vue.use(VueShortkey);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

store.dispatch("user/initAuth");

attemptToAuthoriseTokens();