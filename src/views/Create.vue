<template>
  <div id="create-recipe" class="w-full md:w-4/5 flex flex-row flex-wrap mx-auto">
    <div class="w-full">
      <h3 class="mb-6">Recipe Title</h3>
      <input type="text" v-model="recipe.title" ref="recipeTitle" class="form-control mb-4">
    </div>
    <div class="w-full md:w-1/2">
      <h4>Image</h4>
      <img v-if="recipe.image" class="rounded-lg mt-4 mb-4" :src="recipe.image" :alt="recipe.title">
      <recipe-image :recipe="recipe" @image:update="imageUpdate" class="mb-4" />
    </div>
    <div class="w-full md:w-1/2 md:pl-8">
      <h4 class="mb-4">Description</h4>
      <input type="text" v-model="recipe.description" class="form-control mb-4">
      <h4 class="mb-4">Ingredients</h4>
      <ul class="mb-6">
        <li v-for="(ing, index) in recipe.ingredients" :key="index">
          <input type="text" v-model.trim="recipe.ingredients[index]" v-focus class="inline-block form-control text-sm mb-4">
        </li>
      </ul>
      <div class="flex flex-row items-start mb-4">
        <button @click="addIngredient()" class="btn btn-green text-sm mr-4">Add Ingredient</button>
        <button v-if="hasIng" @click="removeIngredient()" class="btn btn-gray text-sm">Remove Ingredient</button>
      </div>
    </div>
    <div class="w-full">
      <h4 class="mb-4">Instructions</h4>
      <recipe-editor :editing="true" :editorContent="recipe.body" @editor:update="editorUpdate" />
      <hr class="my-8">
      <div class="flex flex-row items-start">
          <button class="btn btn-green mr-4" @click="createRecipe(recipe)" :disabled="isDisabled">{{ saveBtnTxt }}</button>
          <button class="btn btn-red mr-4" @click="cancelCreate(recipe)">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import RecipeImage from '@/components/RecipeImage.vue';
import RecipeEditor from '@/components/RecipeEditor.vue';

export default {
  name: "create-recipe",
  components: {
    RecipeImage,
    RecipeEditor
  },
  props: {
    fPath: Object
  },
  data() {
    return {
      isEmpty: true,
      isFilled: false,
      hasIng: false,
      wasEdited: false,
      isSaving: false,
      isImgUploaded: false,
      recipe: {
        id: '',
        title: '',
        description: '',
        image: null,
        ingredients: [],
        body: {
          "type":"doc",
          "content":[{
            "type":"paragraph",
            "content":[{
              "type":"text",
              "text":"Recipe description goes into this editor right here..."
            }]
          }]
        }
      }
    };
  },
  computed: {
    isDisabled() {
      if(this.isEmpty || this.isSaving) {
        return true
      } else { return false }
    },
    saveBtnTxt() {
      if(this.isSaving) {
        return "Saving..."
      } else { return "Save" }
    }
  },
  watch: {
    recipe: {
      deep: true,
      handler() {
        const r = this.recipe;
        if (r.title === '' && r.description === '' && !this.hasIng && r.image === null && !this.wasEdited) {
            this.isEmpty = true;
        } else { this.isEmpty = false; }
        if (r.title !== '' && r.description !== '' && this.hasIng && r.body !== '') {
            this.isFilled = true;
        } else { this.isFilled = false; }
        //watch ingredients
        this.hasIng = r.ingredients.length < 1 ? false : true;
        //create id = slug
        let rTitle = r.title;
        r.id = rTitle.replace(/[^a-z0-9]+/gi, '-').replace(/^-*|-*$/g, '').toLowerCase();
        //check if image was uploaded
        const checkImgSrc = RegExp(/^https:\/\//);
        this.isImgUploaded = checkImgSrc.test(r.image);
      }
    }
  },
  methods: {
    imageUpdate(url) {
      this.recipe.image = url;
    },
    addIngredient() {
      this.recipe.ingredients.push('');
    },
    removeIngredient() {
      let ing = this.recipe.ingredients;
      ing.splice(ing.length - 1);
      this.hasIng = ing.length < 1 ? false : true;
    },
    editorUpdate(editorData) {
      this.recipe.body = editorData;
      this.wasEdited = true;
    },
    addRecipe(recipe) {
      const newRecipe = recipe;
      const functions = this.fPath;

      function postRecipe(data) {
        return fetch(`${functions.create}`, {
          body: JSON.stringify(data),
          method: 'POST'
        }).then(response => {
          return response.json();
        }).catch((error) => {
          console.log("API error", error);
        })
      }

      postRecipe(newRecipe).then((response) => {
        console.log(newRecipe.title + " created.", response);
        this.$emit("status:update", true); //make sure the DB operation has finished before emitting the status update
        this.$router.push({ name: 'home' }); // navigate when done
      })
    },
    createRecipe(recipe) {
      if (recipe.title === '' || recipe.description === '' || recipe.ingredients.length == 0 || recipe.body === '') {
          alert("Please fill all fields.");
          return
      } else {
        if(recipe.image !== null && !this.isImgUploaded) {
          alert('An image was selected but never uploaded. Please click "Upload Image" before saving.');
        } else { //all necessary data available, send it off
          this.isSaving = true;
          this.addRecipe(recipe);
        }
      }
    },
    cancelCreate() {
      this.$router.push({ name: 'home' });
    }
  },
  directives: {
    focus: {
      inserted: function (el) {
          el.focus()
      }
    }
  },
  mounted() {
    this.$nextTick(function () {
        this.$refs['recipeTitle'].focus();
    });
  },
  beforeRouteLeave (to, from, next) {
    if(!this.isEmpty && !this.isFilled) { //if NOT empty _and_ NOT filled
      const answer = window.confirm('Do you really want to leave? There might be unsaved changes!');
      if (answer) {
          next();
      } else { return }
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
    @apply text-2xl text-gray-700;
  }
  .form-control {
    @apply block w-full;
  }
</style>