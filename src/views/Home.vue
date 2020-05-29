<template>
  <div id="all-recipes" class="row">
    <div v-if="isLoading" class="col">
      <p class="text-dark text-center font-weight-bold">Loading recipes...</p>
    </div>
    <div v-else class="col">
      <div class="text-center mb-5">
        <div class="search shadow-sm mx-auto" :class="{ 'input-group': searchTerm !== '' }">
          <input v-model.trim="searchTerm" type="text" class="form-control" placeholder="Search term">
          <div class="input-group-append">
            <button v-if="searchTerm !== ''" @click="clearSearch" class="btn btn-outline-secondary" type="button" title="Clear search">&times;</button>
          </div>
        </div>
        <transition name="fade">
          <p v-if="noResults" class="text-center text-secondary mt-3">No results for your search query :(</p>
        </transition>
      </div>
      <transition-group name="list" tag="div" class="recipe-grid">
        <div v-for="recipe in recipesReversed" :key="recipe.refId" class="recipe-card border border-secondary rounded">
          <div v-if="recipe.image" class="recipe-card-img border-bottom border-secondary bg-light" v-bind:style="{ 'background-image': 'url(' + recipe.image + ')' }"><!-- image --></div>
          <div class="p-4">
            <h3 class="font-weight-bold text-dark">{{ recipe.title }}</h3>
            <p class="text-secondary my-3">{{ recipe.description }}</p>
            <hr class="my-3" />
            <router-link :to="{name: 'recipe', params: {id: recipe.id, refId: recipe.refId}}" class="btn btn-outline-secondary">Show Recipe &gt;</router-link>
          </div>
        </div>
      </transition-group>
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
    },
    clearSearch() {
      this.searchTerm = '';
    },
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
      recipes: [],
      searchTerm: ''
    };
  },
  computed: {
    isLoading() {
      return this.recipes.length > 0 ? false : true;
    },
    recipesReversed() {
      var vm = this
      return this.recipes.filter(function (item) {
        if (item.title.toLowerCase().indexOf(vm.searchTerm.toLowerCase()) === -1) { //if there was no match for the title...
          return item.description.toLowerCase().indexOf(vm.searchTerm.toLowerCase()) !== -1 //...evaluate the description
        } else { return true }
      }).reverse();
    },
    noResults() {
      if(this.searchTerm !== '') {
        return this.recipesReversed.length > 0 ? false : true;
      } else { return false }
    }
  }
};
</script>

<style scoped>
  .search {
    width: 50%;
  }
  .fade-enter-active, .fade-leave-active {
    transition: all .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(30px);
  }
  .recipe-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1rem;
  }
  @media(max-width:768px) {
    .search {
      width: 100%;
    }
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
  .list-enter-active, .list-leave-active {
    transition: all .5s;
  }
  .list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
    opacity: 0;
    /* transform: translateY(30px); */
  }
  .list-move {
    transition: transform .5s;
  }
</style>