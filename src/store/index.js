import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import recipe from './modules/recipe'
import user from './modules/user'

import createMultiTabState from 'vuex-multi-tab-state';

import createPersistedState from 'vuex-persistedstate';
import SecureLS from 'secure-ls'; // https://github.com/softvar/secure-ls

var ls = new SecureLS({ isCompression: false });

Vue.use(Vuex);

export default new Vuex.Store({
  strict: false, //process.env.NODE_ENV !== "production", -> see: https://github.com/chiubaca/vue-netlify-fauna-starter-kit/issues/12
  modules: {
    app,
    recipe,
    user
  },
  plugins: [
    createMultiTabState({
      key: 'recept0r-tabs',
      // statesPaths: ['user'], // name/s of the states to be synchronized with dot notation. If the param is not provided, the whole state of your app will be in sync. Defaults to []
    }),
    createPersistedState({
      key: 'recept0r',
      paths: ['user'],
      reducer (val) {
        if(!val.user.currentUser) { // return empty state when user logged out
          return {}
        }
        return val
      },
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key),
      },
    }),
  ],
});