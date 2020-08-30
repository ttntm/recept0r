<template>
  <div id="recipe" class="w-full xl:w-4/5 flex flex-row flex-wrap mx-auto">
    <div v-if="!readSuccess" class="w-full">
      <div v-if="!errorMsg" class="text-center my-12">
        <img src="@/assets/loading.svg" alt="Loading..." class="mx-auto">
        <p class="text-cool-gray-500 mt-12">Loading recipe data...</p>
      </div>
      <div v-else v-html="errorMsg" class="text-center my-12" />
    </div>
    <div v-if="readSuccess" class="w-full lg:w-3/5">
      <h4 v-if="editing" class="mb-4">Image</h4>
      <img v-if="recipe.image" class="w-full rounded-lg shadow-sm mb-4" :src="recipe.image" :alt="recipe.title" key="image">
      <recipe-image v-if="editing" :recipe="recipe" @image:update="imageUpdate" />
    </div>
    <div v-if="readSuccess" class="w-full lg:w-2/5 lg:pl-8">
      <div>
        <h2 class="mt-4 lg:mt-8 mb-4">
          <span v-if="!editing">
            {{ recipe.title }}
          </span>
          <span v-else>
            <span class="block mb-4">Recipe Title</span>
            <input type="text" v-model="recipe.title" ref="recipeTitle" class="form-control">
          </span>
        </h2>
        <div class="mb-8">
          <p v-if="!editing" class="text-blue-500 m-0">{{ recipe.description }}</p>
          <input v-else type="text" v-model="recipe.description" class="form-control">
        </div>
        <div class="flex flex-row flex-no-wrap border-t border-b border-cool-gray-500 my-4 py-4">
          <div v-if="!editing" class="flex-1 flex flex-row items-center justify-center mr-4">
            <img src="@/assets/portions.svg" class="mr-4">
            <p class="text-blue-500 mb-0">{{ recipe.portions }}</p>
          </div>
          <div v-else class="flex-1 mr-4">
            <label class="text-cool-gray-500 text-xs">Portions</label>
            <input type="text" v-model="recipe.portions" class="form-control text-sm mr-4" placeholder="Portions; how many people does this recipe serve?">
          </div>
          <div v-if="!editing" class="flex-1 flex flex-row items-center justify-center border-l border-cool-gray-500">
            <img src="@/assets/duration.svg" class="mr-4">
            <p class="text-blue-500 mb-0">{{ recipe.duration }}</p>
          </div>
          <div v-else class="flex-1">
            <label class="text-cool-gray-500 text-xs">Duration</label>
            <input type="text" v-model="recipe.duration" class="form-control text-sm" placeholder="Duration; how long does it take to cook this?">
          </div>
        </div>
        <div>
          <p v-if="!editing" class="text-blue-500 font-semibold mb-2">
            <span class="inline-block text-cool-gray-500" style="width: 6rem">Diet:</span>
            {{ recipe.diet }}
          </p>
          <RecipeDiet v-else :diet="recipe.diet" @diet:update="dietUpdate" class="relative mb-4" />
        </div>
        <div>
          <p v-if="!editing" class="text-blue-500 font-semibold mb-4">
            <span class="inline-block text-cool-gray-500" style="width: 6rem">Category:</span>
            {{ recipe.category }}
          </p>
          <RecipeCategory v-else :category="recipe.category" @category:update="categoryUpdate" class="relative mb-4" />
        </div>
      </div>
    </div>
    <div v-if="readSuccess" class="w-full lg:w-3/5 order-2 lg:order-1">
      <recipe-editor :editing="editing" :editorContent="recipe.body" @editor:update="editorUpdate" class="mt-8" />
    </div>
    <div v-if="readSuccess" class="w-full lg:w-2/5 lg:pl-8 order-1 lg:order-2">
      <div class="bg-gray-500 rounded-lg p-8 mt-4 lg:mt-0">
        <h3 class="mb-4">Ingredients</h3>
        <RecipeIngredients :editing="editing" :input="recipe.ingredients" @ing:update="ingUpdate" />
      </div>
    </div>
    <div v-if="readSuccess" class="w-full order-3">
      <hr class="mt-4 mb-8" />
      <div v-if="!editing" class="flex flex-row flex-wrap md:flex-no-wrap justify-center md:justify-start">
        <router-link :to="{name: 'home'}" class="btn btn-gray flex flex-row items-center mb-8 md:mb-0 mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="inline-block" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z"/>
            <polyline points="15 6 9 12 15 18" />
          </svg>
          <span class="inline-block">All Recipes</span>
        </router-link>
        <router-link v-if="uAuth" :to="{name: 'mine'}" class="btn btn-gray mb-8 md:mb-0 md:mr-4">My Recipes</router-link>
        <button v-if="uAuth" class="btn btn-gray mr-4" @click="editMode(recipe)">Edit Recipe</button>
        <button v-if="uAuth" class="btn btn-red" @click="deleteRecipe(recipe)">Delete Recipe</button>
      </div>
      <div v-else class="flex flex-row items-center justify-center md:justify-start">
        <button class="btn btn-green mr-4" @click="editRecipe(recipe)">{{ saveBtnTxt }}</button>
        <button class="btn btn-red" @click="cancelEdit()">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

var cache = Object.create(null);
var cacheStr = '';

export default {
  name: "recipe",
  components: {
    'RecipeImage': () => import(/* webpackPreload: true */ '@/components/recipe/RecipeImage.vue'),
    'RecipeDiet': () => import(/* webpackPreload: true */ '@/components/recipe/RecipeDiet.vue'),
    'RecipeCategory': () => import(/* webpackPreload: true */ '@/components/recipe/RecipeCategory.vue'),
    'RecipeIngredients': () => import(/* webpackPreload: true */ '@/components/recipe/RecipeIngredients.vue'),
    'RecipeEditor': () => import(/* webpackPreload: true */ '@/components/recipe/RecipeEditor.vue')
  },
  data() {
    return {
      editing: false,
      errorMsg: '',
      isSaving: false,
      recipe: null,
      readSuccess: false
    };
  },
  created() {
    const cRefId = this.$route.params.refId; //get refId
    //try vuex store first
    let current = this.allRecipes.filter(recipe => recipe.refId === cRefId);
    if(current.length > 0) {
      this.recipe = current[0];
      this.readSuccess = true; //set success state
      console.log(`recipe data obtained from store - ${this.recipe.title}`); //log success
    } else {
      //otherwise try db
      console.log("couldn't find recipe in the store, trying DB...");
      this.readRecipe(cRefId); //query DB for the respective record
    }
  },
  computed: {
    ...mapGetters('user',[
      'currentUser',
      'loggedIn'
    ]),
    ...mapGetters('recipe',[
      'allRecipes'
    ]),
    functions() {
      return this.$store.getters['app/functions']
    },
    hasImg() {
      if('image' in this.recipe && this.recipe.image !== null) {
        return true
      } else { return false }
    },
    isImgUploaded() {
      if(this.hasImg) {
        const checkImgSrc = RegExp(/^https:\/\//);
        return checkImgSrc.test(this.recipe.image);
      } else { return false }
    },
    saveBtnTxt() {
      if(this.isSaving) {
        return "Saving...";
      } else { return "Save" }
    },
    uAuth() {
      if(this.loggedIn) {
        let usr = this.currentUser.email;
        let chef = process.env.VUE_APP_CHEF;
        if(usr === chef) {
          return true;
        } else {
          return usr === this.recipe.owner ? true : false;
        }
      } else { return false }
    }
  },
  watch: {
    recipe: {
      deep: true,
      handler() {
        if(this.readSuccess) {
          const r = this.recipe;
          //create id = slug
          r.id = r.title.replace(/[^a-z0-9]+/gi, '-').replace(/^-*|-*$/g, '').toLowerCase();
        }
      }
    },
    loggedIn: {
      handler() {
        if(!this.loggedIn && this.editing) {
          this.cancelEdit(this.recipe);
        }
      }
    }
  },
  methods: {
    ...mapActions('app', ['sendToastMessage']),
    ...mapActions('recipe', ['updateRecipe']),
    editMode(recipe) {
      Object.assign(cache, recipe);
      cacheStr = JSON.stringify(cache);
      this.isSaving = false; //in case it's not the first edit
      this.editing = true; //set state when editing
      this.$nextTick(function(){
        this.$refs['recipeTitle'].focus();
      });
    },
    imageUpdate(url) {
      this.recipe = Object.assign({}, this.recipe, {image: url});
    },
    dietUpdate(selection) {
      this.recipe.diet = selection;
    },
    categoryUpdate(selection) {
      this.recipe.category = selection;
    },
    ingUpdate(data) {
      this.recipe.ingredients = data;
    },
    editorUpdate(editorData) {
      this.recipe.body = editorData;
    },
    cancelEdit() {
      cache = JSON.parse(cacheStr);
      this.recipe = Object.assign({}, cache);
      this.editing = false;
    },
    readRecipe(refId) {
      fetch(`${this.functions.readOne}/${refId}`, {
        method: 'POST',
      })
      .then(response => {
        return response.json();
      })
      .then(res => {
        this.recipe = res.data;
        this.recipe.refId = res.ref['@ref'].id;
        if('refId' in this.recipe) {
          //check if data was obtained from the DB
          this.readSuccess = true; //set success state
          console.log(`recipe data obtained from DB - ${this.recipe.title}`); //log success
        }
      })
      .catch((error) => {
        console.log("API error", error);
        this.errorMsg = `<h3>Oops, something went wrong :(</h3>
          <p>Error: couldn't load recipe data.<br><br>
          Please try again later or go back to the home page.</p>`;
      })
    },
    editRecipe(recipe) {
      if (recipe.title === '' || recipe.description === '' || recipe.category === '' || recipe.diet === '' || recipe.duration === '' || recipe.portions === '' || recipe.ingredients.length == 0 || recipe.body === '') {
        this.sendToastMessage({ text: "Please fill all fields.", type: 'error' });
        return
      } else {
        if(this.hasImg && !this.isImgUploaded) {
          this.sendToastMessage({ text: 'An image was selected but never uploaded. Please click "Upload Image" before saving.', type: 'error' });
        } else {
          //all necessary data available, send it off
          this.updateRecipe(recipe);
          this.isSaving = true;
          this.editing = false; //reset state when done editing
        }
      }
    },
    deleteRecipe(recipe) {
      let rId = recipe.refId;
      let rName = recipe.title;
      const confirmDelete = window.confirm('This action is irreversible. Do you really want to delete this recipe?');
      if(confirmDelete) {
        fetch(`${this.functions.delete}/${rId}`, {
          method: 'POST',
        })
        .then(response => {
          console.log(`Recipe "${rName}" deleted.`, response);
          this.sendToastMessage({ text: `Recipe "${rName}" deleted.`, type: 'info' });
          this.$router.push({ name: 'home' }); // navigate when done
        })
        .catch((error) => {
          console.log("API error", error);
        })
      } else { return }
    },
  },
  directives: {
    focus: {
      inserted: function(el) {
        el.focus()
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    if(this.editing) {
      const answer = window.confirm('Do you really want to leave? There might be unsaved changes!');
      if (answer) {
        this.cancelEdit(this.recipe);
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  }
};
</script>

<style lang="postcss" scoped>
  .form-control {
    @apply block w-full;
  }
</style>