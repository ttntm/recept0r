<template>
  <div class="relative mb-4">
    <select name="diet" id="select-category" v-model="current" class="form-control text-sm appearance-none" @change="update(current)">
      <option disabled value="">Please select a category</option>
      <option v-for="(cat, index) in recipeCategory" :key="index" :value="cat">{{ cat }}</option>
    </select>
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-cool-gray-500">
      <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'recipe-category',
  props: {
    category: String
  },
  data() {
    return {
      current: String
    }
  },
  created() {
    this.current = this.category;
  },
  computed: {
    ...mapGetters('recipe',[
      'recipeCategory'
    ]),
  },
  methods: {
    update(cat) {
      this.$emit('category:update', cat)
    }
  }
}
</script>

<style lang="postcss" scoped>
  .form-control {
    @apply block w-full;
  }
</style>