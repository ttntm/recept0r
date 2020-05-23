<template>
  <div id="create-recipe" class="col">
    <h3 class="font-weight-bold">Recipe Title</h3>
    <input type="text" v-model="recipe.title" ref="recipeTitle" class="form-control mb-3">
    <h4>Description</h4>
    <input type="text" v-model="recipe.description" class="form-control mb-3">
    <hr />
    <h4>Ingredients</h4>
    <ul class="mb-4">
      <li v-for="(ing, index) in recipe.ingredients" :key="index">
        <input type="text" v-model.trim="recipe.ingredients[index]" v-focus class="form-control mb-3">
      </li>
    </ul>
    <div class="d-flex flex-row align-items-start">
      <button @click="addIngredient" class="btn btn-outline-dark btn-sm mr-3">Add Ingredient</button>
      <button v-if="hasIng !== false" @click="removeIngredient" class="btn btn-outline-danger btn-sm">Remove Ingredient</button>
    </div>
    <hr />
    <h4>Instructions</h4>
    <textarea v-model="recipe.body" class="form-control"></textarea>
    <hr />
    <div class="d-flex flex-row align-items-start">
        <button class="btn btn-outline-success btn-sm mr-3" @click="createRecipe(recipe)">Save</button>
        <button class="btn btn-outline-danger btn-sm mr-3" @click="cancelCreate(recipe)">Cancel</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "create-recipe",
  data() {
    return {
      isEmpty: true,
      isFilled: false,
      recipe: {
        id: '',
        title: '',
        description: '',
        ingredients: [],
        body: ''
      },
      hasIng: false
    };
  },
  watch: {
      recipe: {
        deep: true,
        handler() {
            if (this.recipe.name === '' && this.recipe.description === '' && this.recipe.ingredients.length < 1 && this.recipe.body === '') {
                this.isEmpty = true;
            } else {
                this.isEmpty = false;
            }
            if (this.recipe.name !== '' && this.recipe.description !== '' && this.recipe.ingredients.length > 0 && this.recipe.body !== '') {
                this.isFilled = true;
            } else {
                this.isFilled = false;
            }
            this.hasIng = this.recipe.ingredients.length < 1 ? false : true;
        }
      }
  },
  methods: {
    cancelCreate() {
      this.$router.push({ name: 'home' });
    },
    createRecipe(recipe) {
      if (recipe.name === '' || recipe.description === '' || recipe.ingredients.length == 0 || recipe.body === '') {
          alert("Please fill all fields.");
          return
      } //cancel on empty
      this.$emit("create:recipe", recipe);
      this.$router.push({ name: 'home' });
    },
    addIngredient() {
      let ing = this.recipe.ingredients;
      ing.push('');
    },
    removeIngredient() {
      let ing = this.recipe.ingredients;
      ing.splice(ing.length - 1);
      this.hasIng = this.recipe.ingredients.length < 1 ? false : true;
    }
  },
  directives: {
    focus: {
        inserted: function (el) {
            el.focus()
        }
    }
  },
  mounted: function () {
    this.$nextTick(function () {
        this.$refs['recipeTitle'].focus();
    })
  },
  beforeRouteLeave (to, from, next) {
    if(!this.isEmpty && !this.isFilled) { //if NOT empty AND NOT filled
        const answer = window.confirm('Do you really want to leave? There might be unsaved changes!');
        if (answer) {
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