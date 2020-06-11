<template>
  <div id="all-recipes" class="">
    <p v-if="isLoading" class="text-blue-600 text-center font-bold">Loading recipes...</p>
    <div v-else class="">
      <!-- SEARCH -->
      <div class="text-center pb-12 mb-12">
        <div class="search shadow-sm mx-auto" :class="{ 'input-group': searchTerm }">
          <input v-model.trim="searchTerm" type="text" class="w-full search-input" placeholder="Search term">
          <div class="input-group-append">
            <button v-if="searchTerm" @click="clearSearch()" class="btn border-0 font-bold text-lg px-4" type="button" title="Clear search">&times;</button>
          </div>
        </div>
        <transition name="fade">
          <span v-if="noResults" class="no-results text-center text-cool-gray-500 mt-6">No results for your search query :(</span>
        </transition>
      </div>
      <!-- RECIPE GRID -->
      <transition-group name="list" tag="div" class="recipe-grid">
        <div v-for="recipe in recipesReversed" :key="recipe.refId" class="recipe-card rounded-lg">
          <clazy-load v-if="recipe.image" :src="recipe.image" class="clazy-container relative" is="VueClazyLoad">
            <transition name="fade">
              <router-link :to="{name: 'recipe', params: {id: recipe.id, refId: recipe.refId}}">
                <img class="recipe-card-img" :src="recipe.image" crossorigin="anonymous">
              </router-link>
            </transition>
            <transition name="fade" slot="placeholder">
              <div class="preloader">
                <div class="circle">
                  <div class="circle-inner"></div>
                </div>
              </div>
            </transition>
          </clazy-load>
          <div class="p-8">
            <router-link :to="{name: 'recipe', params: {id: recipe.id, refId: recipe.refId}}">
              <h3 class="font-bold text-2xl tracking-wide text-blue-500 hover:text-blue-700">{{ recipe.title }}</h3>
            </router-link>
            <p class="text-blue-600 mt-4">{{ recipe.description }}</p>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { VueClazyLoad } from 'vue-clazy-load';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'all-recipes',
  components: {
    VueClazyLoad
  },
  data() {
    return {
      searchTerm: ''
    };
  },
  computed: {
    ...mapGetters('recipe',['allRecipes']),
    isLoading() {
      return this.allRecipes.length > 0 ? false : true;
    },
    noResults() {
      if(this.searchTerm !== '') {
        return this.recipesReversed.length > 0 ? false : true;
      } else { return false }
    },
    recipesReversed() {
      var vm = this;
      return this.allRecipes.filter(item => {
        if (item.title.toLowerCase().indexOf(vm.searchTerm.toLowerCase()) === -1) { //if there was no match for the title...
          return item.description.toLowerCase().indexOf(vm.searchTerm.toLowerCase()) !== -1 //...evaluate the description
        } else { return true }
      }).reverse();
    }
  },
  methods: {
    ...mapActions('recipe', [
      'getAllRecipes',
    ]),
    clearSearch() {
      this.searchTerm = '';
    },
  },
  created() {
    this.getAllRecipes();
  },

};
</script>

<style lang="postcss" scoped>
  .search {
    @apply w-1/2 shadow-sm bg-gray-500 rounded-lg;
  }
  .search-input {
    @apply rounded-lg bg-gray-500 px-3 py-2;
    z-index: 3;
  }
  .search-input:focus {
    outline: 0;
    @apply shadow-outline;
  }
  .input-group {
    @apply relative flex items-stretch;
  }
  .input-group .search-input:focus {
    @apply rounded-tr-none rounded-br-none;
  }
  .input-group-append {
    @apply flex;
  }
  .input-group-append button {
    @apply relative rounded-tl-none rounded-bl-none shadow-none bg-gray-500;
    z-index: 2;
  }
  .no-results {
    @apply absolute left-0 right-0;
  }
  .fade-enter-active, .fade-leave-active {
    transition: all .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .recipe-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 2rem;
  }
  @media(max-width:768px) {
    .search {
      @apply w-full;
    }
    .recipe-grid {
      grid-template-columns: 1fr;
    }
  }
  @media(min-width:768px) and (max-width:1024px) {
    .recipe-grid {
      grid-template-columns: 1fr 1fr;
    }
  }
  .recipe-card {
    @apply bg-gray-500 shadow-sm;
  }
  .recipe-card:hover {
    box-shadow: 0 0.45rem 0.9rem rgba(0,0,0,.1);
    transition: all .35s ease-in-out;
  }
  .clazy-container {
    height: 300px;
  }
  .recipe-card-img {
    @apply w-full rounded-tl-lg rounded-tr-lg object-cover;
    height: 299px;
    max-height: 299px;
    transition: all .5s ease-in-out;
  }
  @media screen and (min-width:1024px) {
    .recipe-card:hover {
      transform: translateY(-0.25rem);
      transition: all .35s ease-in-out;
    }
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