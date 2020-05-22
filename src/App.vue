<template>
  <div id="app" class="d-flex h-100 flex-column">
    <Navbar />
    <div class="container flex-grow-1 flex-shrink-0">
      <div class="row">
        <AppHeader />
      </div>
      <div class="row">
        <router-view :recipes="recipes" @add:recipe="addRecipe" @create:recipe="addRecipe" @edit:recipe="editRecipe" @delete:recipe="deleteRecipe" />
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';

// const default_layout = "default";

export default {
  name: 'App',
  components: {
      Navbar,
      AppHeader,
      AppFooter
  },
  methods: {
    addRecipe(recipe) {
      let newRecipe = recipe;
      newRecipe.id = 'r0' + (this.recipes.length + 1);
      this.recipes.push(newRecipe);
      console.log("Recipe " + newRecipe.title + " added.");
    },
    editRecipe(id, updatedRecipe) {
      this.recipes = this.recipes.map(recipe =>
          recipe.id === id ? updatedRecipe : recipe
      );
    },
    deleteRecipe(id) {
      this.recipes = this.recipes.filter(
        recipe => recipe.id !== id
      );
    },
    updateStatus(status) {
      this.status = status;
    }
  },
  data() {
    return {
      recipes: [
        {
          id: "r01",
          title: "Awesome Recipe",
          description: 'Recipe01 Description or Summary',
          ingredients: ["1 tsp awesomeness", "1 cup onions", "1/3 cup beer"],
          body:
            "Mix all the stuff and be happy. Then put into a large pot and cook for about half an hour. In the end, it may taste like something, but we can't guarantee that..."
        },
        {
          id: "r02",
          title: "Another Awesome Recipe",
          description: 'Recipe02 Description or Summary',
          ingredients: ["1 tsp awesomeness", "1 cup onions"],
          body:
            "Cooking without beer is possible, but who knows what will come out of that...?"
        },
        {
          id: "r03",
          title: "Not so awesome Recipe",
          description: 'Recipe03 Description or Summary',
          ingredients: ["1 tsp awesomeness", "100 cup onions"],
          body: "Well, I guess you tried."
        }
      ]
    };
  }
};
</script>

<style></style>
