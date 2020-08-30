<template>
  <div id="recipe-ingredients">
    <ul class="ing-list mb-0">
      <li
        v-for="(ing, index) in ingredients" :key="index"
        :class="{'mb-2': !editing}"
      >
        <span v-if="!editing">
          {{ ing }}
        </span>
        <span v-else class="flex flex-row items-center mb-4">
          <input type="text"
            class="inline-block form-control text-sm"
            v-model.trim="ingredients[index]"
            v-focus
            @keydown.enter="addIngredient(index)"
            :placeholder="`Ingredient ${index+1}`"
            :ref="`input${index}`"
          >
          <button class="inline-block text-lg opacity-75 hover:opacity-100 ml-2"
            @click="removeIngredient(index)"
          >&times;</button>
        </span>
      </li>
    </ul>
    <button v-if="editing" @click="addIngredient()" class="btn btn-green block text-sm mx-auto">Add Ingredient</button>
  </div>
</template>

<script>
export default {
  name: 'recipe-ingredients',
  props: {
    editing: Boolean,
    input: Array
  },
  data() {
    return {
      ingredients: Array
    }
  },
  created() {
    this.ingredients = this.input;
  },
  watch: {
    input: {
      handler() {
        // necessary to flush temporary changes in case edit mode is canceled in the parent component
        this.ingredients = this.input;
      }
    },
    ingredients: {
      handler() {
        this.$emit("ing:update", this.ingredients);
      }
    }
  },
  methods: {
    addIngredient(index) {
      let ing = this.ingredients;
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
      let ing = this.ingredients;
      if(index > -1) {
        ing.splice(index, 1);
      } else {
        ing.splice(ing.length - 1);
      }
    },
  },
  directives: {
    focus: {
      inserted: function(el) {
        el.focus()
      }
    }
  },
}
</script>

<style lang="postcss" scoped>
  .form-control {
    @apply block w-full;
  }
  .ing-list > li {
    @apply text-blue-500;
    font-weight: 600;
  }
</style>