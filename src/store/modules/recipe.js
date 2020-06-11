export default {
  strict: false,
  namespaced: true,

  state() {
    return {
      allRecipes: [],
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
    recipeCategory: state => state.recipeCategory,
    recipeDiet: state => state.recipeDiet
  },

  mutations: {
    SET_ALL_RECIPES(state, value) {
      state.allRecipes = value;
    },
  },

  actions: {
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

      })
      .catch((error) => {
        console.log('API error', error);
      })
    }
  }
};