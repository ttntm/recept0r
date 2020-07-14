<template>
  <div id="my-recipes" class="w-full lg:w-4/5 flex flex-col mx-auto">
    <h3 class="text-center mb-8">{{ username }}'s Recipes</h3>
    <div v-if="!myRecipes" class="text-center">
      <img src="@/assets/loading.svg" alt="Loading..." class="mx-auto">
      <p class="text-cool-gray-500 mt-12">Loading recipe data...</p>
    </div>
    <div v-if="myRecipes.length === 0" class="text-center">
      <p class="">It seems like you haven't created any recipes yet...</p>
      <p class="mb-12">How about giving it a try?</p>
      <router-link
        :to="{name: 'create'}"
        class="btn btn-gray"
      >&plus;Create</router-link>
    </div>
    <div v-else class="mb-12">
      <h4 class="text-center mb-8">Sort Recipes</h4>
      <div class="flex flex-row flex-wrap justify-evenly mdd:justify-between">
        <button-sort @click.native="sortMyRecipes(['date','desc'])" :sortState="sortState" sortData="date" sortType="desc">By newest</button-sort>
        <button-sort @click.native="sortMyRecipes(['date','asc'])" :sortState="sortState" sortData="date" sortType="asc">By oldest</button-sort>
        <button-sort @click.native="sortMyRecipes(['abc','asc'])" :sortState="sortState" sortData="abc" sortType="asc">ABC...</button-sort>
        <button-sort @click.native="sortMyRecipes(['abc','desc'])" :sortState="sortState" sortData="abc" sortType="desc">ZYX...</button-sort>
      </div>
    </div>
    <div v-for="(recipe, index) in myRecipes" :key="index" class="list-card flex flex-col md:flex-row mb-8">
      <clazy-load v-if="recipe.image" :src="recipe.image" class="w-full md:w-1/3 relative" is="VueClazyLoad" style="height:200px;">
        <transition name="fade">
          <img :src="recipe.image" crossorigin="anonymous" :alt="recipe.title" class="w-full rounded-t-lg md:rounded-t-none md:rounded-l-lg img-cover">
        </transition>
        <transition name="fade" slot="placeholder">
          <div class="preloader">
            <img src="@/assets/loading.svg" alt="Loading...">
          </div>
        </transition>
      </clazy-load>
      <div class="w-full md:w-auto flex flex-col flex-grow justify-center p-4 pt-8 md:p-0 md:pl-12">
        <h4 class="text-2xl">{{ recipe.title }}</h4>
        <p class="md:m-0">{{ recipe.description }}</p>
      </div>
      <div class="w-full md:w-auto flex flex-row md:flex-col md:justify-center items-center pb-8 px-4 md:p-0 md:pr-8">
        <router-link :to="{name: 'recipe', params: {id: recipe.id, refId: recipe.refId}}" class="btn-outline">
          View/Edit
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonSort from '@/components/ButtonSort.vue';
import { VueClazyLoad } from 'vue-clazy-load';
import { mapGetters } from 'vuex';

//store myRecipes[...] before any sorting is applied
//created() returns recipes sorted "date asc (old -> new)" [date = number, thus increases] from vuex/FaunaDB
const cache = [];

export default {
  name: 'my-recipes',
  components: {
    ButtonSort,
    VueClazyLoad
  },
  data() {
    return {
      myRecipes: null,
      sortState: []
    }
  },
  created() {
    const usr = this.currentUser.email;
    if(this.allRecipes.length > 0) {
      //check vuex store first, in case user came from /home and already has cached the recipes
      console.log("Trying to obtain recipe data from store...");
      this.myRecipes = this.allRecipes.filter(rec => rec.owner === usr);
      console.log("Data obtained from store :)");
    } else {
      //user came from somewhere else, therefore we need to query the DB (less data IO than simply getting all recipes)
      console.log("...no matches in the store, obtaining from DB now...");
      this.getMyRecipes(usr);
    }
    if(this.myRecipes.length > 0) {
      //if we have got the user's recipes
      cache.push(...this.myRecipes); //fill the cache with fresh data
      this.sortMyRecipes(['date','desc']);
    }
  },
  computed: {
    ...mapGetters('user',[
      'currentUser',
      'loggedIn'
    ]),
    ...mapGetters('recipe',['allRecipes']),
    functions() {
      return this.$store.getters['app/functions']
    },
    username() {
      return this.currentUser.user_metadata.full_name;
    }
  },
  watch: {
    loggedIn: {
      handler() {
        if(!this.loggedIn) {
          this.$router.push({ name: 'home' });
        }
      }
    }
  },
  methods: {
    getMyRecipes(user) {
      fetch(`${this.functions.readByUser}/${user}`, {
        method: 'POST',
      })
      .then(response => {
        return response.json();
      })
      .then((res) => {
        const recipes = res.map((item) => {
          let temp = Object.assign({}, item.data); //create new object from DB data
          temp.refId = item.ref['@ref'].id; // add the database ID for edit/delete operations
          return temp; //return newly created temp object
        });

        this.myRecipes = recipes;
        console.log("Data obtained from DB :)");

      })
      .catch((error) => {
        console.log("API error", error);
      })
    },
    sortMyRecipes(mode) {
      this.sortState = mode;
      let sData = mode[0];
      let sType = mode[1];

      //generic sorting function for object keys
      const objSort = (field, reverse, primer) => {
        const key = primer ?
          function(x) {
            return primer(x[field])
          } :
          function(x) {
            return x[field]
          };
        reverse = !reverse ? 1 : -1;

        return function(a, b) {
          return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
      }

      switch(sData) {
        case 'date':
          //need to use the cached vuex/fauna response here; recipe objects don't have a 'date' property, date relies on DB timeline/chronology atm
          if(sType === 'asc') {
            this.myRecipes = new Array(...cache);
          }
          if(sType === 'desc') {
            this.myRecipes = new Array(...cache);
            this.myRecipes.reverse();
          }
          break;

        case 'abc':
          if(sType === 'asc') {
            this.myRecipes = this.myRecipes.sort(objSort('title', false, (a) =>  a.toUpperCase()));
          }
          if(sType === 'desc') {
            this.myRecipes = this.myRecipes.sort(objSort('title', true, (a) =>  a.toUpperCase()));
          }
          break;
      }
    },
  }
}
</script>

<style lang="postcss" scoped>
  .list-card {
    @apply flex-no-wrap bg-gray-500 rounded-lg border border-transparent;
  }
  .list-card:hover {
    @apply border-cool-gray-500 shadow;
  }
  .img-cover {
    @apply object-cover;
    height: 200px;
    max-height: 200px;
  }
  .btn-outline {
    @apply block font-bold border border-blue-500 text-blue-500 rounded-lg shadow-sm px-6 py-2;
  }
  .btn-outline:hover, .btn-outline:focus {
    @apply bg-cool-gray-500 border-cool-gray-500 shadow-none;
  }
  .btn-outline:focus {
    @apply outline-none shadow-outline;
  }
  .preloader {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -25px 0 0 -25px;
    width: 50px;
    height: 50px;
  }
  .fade-enter-active, .fade-leave-active {
    transition: all .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>