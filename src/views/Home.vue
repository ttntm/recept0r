<template>
  <div id="all-recipes" class="col">
    <ul class="list-unstyled">
      <li v-for="recipe in recipes" :key="recipe.id" class="shadow-sm border border-dark rounded p-4 mb-4">
        <h3 class="font-weight-bold">{{ recipe.title }}</h3>
        <p class="text-dark">{{ recipe.description }}</p>
        <router-link :to="{name: 'recipe', params: {id: recipe.id}}" class="btn btn-outline-dark">Show Recipe</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'all-recipes',
  props: {
      recipes: Array
  }
};
</script>

<style>
</style>