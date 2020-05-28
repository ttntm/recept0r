<template>
  <div id="recipe" class="row">
    <div class="col">
      <div v-if="readSuccess !== true">
        <p class="text-secondary">Loading...</p>
      </div>
      <div v-else>
        <!-- BEGIN CONTENT -->
        <h3 class="font-weight-bold mb-4">
          <span v-if="editing === null">
            {{ recipe.title }}
          </span>
          <span v-else>
            <span class="d-block mb-3">Recipe Title</span>
            <input type="text" v-model="recipe.title" ref="recipeTitle" class="form-control">
          </span>
        </h3>
        <img v-if="recipe.image" class="img-fluid mb-4" :src="recipe.image" :alt="recipe.title">
        <div v-if="editing">
          <recipe-image :recipe="recipe" @image:update="imageUpdate" />
          <hr class="my-4" />
        </div>
        <h4>Description</h4>
        <div v-if="editing === null">
          <p class="text-dark">{{ recipe.description }}</p>
        </div>
        <div v-else>
          <input type="text" v-model="recipe.description" class="form-control">
        </div>
        <hr class="my-4" />
        <h4>Ingredients</h4>
        <ul class="mb-4">
          <li v-for="(ing, index) in recipe.ingredients" :key="index">
            <span v-if="editing === null">
              {{ ing }}
            </span>
            <span v-else>
              <input type="text" v-model.trim="recipe.ingredients[index]" v-focus class="form-control mb-3">
            </span>
          </li>
        </ul>
        <div v-if="editing !== null" class="d-flex flex-row align-items-start">
          <button @click="addIngredient" class="btn btn-outline-dark btn-sm mr-3">Add Ingredient</button>
          <button @click="removeIngredient" class="btn btn-outline-secondary btn-sm">Remove Ingredient</button>
        </div>
        <hr class="my-4" />
        <h4>Instructions</h4>
        <div v-if="editing === null">
          <p>{{ recipe.body }}</p>
        </div>
        <div v-else>
          <textarea v-model="recipe.body" class="form-control"></textarea>
        </div>
        <hr class="my-4" />
        <div class="d-flex flex-row align-items-start">
          <div v-if="editing === null">
            <router-link :to="{name: 'home'}" class="btn btn-outline-secondary btn-sm mr-3">&lt; Go Back</router-link>
            <button class="btn btn-outline-dark btn-sm mr-3" @click="editMode(recipe)">Edit Recipe</button>
            <button class="btn btn-outline-danger btn-sm mr-3" @click="deleteRecipe(recipe)">Delete Recipe</button>
          </div>
          <div v-else>
            <button class="btn btn-outline-success btn-sm mr-3" @click="editRecipe(recipe)">Save</button>
            <button class="btn btn-outline-danger btn-sm mr-3" @click="cancelEdit(recipe)">Cancel</button>
          </div>
        </div>
      </div>
      <!-- END CONTENT -->
    </div>
  </div>
</template>

<script>
import RecipeImage from '@/components/RecipeImage.vue';

var cache = Object.create(null);
var cacheStr = '';

export default {
  name: "recipe",
  components: {
      RecipeImage
  },
  props: {
    fPath: Object
  },
  data() {
    return {
      editing: null,
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
      this.editing = recipe.id; //set state when editing
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
    cancelEdit(recipe) {
      cache = JSON.parse(cacheStr);
      Object.assign(recipe, cache);
      this.editing = null;
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
            this.editing = null; //reset state when done editing
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
    if(this.editing !== null) {
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

<style scoped>
  textarea {
    min-height: 150px;
  }
</style>