<template>
  <div id="recipe" class="row">
    <div class="col">
      <h3 class="font-weight-bold">
        <span v-if="editing === null">
          {{ recipe.title }}
        </span>
        <span v-else>
          <span class="d-block mb-2">Recipe Title</span>
          <input type="text" v-model="recipe.title" ref="recipeTitle" class="form-control">
        </span>
      </h3>
      <h4>Description</h4>
      <div v-if="editing === null">
        <p class="text-dark">{{ recipe.description }}</p>
      </div>
      <div v-else>
        <input type="text" v-model="recipe.description" class="form-control">
      </div>
      <hr />
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
        <button @click="removeIngredient" class="btn btn-outline-danger btn-sm">Remove Ingredient</button>
      </div>
      <hr />
      <h4>Instructions</h4>
      <div v-if="editing === null">
        <p>{{ recipe.body }}</p>
      </div>
      <div v-else>
        <textarea v-model="recipe.body" class="form-control"></textarea>
      </div>
      <hr />
      <div class="d-flex flex-row align-items-start">
        <div v-if="editing === null">
          <button class="btn btn-outline-dark btn-sm mr-3" @click="editMode(recipe)">Edit Recipe</button>
          <button class="btn btn-outline-danger btn-sm mr-3" @click="deleteRecipe(recipe.refId)">Delete Recipe</button>
        </div>
        <div v-else>
          <button class="btn btn-outline-success btn-sm mr-3" @click="editRecipe(recipe, recipe.refId)">Save</button>
          <button class="btn btn-outline-danger btn-sm mr-3" @click="cancelEdit(recipe)">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var cache = Object.create(null);
var cacheStr = '';

export default {
  name: "recipe",
  props: {
    recipes: Array
  },
  data() {
    return {
      editing: null,
      recipe: null
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler($route) { //production: get data from DB via API -- NOPE, otherwise that's an extra DB read we've already performed when opening the app!
        let currentRecipe = this.recipes.filter(
          recipe => recipe.refId === $route.params.refId
        );
        this.recipe = currentRecipe[0];
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
    editRecipe(recipe, refId) {
      if (recipe.name === '' || recipe.description === '' || recipe.ingredients.length == 0 || recipe.body === '') {
          alert("Please fill all fields.");
          return
      } else {
        fetch(`/.netlify/functions/recipe-edit/${refId}`, {
          body: JSON.stringify(recipe),
          method: 'POST'
        }).then(response => {
          console.log("API response", response);
          this.$emit("status:update", true); //make sure the DB operation has finished before emitting the status update
          this.editing = null; //reset state when done editing
        })
      }
    },
    deleteRecipe(refId) {
      fetch(`/.netlify/functions/recipe-delete/${refId}`, {
        method: 'POST',
      }).then(response => {
        console.log("API response", response);
        this.$emit("status:update", true); //make sure the DB operation has finished before emitting the status update
        this.$router.push({ name: 'home' }); // navigate when done
      }).catch((error) => {
        console.log('API error', error);
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