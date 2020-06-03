<template>
  <div id="recipe" class="flex flex-row flex-wrap">
    <div v-if="readSuccess" class="w-full">
      <h3 class="font-bold mb-4">
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
      <img v-if="recipe.image" class="img-fluid rounded-lg mb-4" :src="recipe.image" :alt="recipe.title">
      <recipe-image v-if="editing" :recipe="recipe" @image:update="imageUpdate" class="mb-4" />
    </div>
    <div v-if="readSuccess" class="w-full md:w-1/2 pl-8">
      <h4 class="mb-4">Description</h4>
      <div v-if="!editing">
        <p class="text-gray-800">{{ recipe.description }}</p>
      </div>
      <div v-else>
        <input type="text" v-model="recipe.description" class="form-control">
      </div>
      <h4 class="my-4">Ingredients</h4>
      <ul class="my-4">
        <li v-for="(ing, index) in recipe.ingredients" :key="index">
          <span v-if="!editing">
            {{ ing }}
          </span>
          <span v-else>
            <input type="text" v-model.trim="recipe.ingredients[index]" v-focus class="inline form-control mb-4">
          </span>
        </li>
      </ul>
      <div v-if="editing" class="flex flex-row items-start">
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
            <button v-if="!publicView" class="btn btn-red mr-4" @click="deleteRecipe(recipe)">Delete Recipe</button>
          </div>
          <div v-else>
            <button class="btn btn-green mr-4" @click="editRecipe(recipe)">Save</button>
            <button class="btn btn-red mr-4" @click="cancelEdit(recipe)">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RecipeImage from '@/components/RecipeImage.vue';
import RecipeEditor from '@/components/RecipeEditor.vue';

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
      isImgUploaded: false,
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
        //check if image was uploaded
        const checkImgSrc = RegExp(/^https:\/\//);
        this.isImgUploaded = checkImgSrc.test(r.image);
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
      this.recipe.image = url;
    },
    addIngredient() {
      let ing = this.recipe.ingredients;
      ing.push('New ingredient' + (ing.length + 1)); //avoid duplicate key warning
    },
    removeIngredient() {
      let ing = this.recipe.ingredients;
      ing.splice(ing.length - 1);
    },
    editorUpdate(editorData) {
      this.recipe.body = editorData;
    },
    cancelEdit(recipe) {
      cache = JSON.parse(cacheStr);
      Object.assign(recipe, cache);
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
    editRecipe(recipe) {
      if (recipe.title === '' || recipe.description === '' || recipe.ingredients.length == 0 || recipe.body === '') {
          alert("Please fill all fields.");
          return
      } else {
        if(recipe.image !== null && !this.isImgUploaded) {
          alert('An image was selected but never uploaded. Please click "Upload Image" before saving.');
        } else { //all necessary data available, send it off
          let rId = recipe.refId;
          fetch(`${this.fPath.edit}/${rId}`, {
            body: JSON.stringify(recipe),
            method: 'POST'
          }).then(response => {
            console.log("recipe " + recipe.title + " successfully updated.", response);
            this.$emit("status:update", true); //make sure the DB operation has finished before emitting the status update
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
      fetch(`${this.fPath.delete}/${rId}`, {
        method: 'POST',
      }).then(response => {
        this.$emit("status:update", true); //make sure the DB operation has finished before emitting the status update
        this.$router.push({ name: 'home' }); // navigate when done
        console.log("Recipe " + rName + " deleted", response);
      }).catch((error) => {
        console.log("API error", error);
      })
    },
  },
  directives: {
    focus: {
      inserted: function (el) {
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
    @apply tracking-wide text-3xl font-bold;
  }
  h4 {
    @apply text-2xl text-gray-600;
  }
  .form-control {
    @apply block w-full text-base;
  }
</style>