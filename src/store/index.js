import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import recipe from './modules/recipe'
import user from './modules/user'

Vue.use(Vuex);

export default new Vuex.Store({
  strict: false, //process.env.NODE_ENV !== "production", -> see: https://github.com/chiubaca/vue-netlify-fauna-starter-kit/issues/12
  modules: {
    app,
    recipe,
    user
  }
});