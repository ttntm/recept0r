<template>
  <div id="create-recipe" class="w-full md:w-4/5 flex flex-row flex-wrap mx-auto">
    <div class="w-full md:w-1/2">
      <h3>Image</h3>
      <img v-if="recipe.image" class="rounded-lg mt-4 mb-4" :src="recipe.image" :alt="recipe.title">
      <recipe-image :recipe="recipe" @image:update="imageUpdate" class="mb-4" />
    </div>
    <div class="w-full md:w-1/2 md:pl-8">
      <h3 class="">Recipe Title</h3>
      <input type="text" v-model="recipe.title" ref="recipeTitle" class="form-control mb-4" placeholder="A great title...">
      <h4 class="mb-4">Description</h4>
      <input type="text" v-model="recipe.description" class="form-control mb-4" placeholder="A fancy description...">
    </div>
    <div class="w-full md:w-1/2">
      <h4 class="mb-4">Metadata</h4>
      <input type="text" v-model="recipe.portions" class="form-control text-sm mb-4" placeholder="Portions; how many people does this recipe serve?">
      <input type="text" v-model="recipe.duration" class="form-control text-sm mb-4" placeholder="Duration; how long does it take to cook this?">
      <div class="relative mb-4">
        <select name="diet" id="select-diet" v-model="recipe.diet" class="form-control text-sm appearance-none">
          <option disabled value="">Please select a diet</option>
          <option v-for="(diet, index) in recipeDiet" :key="index" :value="diet">{{ diet }}</option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-cool-gray-500">
          <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
      <div class="relative mb-4">
        <select name="diet" id="select-category" v-model="recipe.category" class="form-control text-sm appearance-none">
          <option disabled value="">Please select a category</option>
          <option v-for="(cat, index) in recipeCategory" :key="index" :value="cat">{{ cat }}</option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-cool-gray-500">
          <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>
    <div class="w-full md:w-1/2 md:pl-8">
      <h4 class="mb-4">Ingredients</h4>
      <ul class="mb-4">
        <li v-for="(ing, index) in recipe.ingredients" :key="index">
          <span class="flex flex-row items-center">
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
      <div class="flex flex-row items-start mb-4">
        <button @click="addIngredient()" class="btn btn-green text-sm mr-4">Add Ingredient</button>
      </div>
    </div>
    <div class="w-full">
      <h4 class="mb-4">Instructions</h4>
      <recipe-editor :editing="true" :editorContent="recipe.body" @editor:update="editorUpdate" />
      <hr class="my-8">
      <div class="flex flex-row justify-center lg:justify-start">
        <button class="btn btn-green mr-4" @click="saveRecipe(recipe)" :disabled="isDisabled">{{ saveBtnTxt }}</button>
        <button class="btn btn-red" @click="cancelCreate(recipe)">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import RecipeImage from '@/components/RecipeImage.vue';
import RecipeEditor from '@/components/RecipeEditor.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "create-recipe",
  components: {
    RecipeImage,
    RecipeEditor
  },
  data() {
    return {
      isEmpty: true,
      hasIng: false,
      wasEdited: false,
      isSaving: false,
      isImgUploaded: false,
      recipe: {
        id: '',
        title: '',
        category: '',
        description: '',
        diet: '',
        duration: '',
        image: null,
        ingredients: [],
        portions: '',
        body: {
          "type":"doc",
          "content":[
            {"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"About this Recipe"}]},
            {"type":"paragraph","content":[{"type":"text","text":"About text"}]},
            {"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Instructions"}]},
            {"type":"paragraph","content":[{"type":"text","text":"What to do..."}]},
            {"type":"horizontal_rule"},
            {"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Notes"}]}
          ]
        }
      }
    };
  },
  computed: {
    ...mapGetters('recipe',[
      'recipeCategory',
      'recipeDiet'
    ]),
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
  mounted() {
    this.$nextTick(function() {
      this.$refs['recipeTitle'].focus();
    });
  },
  watch: {
    recipe: {
      deep: true,
      handler() {
        const r = this.recipe;
        if (r.title === '' && r.description === '' && !this.hasIng && r.image === null && !this.wasEdited) {
            this.isEmpty = true;
        } else { this.isEmpty = false; }
        //watch ingredients
        this.hasIng = r.ingredients.length < 1 ? false : true;
        //create id = slug
        r.id = r.title.replace(/[^a-z0-9]+/gi, '-').replace(/^-*|-*$/g, '').toLowerCase();
        //check if image was uploaded
        const checkImgSrc = RegExp(/^https:\/\//);
        this.isImgUploaded = checkImgSrc.test(r.image);
      }
    }
  },
  methods: {
    ...mapActions('app', ['sendToastMessage']),
    imageUpdate(url) {
      this.recipe.image = url;
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
      this.wasEdited = true;
    },
    saveRecipe(recipe) {
      if(this.$store.state.user.currentUser) {
        if (recipe.title === '' || recipe.description === '' || recipe.category === '' || recipe.diet === '' || recipe.duration === '' || recipe.portions === '' || recipe.ingredients.length == 0 || recipe.body === '') {
          this.sendToastMessage({ text: "Please fill all fields.", type: 'error' });
          return
        } else {
          if(recipe.image !== null && !this.isImgUploaded) {
            this.sendToastMessage({ text: 'An image was selected but never uploaded. Please click "Upload Image" before saving.', type: 'error' });
          } else { //all necessary data available, send it off
            this.isSaving = true;
            this.postRecipe(recipe);
          }
        }
      } else {
        this.sendToastMessage({ text: "Please log in again to save your changes.", type: 'error' });
      }
    },
    cancelCreate() {
      this.$router.push({ name: 'home' });
    },
    postRecipe(recipe) {
      const functions = this.$store.getters['app/functions']

      fetch(`${functions.create}`, {
        body: JSON.stringify(recipe),
        method: 'POST'
      })
      .then(response => {
        return response.json();
      })
      .then((res) => {
        let newId = res.data.id;
        let newRefId = res.ref['@ref'].id;
        let newRecipePath = `/recipe/${newId}/${newRefId}`
        this.sendToastMessage({ text: `Recipe "${recipe.title}" created`, type: 'success' });
        this.$router.push(newRecipePath); //go to new recipe page
      })
      .catch((error) => {
        console.log("API error", error);
      })
    }
  },
  directives: {
    focus: {
      inserted: function(el) {
        el.focus()
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    if(!this.isEmpty && !this.isSaving) { //if NOT empty OR filled
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
  .form-control {
    @apply block w-full;
  }
</style>