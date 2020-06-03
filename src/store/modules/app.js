export default {
  strict: false,
  namespaced: true,

  state() {
    return {
      isDevEnvironment: false,
      siteURL: 'recept0r.com',
      menuOpen : false
    };
  },

  getters: {
    isDevEnvironment: state => state.isDevEnvironment,
    siteURL: state => state.siteURL,
    menuState: state => state.menuOpen
  },

  mutations: {
    SET_DEV_ENV(state, value) {
      state.isDevEnvironment = value;
    },
    SET_SITE_URL(state, value) {
      state.siteURL = value;
    },
    SET_MENU_OPEN(state, value) {
      state.menuOpen = value;
    }
  },

  actions: {
    toggleMenu({ commit }, newState) {
      commit('SET_MENU_OPEN', newState);
    }
  }
};