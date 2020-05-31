<template>
  <div id="all-recipes" class="row">
    <div v-if="isLoading" class="col">
      <p class="text-dark text-center font-weight-bold">Loading recipes...</p>
    </div>
    <div v-else class="col">
      <div class="text-center mb-5">
        <div class="search shadow-sm mx-auto" :class="{ 'input-group': searchTerm }">
          <input v-model.trim="searchTerm" type="text" class="form-control" placeholder="Search term">
          <div class="input-group-append">
            <button v-if="searchTerm" @click="clearSearch" class="btn btn-outline-secondary" type="button" title="Clear search">&times;</button>
          </div>
        </div>
        <transition name="fade">
          <span v-if="noResults" class="no-results text-center text-secondary mt-5">No results for your search query :(</span>
        </transition>
      </div>
      <transition-group name="list" tag="div" class="recipe-grid">
        <div v-for="recipe in recipesReversed" :key="recipe.refId" class="recipe-card border border-secondary rounded">
          <clazy-load v-if="recipe.image" :src="recipe.image" class="clazy-container position-relative border-bottom border-secondary" is="VueClazyLoad">
            <transition name="fade">
              <img class="recipe-card-img" :src="recipe.image" crossorigin="anonymous">
            </transition>
            <transition name="fade" slot="placeholder">
              <div class="preloader">
                <div class="circle">
                  <div class="circle-inner"></div>
                </div>
              </div>
            </transition>
          </clazy-load>
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
import { VueClazyLoad } from 'vue-clazy-load';

export default {
  name: 'all-recipes',
  components: {
    VueClazyLoad
  },
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
  .no-results {
    position: absolute; /* prevent the page jumping from inserted <p> */
    left: 0;
    right: 0;
  }
  .fade-enter-active, .fade-leave-active {
    transition: all .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
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
  .clazy-container {
    height: 300px;
  }
  .recipe-card-img {
    object-fit: cover;
    width: 100%;
    max-height:300px;
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
  .list-enter, .list-leave-to {
    opacity: 0;
  }
  .list-move {
    transition: transform .5s;
  }
  /* preloader source: https://codepen.io/Alex-Miller/pen/qviHa */
  .preloader {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -25px 0 0 -25px;
    width: 50px;
    height: 50px;
    transition: all 100ms ease-in;
  }

  .preloader .circle,
  .preloader .circle .circle-inner {
    width: inherit;
    height: inherit;
    border-radius: 50%;
    background: linear-gradient(rgba(220, 220, 220, 1) -50%,rgba(220, 220, 220, 0) 60%);
  }

  .preloader .circle {
    animation: roll 6s linear infinite;
  }

  .preloader .circle .circle-inner {
    padding: 5px;
    animation: roll 2s linear infinite reverse;
  }

  .preloader .circle .circle-inner::after {
    content: '';
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #fff;
  }

  @keyframes roll {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

</style>