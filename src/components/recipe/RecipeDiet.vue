<template>
  <div class="">
    <select name="diet" id="select-diet" v-model="current" class="form-control text-sm appearance-none" @change="update(current)">
      <option disabled value="">Please select a diet</option>
      <option v-for="(diet, index) in recipeDiet" :key="index" :value="diet">{{ diet }}</option>
    </select>
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-cool-gray-500">
      <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'recipe-diet',
  props: {
    diet: String
  },
  data() {
    return {
      current: String
    }
  },
  created() {
    this.current = this.diet;
  },
  computed: {
    ...mapGetters('recipe',[
      'recipeDiet'
    ]),
  },
  methods: {
    update(diet) {
      this.$emit('diet:update', diet)
    }
  }
}
</script>

<style lang="postcss" scoped>
  .form-control {
    @apply block w-full;
  }
</style>