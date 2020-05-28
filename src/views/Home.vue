<template>
  <div id="all-recipes" class="row">
    <div v-if="isLoading" class="col">
      <p class="text-dark text-center font-weight-bold">Loading recipes...</p>
    </div>
    <div v-else class="recipe-grid col">
      <div v-for="recipe in recipesReversed" :key="recipe.refId" class="">
        <div class="recipe-card border border-secondary rounded mb-2">
          <div v-if="recipe.image" class="recipe-card-img border-bottom border-secondary bg-light" v-bind:style="{ 'background-image': 'url(' + recipe.image + ')' }"><!-- image --></div>
          <div class="p-4">
            <h3 class="font-weight-bold text-dark">{{ recipe.title }}</h3>
            <p class="text-secondary my-3">{{ recipe.description }}</p>
            <hr class="my-3" />
            <router-link :to="{name: 'recipe', params: {id: recipe.id, refId: recipe.refId}}" class="btn btn-outline-secondary">Show Recipe &gt;</router-link>
          </div>
        </div>
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
  },
  computed: {
    isLoading() {
      return this.recipes.length > 0 ? false : true;
    },
    recipesReversed() {
      return this.recipes.slice().reverse();
    }
  }
};
</script>

<style scoped>
  .recipe-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1rem;
  }

  @media(max-width:768px) {
    .recipe-grid {
        grid-template-columns: 1fr;
    }
  }
  .recipe-card:hover {
    box-shadow: 0 0.45rem 0.9rem rgba(0,0,0,.1);
    transition: all .35s ease;
  }
  .recipe-card-img {
    background-size:cover;
    background-position: center;
    height:300px;
    opacity: 0.75;
    transition: all .5s ease-in-out;
  }
  .recipe-card:hover .recipe-card-img {
    opacity: 1;
    transition: all .5s ease-in-out;
  }
</style>