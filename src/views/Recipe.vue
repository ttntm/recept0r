<template>
  <div id="recipe" class="flex flex-row flex-wrap">
    <div v-if="readSuccess" class="w-full">
      <h3 class="mb-6">
        <span v-if="!editing">
          {{ recipe.title }}
        </span>
        <span v-else>
          <span class="block mb-4">Recipe Title</span>
          <input type="text" v-model="recipe.title" ref="recipeTitle" class="form-control">
        </span>
      </h3>
    </div>
    <div v-if="readSuccess" class="w-full md:w-1/2">
      <h4 v-if="editing" class="mb-4">Image</h4>
      <img v-if="recipe.image" class="w-full rounded-lg shadow-sm mb-4" :src="recipe.image" :alt="recipe.title" key="image">
      <recipe-image v-if="editing" :recipe="recipe" @image:update="imageUpdate" class="mb-4" />
    </div>
    <div v-if="readSuccess" class="w-full md:w-1/2 md:pl-8">
      <h4 class="mb-4">Description</h4>
      <div v-if="!editing">
        <p class="text-blue-600">{{ recipe.description }}</p>
      </div>
      <div v-else>
        <input type="text" v-model="recipe.description" class="form-control">
      </div>
      <h4 class="my-4">Ingredients</h4>
      <ul class="mt-4 mb-4">
        <li v-for="(ing, index) in recipe.ingredients" :key="index">
          <span v-if="!editing">
            {{ ing }}
          </span>
          <span v-else class="flex flex-row items-center">
            <input type="text" v-model.trim="recipe.ingredients[index]" v-focus class="inline-block form-control text-sm mb-4">
            <button class="inline-block text-lg opacity-75 hover:opacity-100 p-1 ml-2 mb-4"
              @click="removeIngredient(index)"
            >&times;</button>
          </span>
        </li>
      </ul>
      <div v-if="editing" class="flex flex-row items-start mb-4">
        <button @click="addIngredient()" class="btn btn-gray text-sm mr-4">Add Ingredient</button>
        <button @click="removeIngredient()" class="btn btn-red text-sm">Remove Ingredient</button>
      </div>
    </div>
    <div class="w-full">
      <div v-if="!readSuccess">
        <p class="text-gray-600">Loading...</p>
      </div>
      <div v-else>
        <h4 class="mb-4">Instructions</h4>
        <recipe-editor :editing="editing" :editorContent="recipe.body" @editor:update="editorUpdate" />
        <hr class="my-8" />
        <div class="flex flex-row items-start">
          <div v-if="!editing">
            <router-link :to="{name: 'home'}" class="btn btn-gray mr-4">&lt; Go Back</router-link>
            <button v-if="!publicView" class="btn btn-gray mr-4" @click="editMode(recipe)">Edit Recipe</button>
            <button v-if="!publicView" class="btn btn-red" @click="deleteRecipe(recipe)">Delete Recipe</button>
          </div>
          <div v-else>
            <button class="btn btn-green mr-4" @click="editRecipe(recipe)">Save</button>
            <button class="btn btn-red" @click="cancelEdit()">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RecipeImage from '@/components/RecipeImage.vue';
import RecipeEditor from '@/components/RecipeEditor.vue';
import { EventBus } from '@/helpers/event-bus.js';

var cache = Object.create(null);
var cacheStr = '';

export default {
  name: "recipe",
  components: {
    RecipeImage,
    RecipeEditor
  },
  props: {
    fPath: Object,
    publicView: Boolean
  },
  data() {
    return {
      editing: false,
      isImgUploaded: null,
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
    publicView: {
      handler() {
        if(this.publicView) {
          this.cancelEdit(this.recipe);
        }
      }
    }
  },
  methods: {
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
    addIngredient() {
      let ing = this.recipe.ingredients;
      ing.push('New ingredient' + (ing.length + 1)); //avoid duplicate key warning
    },
    removeIngredient(index) {
      let ing = this.recipe.ingredients;
      if(index) {
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
          EventBus.$emit('toast-message', { text: "Please fill all fields.", type: 'error' });
          return
      } else {
        this.checkImageStatus();
        if(this.isImgUploaded === false) {
          EventBus.$emit('toast-message', { text: 'An image was selected but never uploaded. Please click "Upload Image" before saving.', type: 'error' });
        } else { //all necessary data available, send it off
          let rId = recipe.refId;
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
          EventBus.$emit('toast-message', { text: `Recipe "${rName}" deleted.`, type: 'info' });
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
  h3 {
    @apply tracking-wide text-3xl font-bold text-blue-600;
  }
  h4 {
    @apply text-2xl text-blue-500;
  }
  .form-control {
    @apply block w-full;
  }
</style>