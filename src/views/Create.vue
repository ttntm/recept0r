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
      <RecipeDiet :diet="recipe.diet" @diet:update="dietUpdate" class="relative mb-4" />
      <RecipeCategory :category="recipe.category" @category:update="categoryUpdate" class="relative mb-4" />
    </div>
    <div class="w-full md:w-1/2 md:pl-8 mb-4">
      <h4 class="mb-4">Ingredients</h4>
      <RecipeIngredients :editing="true" :input="recipe.ingredients" @ing:update="ingUpdate" />
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
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "create-recipe",
  components: {
    'RecipeImage': () => import(/* webpackPreload: true */ '@/components/recipe/RecipeImage.vue'),
    'RecipeDiet': () => import(/* webpackPreload: true */ '@/components/recipe/RecipeDiet.vue'),
    'RecipeCategory': () => import(/* webpackPreload: true */ '@/components/recipe/RecipeCategory.vue'),
    'RecipeIngredients': () => import(/* webpackPreload: true */ '@/components/recipe/RecipeIngredients.vue'),
    'RecipeEditor': () => import(/* webpackPreload: true */ '@/components/recipe/RecipeEditor.vue')
  },
  data() {
    return {
      isEmpty: true,
      hasIng: false,  // will immediately be 'true' on component init, but isEmpty is also still 'true' at that time, so navigation away from an empty recipe is still possible without the warning
      wasEdited: false,
      isSaving: false,
      isImgUploaded: false,
      recipe: {
        id: '',
        title: '',
        category: '',
        description: '',
        diet: '',
        duration: "30 min / 1 h",
        image: null,
        ingredients: [],
        owner: '',
        portions: "4 portions",
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
    ...mapGetters('user',[
      'currentUser',
      'loggedIn'
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
    //assign owner
    this.recipe.owner = this.currentUser.email;
  },
  watch: {
    recipe: {
      deep: true,
      handler() {
        const r = this.recipe;
        //watch ingredients
        this.hasIng = r.ingredients.length < 1 ? false : true;
        //check user input
        if (r.title === '' && r.description === '' && !this.hasIng && r.image === null && !this.wasEdited) {
            this.isEmpty = true;
        } else { this.isEmpty = false; }
        //create id = slug
        r.id = r.title.replace(/[^a-z0-9]+/gi, '-').replace(/^-*|-*$/g, '').toLowerCase();
        //check if image was uploaded
        const checkImgSrc = RegExp(/^https:\/\//);
        this.isImgUploaded = checkImgSrc.test(r.image);
      }
    },
    loggedIn: {
      handler() {
        if(!this.loggedIn) {
          console.log("logged out, navigating...", this.loggedIn);
          this.cancelCreate();
        }
      }
    }
  },
  methods: {
    ...mapActions('app', ['sendToastMessage']),
    imageUpdate(url) {
      this.recipe.image = url;
    },
    dietUpdate(selection) {
      this.recipe.diet = selection;
    },
    categoryUpdate(selection) {
      this.recipe.category = selection;
    },
    ingUpdate(data) {
      this.recipe.ingredients = data;
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
    if(this.loggedIn && !this.isEmpty && !this.isSaving) { //if NOT empty OR filled
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