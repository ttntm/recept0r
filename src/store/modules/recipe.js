export default {
  strict: false,
  namespaced: true,

  state() {
    return {
      allRecipes: [],
      filterActive: false,
      filterCache: [], //used to store a copy of the current 'allRecipes' state before applying a filter; to be restored into 'allRecipes' when clearing filter selection
      filterMode: null,
      recipeCategory: [
        'Bread',
        'Salad',
        'Dessert',
        'Drink',
        'Main',
        'Snack',
        'Soup',
        'Pastry',
        'Other'
      ],
      recipeDiet: [
        'Keto',
        'None',
        'Vegetarian',
        'Vegan'
      ]
    }
  },

  getters: {
    allRecipes: state => state.allRecipes,
    filterActive: state => state.filterActive,
    filterCache: state => state.filterCache,
    filterMode: state => state.filterMode,
    recipeCategory: state => state.recipeCategory,
    recipeDiet: state => state.recipeDiet
  },

  mutations: {
    SET_ALL_RECIPES(state, value) {
      state.allRecipes = value;
    },
    SET_FILTER_STATE(state, value) {
      state.filterActive = value;
    },
    SET_FILTER_CACHE(state, value) {
      state.filterCache = value;
    },
    SET_FILTER_MODE(state, value) {
      state.filterMode = value;
    },
  },

  actions: {
    applyFilter({ commit, getters}, args) {
      let filtered = new Array;
      let mode = args[0].toLowerCase();
      let selection = args[1].toLowerCase();

      const fState = getters.filterActive;
      const fMode = getters.filterMode;
      const recipes = getters.allRecipes;
      const fromCache = getters.filterCache;

      console.log("applying filter", mode, selection);

      const doFilter = (input) => {
        return input.filter(item => {
          if(item[mode]) {
            return item[mode].toLowerCase().indexOf(selection) !== -1 ? true : false
          } else { return false }
        });
      }

      //if there is NO active filter
      if(!fState) {
        commit('SET_FILTER_STATE', true); //set 'filterActive' flag, so we know for the next selection
        commit('SET_FILTER_MODE', mode);
        filtered = doFilter(recipes); //apply to the current state of 'allRecies'
      } else { //if 'filterActive' !== false, i.e. a filter has already been applied
        if(fMode === mode) { //changing within current mode, i.e. in need of content that's only available from the cache
          filtered = doFilter(fromCache);
        } else { //adding a second condition to the filter
          filtered = doFilter(recipes); //apply to the current state of 'allRecies'
        }
      }

      commit('SET_ALL_RECIPES', filtered);
    },

    clearFilter({ commit, getters}) {
      const fromCache = getters.filterCache;
      commit('SET_ALL_RECIPES', fromCache);
      commit('SET_FILTER_STATE', false);
      commit('SET_FILTER_MODE', null);
    },

    getAllRecipes({ commit, rootGetters }) {
      const functions = rootGetters['app/functions'];
      fetch(functions.readAll)
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        const recipes = res.map((item) => {
          let temp = Object.assign({}, item.data); //create new object from DB data
          temp.refId = item.ref['@ref'].id; // add the database ID for edit/delete operations
          return temp; //return newly created temp object
        });

        commit('SET_ALL_RECIPES', recipes);
        commit('SET_FILTER_CACHE', recipes); //cache the current 'allRecipes' data, so we can restore it without another DB query

      })
      .catch((error) => {
        console.log("API error", error);
      })
    },

    updateRecipe({ dispatch, rootGetters }, recipeData) {
      const rId = recipeData.refId;
      const functions = rootGetters['app/functions'];
      let msg = {};

      fetch(`${functions.edit}/${rId}`, {
        body: JSON.stringify(recipeData),
        method: 'POST'
      })
      .then(response => {
        msg = { text: `Recipe "${recipeData.title}" successfully updated.`, type: 'success' };
        console.log("Success:", response);
        dispatch('app/sendToastMessage', msg, { root: true });
      })
      .catch((error) => {
        msg = { text: `Error updating recipe "${recipeData.title}".`, type: 'error' };
        console.log("API error:", error);
        dispatch('app/sendToastMessage', msg, { root: true });
      })
    }
  }
};