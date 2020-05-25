<template>
  <div id="all-recipes" class="row">
    <div v-for="recipe in recipes" :key="recipe.refId" class="col-sm-12 col-md-6 p-2">
      <div class="recipe-card border border-secondary rounded p-4 mb-2">
        <h3 class="font-weight-bold">{{ recipe.title }}</h3>
        <p class="text-dark">{{ recipe.description }}</p>
        <router-link :to="{name: 'recipe', params: {id: recipe.id, refId: recipe.refId}}" class="btn btn-outline-dark">Show Recipe</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'all-recipes',
  props: { recipes: Array}
};
</script>

<style scoped>
  .recipe-card:hover {
    box-shadow: 0 0.45rem 0.9rem rgba(0,0,0,.1);
    transition: all .35s ease;
  }
</style>