<template>
  <div id="recipe" class="w-full xl:w-4/5 flex flex-row flex-wrap mx-auto">
    <div v-if="!readSuccess" class="w-full">
      <p class="text-cool-gray-500 text-center">Loading...</p>
    </div>
    <div v-if="readSuccess" class="w-full lg:w-3/5">
      <h4 v-if="editing" class="mb-4">Image</h4>
      <img v-if="recipe.image" class="w-full rounded-lg shadow-sm mb-4" :src="recipe.image" :alt="recipe.title" key="image">
      <recipe-image v-if="editing" :recipe="recipe" @image:update="imageUpdate" />
    </div>
    <div v-if="readSuccess" class="w-full lg:w-2/5 lg:pl-8">
      <div>
        <h3 class="mt-4 lg:mt-0 mb-4">
          <span v-if="!editing">
            {{ recipe.title }}
          </span>
          <span v-else>
            <span class="block mb-4">Recipe Title</span>
            <input type="text" v-model="recipe.title" ref="recipeTitle" class="form-control">
          </span>
        </h3>
        <div class="my-8">
          <p v-if="!editing" class="m-0">{{ recipe.description }}</p>
          <input v-else type="text" v-model="recipe.description" class="form-control">
        </div>
        <div class="flex flex-row flex-no-wrap border-t border-b border-cool-gray-500 my-4 py-4">
          <div v-if="!editing" class="flex-1 flex flex-row items-center mr-4">
            <img src="@/assets/portions.svg" class="mr-4">
            <p class="mb-0">{{ recipe.portions }} portions</p>
          </div>
          <div v-else class="flex-1 mr-4">
            <label class="text-cool-gray-500 text-xs">Portions</label>
            <input type="text" v-model="recipe.portions" class="form-control text-sm mr-4" placeholder="Portions; how many people does this recipe serve?">
          </div>
          <div v-if="!editing" class="flex-1 flex flex-row items-center pl-4 border-l border-cool-gray-500">
            <img src="@/assets/duration.svg" class="mr-4">
            <p class="mb-0">{{ recipe.duration }}</p>
          </div>
          <div v-else class="flex-1">
            <label class="text-cool-gray-500 text-xs">Duration</label>
            <input type="text" v-model="recipe.duration" class="form-control text-sm" placeholder="Duration; how long does it take to cook this?">
          </div>
        </div>
        <div>
          <p v-if="!editing">
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
          <p v-if="!editing">
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
        <h4 class="mb-4">Ingredients</h4>
        <ul class="">
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
  props: {
    fPath: Object
  },
  computed: {
    ...mapGetters('user',['loggedIn']),
    ...mapGetters('app',[
      'recipeCategory',
      'recipeDiet'
    ]),
    saveBtnTxt() {
      if(this.isSaving) {
        return "Saving..."
      } else { return "Save" }
    }
  },
  data() {
    return {
      editing: false,
      isImgUploaded: null,
      isSaving: false,
      recipe: null,
      readSuccess: false
    };
  },
  created() {
    const cRefId = this.$route.params.refId; //get refId
    this.readRecipe(cRefId); //query DB for the respective record
  },
  watch: {
    recipe: {
      deep: true,
      handler() {
        const r = this.recipe;
        //create id
        let rTitle = r.title;
        r.id = rTitle.replace(/[^a-z0-9]+/gi, '-').replace(/^-*|-*$/g, '').toLowerCase();
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
      this.hasIng = ing.length < 1 ? false : true;
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
      fetch(`${this.fPath.readOne}/${refId}`, {
        method: 'POST',
      }).then(response => {
        return response.json();
      }).then(res => {
        this.recipe = res.data;
        this.recipe.refId = res.ref['@ref'].id;
        if('refId' in this.recipe) { //check if data was obtained from the DB
          this.readSuccess = true; //set success state
          console.log("recipe data obtained - " + this.recipe.title); //log success
        }
      }).catch((error) => {
        console.log("API error", error);
      })
    },
    checkImageStatus() {
      if('image' in this.recipe && this.recipe.image !== null) {
        const checkImgSrc = RegExp(/^https:\/\//);
        this.isImgUploaded = checkImgSrc.test(this.recipe.image);
      }
    },
    editRecipe(recipe) {
      if (recipe.title === '' || recipe.description === '' || recipe.ingredients.length == 0 || recipe.body === '') {
          this.sendToastMessage({ text: "Please fill all fields.", type: 'error' });
          return
      } else {
        this.checkImageStatus();
        if(this.isImgUploaded === false) {
          this.sendToastMessage({ text: 'An image was selected but never uploaded. Please click "Upload Image" before saving.', type: 'error' });
        } else { //all necessary data available, send it off
          let rId = recipe.refId;
          this.isSaving = true;
          fetch(`${this.fPath.edit}/${rId}`, {
            body: JSON.stringify(recipe),
            method: 'POST'
          }).then(response => {
            console.log("recipe " + recipe.title + " successfully updated.", response);
            this.editing = false; //reset state when done editing
          }).catch((error) => {
            console.log("API error", error);
          })
        }
      }
    },
    deleteRecipe(recipe) {
      let rId = recipe.refId;
      let rName = recipe.title;
      const confirmDelete = window.confirm('This action is irreversible. Do you really want to delete this recipe?');
      if(confirmDelete) {
        fetch(`${this.fPath.delete}/${rId}`, {
          method: 'POST',
        }).then(response => {
          this.sendToastMessage({ text: `Recipe "${rName}" deleted.`, type: 'info' });
          this.$router.push({ name: 'home' }); // navigate when done
          console.log(`Recipe "${rName}" deleted.`, response);
        }).catch((error) => {
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