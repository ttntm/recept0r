import netlifyIdentity from "netlify-identity-widget";

netlifyIdentity.init();

const currentUser = netlifyIdentity.currentUser();

const state = () => ({
  currentUser: currentUser
});

const mutations = {
  SET_USER(state, currentUser) {
    state.currentUser = currentUser;
  }
};

const actions = {
  setUser: ({ commit }, payload) => {
    commit('SET_USER', payload)
  }
};

export default {
    namespaced: true,
    state,
    actions,
    mutations
}