<template>
  <div id="all-recipes" class="row">
    <div v-for="recipe in recipes" :key="recipe.refId" class="col-sm-12 col-md-6 p-2">
      <div class="recipe-card border border-secondary rounded p-4 mb-2">
        <h3 class="font-weight-bold text-dark">{{ recipe.title }}</h3>
        <p class="text-secondary my-3">{{ recipe.description }}</p>
        <hr class="my-3" />
        <router-link :to="{name: 'recipe', params: {id: recipe.id, refId: recipe.refId}}" class="btn btn-outline-secondary">Show Recipe &gt;</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'all-recipes',
  props: {
    updateList: Boolean,
    fPath: Object
  },
  methods: {
    getRecipes() {
      const functions = this.fPath;
      fetch(`${functions.readAll}`)
        .then((response) => {
          return response.json();
        }).then((res) => {
          this.recipes = res.map((e) => {
            let temp = Object.assign({}, e.data); //create new object from DB data
            temp.refId = e.ref['@ref'].id; // add the database ID for edit/delete operations
            return temp; //return newly created temp object
          });
      }).catch((error) => {
        console.log('API error', error);
      })
    }
  },
  created() {
    this.getRecipes();
  },
  watch: {
    updateList: () => {
      if(this.updateList) { //if an update is neccessary...
        console.log("updating...");
        this.getRecipes(); //...do it!
        this.updateList = false; // and make sure you let others know it's done
        console.log("...updated!");
      }
    }
  },
  data() {
    return {
      recipes: []
    };
  }
};
</script>

<style scoped>
  .recipe-card:hover {
    box-shadow: 0 0.45rem 0.9rem rgba(0,0,0,.1);
    transition: all .35s ease;
  }
</style>