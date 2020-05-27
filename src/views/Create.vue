<template>
  <div id="create-recipe" class="row">
    <div class="col">
      <h3 class="font-weight-bold mb-3">Recipe Title</h3>
      <input type="text" v-model="recipe.title" ref="recipeTitle" class="form-control mb-3">
      <h4>Description</h4>
      <input type="text" v-model="recipe.description" class="form-control mb-3">
      <hr class="my-4" />
      <h4>Image</h4>
      <img class="img-fluid mt-3 mb-4" :src="recipe.image" :alt="recipe.title">
      <input @change="addImage" class="form-control-file" type="file" accept="image/*">
      <button v-if="recipe.image !== null" @click="removeImage" class="btn btn-outline-secondary btn-sm mt-3">Remove Image</button>
      <hr class="my-4" />
      <h4>Ingredients</h4>
      <ul class="mb-4">
        <li v-for="(ing, index) in recipe.ingredients" :key="index">
          <input type="text" v-model.trim="recipe.ingredients[index]" v-focus class="form-control mb-3">
        </li>
      </ul>
      <div class="d-flex flex-row align-items-start">
        <button @click="addIngredient" class="btn btn-outline-dark btn-sm mr-3">Add Ingredient</button>
        <button v-if="hasIng !== false" @click="removeIngredient" class="btn btn-outline-secondary btn-sm">Remove Ingredient</button>
      </div>
      <hr class="my-4" />
      <h4>Instructions</h4>
      <textarea v-model="recipe.body" class="form-control"></textarea>
      <hr class="my-4" />
      <div class="d-flex flex-row align-items-start">
          <button class="btn btn-outline-success btn-sm mr-3" @click="createRecipe(recipe)" :disabled="isDisabled">Save</button>
          <button class="btn btn-outline-danger btn-sm mr-3" @click="cancelCreate(recipe)">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "create-recipe",
  props: {
    fPath: Object
  },
  data() {
    return {
      isEmpty: true,
      isFilled: false,
      hasIng: false,
      isSaving: false,
      recipe: {
        id: '',
        title: '',
        description: '',
        image: null,
        ingredients: [],
        body: ''
      }
    };
  },
  computed: {
    isDisabled() {
      if(this.isEmpty || this.isSaving) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
      recipe: {
        deep: true,
        handler() {
            const r = this.recipe;
            if (r.title === '' && r.description === '' && r.ingredients.length < 1 && r.body === '') {
                this.isEmpty = true;
            } else {
                this.isEmpty = false;
            }
            if (r.title !== '' && r.description !== '' && r.ingredients.length > 0 && r.body !== '') {
                this.isFilled = true;
            } else {
                this.isFilled = false;
            }
            //watch ingredients
            this.hasIng = r.ingredients.length < 1 ? false : true;
            //create id
            let rTitle = r.title;
            r.id = rTitle.replace(/[^a-z0-9]+/gi, '-').replace(/^-*|-*$/g, '').toLowerCase();
        }
      }
  },
  methods: {
    addImage(e) {
      const selectedImage = e.target.files[0]; //get the first file
      if(selectedImage) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.recipe.image = e.target.result;
        }
        reader.readAsDataURL(selectedImage);
      } else {
        return //cancel if there's no image or if the image is removed
      }
    },
    removeImage() {
      this.recipe.image = null;
    },
    addIngredient() {
      let ing = this.recipe.ingredients;
      ing.push('');
    },
    removeIngredient() {
      let ing = this.recipe.ingredients;
      ing.splice(ing.length - 1);
      this.hasIng = this.recipe.ingredients.length < 1 ? false : true;
    },
    cancelCreate() {
      this.$router.push({ name: 'home' });
    },
    createRecipe(recipe) {
      if (recipe.title === '' || recipe.description === '' || recipe.ingredients.length == 0 || recipe.body === '') {
          alert("Please fill all fields.");
          return
      } else {
        this.addRecipe(recipe);
        this.isSaving = true;
      }
    },
    addRecipe(recipe) {
      const newRecipe = recipe;
      const functions = this.fPath;

      function postRecipe(data) {
        return fetch(`${functions.create}`, {
          body: JSON.stringify(data),
          method: 'POST'
        }).then(response => {
          return response.json()
        }).catch((error) => {
          console.log("API error", error)
        })
      }

      postRecipe(newRecipe).then((response) => {
        console.log(newRecipe.title + " created.", response);
        this.$emit("status:update", true); //make sure the DB operation has finished before emitting the status update
        this.$router.push({ name: 'home' }); // navigate when done
      })
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