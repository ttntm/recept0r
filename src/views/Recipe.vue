<template>
  <div id="recipe" class="col">
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
      <li v-for="(ing, index) in recipe.ingredients" :key="recipe.ingredients[index]">
        <span v-if="editing === null">
          {{ ing }}
        </span>
        <span v-else>
          <input type="text" v-model.lazy="recipe.ingredients[index]" v-focus class="form-control mb-3">
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
        <button class="btn btn-outline-danger btn-sm mr-3" @click="deleteRecipe(recipe.id)">Delete Recipe</button>
      </div>
      <div v-else>
        <button class="btn btn-outline-success btn-sm mr-3" @click="editRecipe(recipe)">Save</button>
        <button class="btn btn-outline-danger btn-sm mr-3" @click="cancelEdit(recipe)">Cancel</button>
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
      handler($route) { //production: get data from DB via API
        let currentRecipe = this.recipes.filter(
          recipe => recipe.id === $route.params.id
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
      // console.log(cache);
      this.$nextTick(function(){
        this.$refs['recipeTitle'].focus();
      });
    },
    cancelEdit(recipe) {
      cache = JSON.parse(cacheStr);
      // console.log(cache);
      Object.assign(recipe, cache);
      this.editing = null;
    },
    editRecipe(recipe) {
      if (recipe.name === '' || recipe.description === '' || recipe.ingredients.length == 0 || recipe.body === '') return; //cancel on empty
      this.$emit("edit:recipe", recipe);
      this.editing = null; //reset state when done editing
    },
    addIngredient() {
      let ing = this.recipe.ingredients;
      ing.push('New ingredient' + (ing.length + 1)); //avoid duplicate key warning
    },
    removeIngredient() {
      let ing = this.recipe.ingredients;
      ing.splice(ing.length - 1);
    },
    deleteRecipe(id) {
      this.$emit('delete:recipe', id);
      this.$router.push({ name: 'home' });
    }
  },
  directives: {
    focus: {
        inserted: function (el) {
            el.focus()
        }
    }
  }
};
</script>

<style scoped>
  textarea {
    min-height: 150px;
  }
</style>