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
        <h2 class="mt-4 lg:mt-0 mb-4">
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
          <div v-if="!editing" class="flex-1 flex flex-row items-center mr-4">
            <img src="@/assets/portions.svg" class="mr-4">
            <p class="text-cool-gray-500 mb-0">{{ recipe.portions }} portions</p>
          </div>
          <div v-else class="flex-1 mr-4">
            <label class="text-cool-gray-500 text-xs">Portions</label>
            <input type="text" v-model="recipe.portions" class="form-control text-sm mr-4" placeholder="Portions; how many people does this recipe serve?">
          </div>
          <div v-if="!editing" class="flex-1 flex flex-row items-center pl-4 border-l border-cool-gray-500">
            <img src="@/assets/duration.svg" class="mr-4">
            <p class="text-cool-gray-500 mb-0">{{ recipe.duration }}</p>
          </div>
          <div v-else class="flex-1">
            <label class="text-cool-gray-500 text-xs">Duration</label>
            <input type="text" v-model="recipe.duration" class="form-control text-sm" placeholder="Duration; how long does it take to cook this?">
          </div>
        </div>
        <div>
          <p v-if="!editing"  class="text-blue-500">
            <span class="inline-block text-cool-gray-500" style="width: 6rem">Diet:</span>
            {{ recipe.diet }}
          </p>
          <div v-else class="relative mb-4">
            <select name="diet" id="select-diet" v-model="recipe.diet" class="form-control text-sm appearance-none">
              <option disabled value="">Please select a diet</option>
              <option v-for="(diet, index) in recipeDiet" :key="index" :value="diet">{{ diet }}</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-cool-gray-500">
              <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
        <div>
          <p v-if="!editing" class="text-blue-500">
            <span class="inline-block text-cool-gray-500" style="width: 6rem">Category:</span>
            {{ recipe.category }}
          </p>
          <div v-else class="relative mb-4">
            <select name="diet" id="select-category" v-model="recipe.category" class="form-control text-sm appearance-none">
              <option disabled value="">Please select a category</option>
              <option v-for="(cat, index) in recipeCategory" :key="index" :value="cat">{{ cat }}</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-cool-gray-500">
              <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="readSuccess" class="w-full lg:w-3/5 order-2 lg:order-1">
      <recipe-editor :editing="editing" :editorContent="recipe.body" @editor:update="editorUpdate" class="mt-8" />
    </div>
    <div v-if="readSuccess" class="w-full lg:w-2/5 lg:pl-8 order-1 lg:order-2">
      <div class="bg-gray-500 rounded-lg p-8 mt-4 lg:mt-0">
        <h3 class="mb-4">Ingredients</h3>
        <ul class="ing-list mb-0">
          <li v-for="(ing, index) in recipe.ingredients" :key="index">
            <span v-if="!editing">
              {{ ing }}
            </span>
            <span v-else class="flex flex-row items-center">
              <input type="text"
                class="inline-block form-control text-sm mb-4"
                v-model.trim="recipe.ingredients[index]"
                v-focus
                @keydown.enter="addIngredient(index)"
                :placeholder="`Ingredient ${index+1}`"
                :ref="`input${index}`"
              >
              <button class="inline-block text-lg opacity-75 hover:opacity-100 p-1 ml-2 mb-4"
                @click="removeIngredient(index)"
              >&times;</button>
            </span>
          </li>
        </ul>
        <button v-if="editing" @click="addIngredient()" class="btn btn-green block text-sm mx-auto">Add Ingredient</button>
      </div>
    </div>
    <div v-if="readSuccess" class="w-full order-3">
      <hr class="mt-4 mb-8" />
      <div v-if="!editing" class="flex flex-col md:flex-row items-center md:items-start">
        <router-link :to="{name: 'home'}" class="btn btn-gray mb-4 md:mb-0 md:mr-4">&lt; Go Back</router-link>
        <button v-if="loggedIn" class="btn btn-gray mb-4 md:mb-0 md:mr-4" @click="editMode(recipe)">Edit Recipe</button>
        <button v-if="loggedIn" class="btn btn-red" @click="deleteRecipe(recipe)">Delete Recipe</button>
      </div>
      <div v-else class="flex flex-row items-center justify-center md:justify-start">
        <button class="btn btn-green mr-4" @click="editRecipe(recipe)">{{ saveBtnTxt }}</button>
        <button class="btn btn-red" @click="cancelEdit()">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import RecipeImage from '@/components/RecipeImage.vue';
import RecipeEditor from '@/components/RecipeEditor.vue';
import { mapGetters, mapActions } from 'vuex';

var cache = Object.create(null);
var cacheStr = '';

export default {
  name: "recipe",
  components: {
    RecipeImage,
    RecipeEditor
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
    ...mapGetters('user',['loggedIn']),
    ...mapGetters('recipe',[
      'allRecipes',
      'recipeCategory',
      'recipeDiet'
    ]),
    saveBtnTxt() {
      if(this.isSaving) {
        return "Saving...";
      } else { return "Save" }
    },
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
      this.editing = true; //set state when editing
      this.$nextTick(function(){
        this.$refs['recipeTitle'].focus();
      });
    },
    imageUpdate(url) {
      this.recipe = Object.assign({}, this.recipe, { image: url});
    },
    addIngredient(index) {
      let ing = this.recipe.ingredients;
      if(index > -1) {
        ing.splice(index + 1, 0, '');
        this.$nextTick(function() {
          // focus the spliced element instead of the last one as per directive
          // somehow vue returns a 1 element array here
          // see -> https://stackoverflow.com/questions/54306581/this-refsp-index-focus-is-not-a-function
          this.$refs[`input${index + 1}`][0].focus();
        });
      } else {
        ing.push('');
      }
    },
    removeIngredient(index) {
      let ing = this.recipe.ingredients;
      if(index > -1) {
        ing.splice(index, 1);
      } else {
        ing.splice(ing.length - 1);
      }
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
  .ing-list > li {
    @apply text-blue-500 mb-2;
    font-weight: 600;
  }
  .ing-list > li:last-child {
    @apply mb-0;
  }
</style>