<template>
  <div id="recipe-filter" class="flex flex-row w-1/2 mx-auto">
    <div class="w-full">
      <ul>
        <li v-for="(cat, index) in recipeCategory" :key="index">
          <a href="#" @click.prevent="categoryFilterClick(cat)">{{ cat }}</a>
        </li>
      </ul>
    </div>
    <div class="w-full">
      <ul>
        <li v-for="(diet, index) in recipeDiet" :key="index">
          <a href="#" @click.prevent="dietFilterClick(diet)">{{ diet }}</a>
        </li>
      </ul>
    </div>
    <div class="w-full">
      <button @click="clearFilter()">Clear Filter</button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'recipe-filter',
  computed: {
    ...mapGetters('recipe',[
      'recipeCategory',
      'recipeDiet'
    ]),
  },
  methods: {
    ...mapActions('recipe', [
      'applyFilter',
      'clearFilter'
    ]),
    categoryFilterClick(selection) {
      this.applyFilter(['category', selection]);
    },
    dietFilterClick(selection) {
      this.applyFilter(['diet', selection]);
    }
  }
}
</script>

<style>

</style>