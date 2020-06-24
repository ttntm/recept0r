<template>
  <div id="all-recipes" class="">
    <div v-if="isLoading" class="text-center my-12">
      <img src="@/assets/loading.svg" alt="Loading..." class="mx-auto">
      <p class="text-cool-gray-500 mt-12">Loading recipes...</p>
    </div>
    <div v-else class="">
      <!-- SEARCH -->
      <div class="w-full xl:w-2/3 flex flex-row justify-center mb-12 mx-auto">
        <div class="search shadow-sm flex-1" :class="{ 'input-group': searchTerm }">
          <label for="search-input" class="sr-only">Search</label>
          <input v-model.trim="searchTerm" v-shortkey.focus="['s']" type="text" class="w-full search-input" name="search-input" placeholder="Search term">
          <div class="input-group-append">
            <button v-if="searchTerm" @click="clearSearch()" class="btn border-0 font-bold text-lg px-4" type="button" title="Clear search">&times;</button>
          </div>
        </div>
        <button
          class="w-auto flex-0 btn btn-gray ml-2 lg:ml-6 mx-auto"
          @click="filterAction()"
          v-blur
        >
          <span class="icono-filter inline-block lg:hidden"></span>
          <span class="hidden lg:inline-block">{{ filterBtnText }}</span>
        </button>
      </div>
      <transition name="slide-fade">
        <RecipeFilter v-if="showFilterSelect" @closeFilter="filterAction()" class="mb-12" />
      </transition>
      <transition name="fade">
        <span v-if="noResults" class="no-results text-center text-cool-gray-500">No results for your search query :(</span>
      </transition>
      <!-- RECIPE GRID -->
      <transition-group name="list" tag="div" class="recipe-grid">
        <div v-for="recipe in recipesReversed" :key="recipe.refId" class="recipe-card rounded-lg">
          <clazy-load v-if="recipe.image" :src="recipe.image" class="clazy-container relative" is="VueClazyLoad">
            <transition name="fade">
              <router-link :to="{name: 'recipe', params: {id: recipe.id, refId: recipe.refId}}" class="img-link focus:shadow-none">
                <img class="recipe-card-img" :src="recipe.image" crossorigin="anonymous" :alt="recipe.title">
              </router-link>
            </transition>
            <transition name="fade" slot="placeholder">
              <div class="preloader">
                <img src="@/assets/loading.svg">
              </div>
            </transition>
          </clazy-load>
          <div class="p-8">
            <router-link :to="{name: 'recipe', params: {id: recipe.id, refId: recipe.refId}}" tabindex="-1">
              <h3 class="font-bold text-2xl tracking-wide text-blue-500 hover:text-blue-600">{{ recipe.title }}</h3>
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
    VueClazyLoad,
    'RecipeFilter': () => import('@/components/RecipeFilter.vue')
  },
  data() {
    return {
      searchTerm: '',
      showFilterSelect: false
    };
  },
  created() {
    this.getAllRecipes();
  },
  computed: {
    ...mapGetters('recipe',[
      'allRecipes',
      'filterActive'
    ]),
    filterBtnText() {
      if(!this.showFilterSelect) {
        return "Show Filter";
      } else {
        return "Hide Filter";
      }
    },
    isLoading() {
      if(!this.filterActive) {
        return this.allRecipes.length > 0 ? false : true;
      } else { return false }
    },
    noResults() {
      if(this.searchTerm !== '' || this.filterActive) {
        return this.recipesReversed.length > 0 ? false : true;
      } else { return false }
    },
    recipesReversed() {
      var vm = this;
      return this.allRecipes.filter(item => {
        if (item.title.toLowerCase().indexOf(vm.searchTerm.toLowerCase()) === -1) { //if there was no match for the title...
          return item.description.toLowerCase().indexOf(vm.searchTerm.toLowerCase()) !== -1 ? true : false //...evaluate the description
        } else { return true }
      }).reverse();
    }
  },
  methods: {
    ...mapActions('recipe', [
      'getAllRecipes',
      'clearFilter'
    ]),
    clearSearch() {
      this.searchTerm = '';
    },
    filterAction() {
      this.showFilterSelect = !this.showFilterSelect;
      if(!this.showFilterSelect) {
        this.clearFilter();
      }
    }
  }
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
    transition: box-shadow .35s ease-in-out;
  }
  .clazy-container {
    height: 300px;
  }
  .recipe-card-img {
    @apply w-full rounded-tl-lg rounded-tr-lg object-cover;
    height: 299px;
    max-height: 299px;
  }
  @media screen and (min-width:1024px) {
    .recipe-card:hover {
      /* transform: translateY(-0.25rem); */
      transform: scale(1.015);
      transition: transform .2s ease;
    }
  }
  .img-link:focus > img {
    @apply shadow-outline;
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
  .preloader {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -25px 0 0 -25px;
    width: 50px;
    height: 50px;
  }
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: all 0.5s;
  }
  .slide-fade-enter,
  .slide-fade-leave-to {
    transform: translateY(-200px);
    opacity: 0;
  }
  /* icon source -> https://github.com/saeedalipoor/icono */
  [class*=icono-] {
    @apply relative text-blue-500;
    vertical-align: middle;
    text-align: left;
    text-indent: -9999px;
    direction: ltr;
  }
  .icono-filter {
    @apply w-0 h-0;
    border: 8px solid;
    border-bottom: none;
    border-left-color: transparent;
    border-right-color: transparent;
    padding: 3px;
    box-shadow: inset 0 7px;
  }
</style>