<template>
  <div id="recipe-filter" class="flex flex-col relative w-full lg:w-3/4 xl:w-2/3 bg-gray-500 rounded-lg shadow-sm py-8 px-12 mx-auto">
    <button
      @click.prevent="$emit('closeFilter')"
      class="text-3xl font-bold opacity-75 cursor-pointer absolute top-0 right-0 mt-1 mr-4 hover:opacity-100"
      title="Close Filter Selection"
    >×</button>
    <div class="w-full mb-4 lg:mb-8">
      <h5>Category</h5>
      <div class="flex flex-row flex-wrap justify-between md:justify-start items-center">
        <div
          v-for="(cat, index) in recipeCategory"
          :key="index"
          @click.prevent="categoryFilterClick(cat)"
          :class="{ 'activeFilter': isActiveFilter(cat) }"
          class="filter-group mb-4 md:mr-4"
        >
          <img :src="getFilterImg(cat)" :alt="cat" class="filter-img" />
          <span class="filter-text">{{ cat }}</span>
        </div>
      </div>
    </div>
    <div class="w-full mb-4 lg:mb-8">
      <h5>Diet</h5>
      <div class="flex flex-row flex-wrap justify-between md:justify-start items-center">
        <div
          v-for="(diet, index) in recipeDiet"
          :key="index"
          @click.prevent="dietFilterClick(diet)"
          :class="{ 'activeFilter': isActiveFilter(diet) }"
          class="filter-group mb-4 md:mr-4"
        >
          <img :src="getFilterImg(diet)" :alt="diet" class="filter-img" />
          <span class="filter-text">{{ diet }}</span>
        </div>
      </div>
    </div>
    <div class="w-full flex flex-row justify-center lg:justify-end">
      <button class="clear-btn px-8 py-2" v-blur @click="clearFilterClick()">× Clear Filter</button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "recipe-filter",
  data() {
    return {
      selCat: [],
      selDiet: []
    };
  },
  computed: {
    ...mapGetters("recipe", [
      "recipeCategory",
      "recipeDiet"
    ])
  },
  methods: {
    ...mapActions("recipe", [
      "applyFilter",
      "clearFilter"
    ]),
    findIndex(arr, item) {
      return arr.indexOf(item);
    },
    getFilterImg(item) {
      let ct = item.toLowerCase();
      let icon = require(`@/assets/filter/${ct}.svg`);
      return icon;
    },
    isActiveFilter(item) {
      let sc = this.findIndex(this.selCat, item);
      let sd = this.findIndex(this.selDiet, item);
      if (sc !== -1 || sd !== -1) {
        return true;
      } else {
        return false;
      }
    },
    selectionHandler(arr, item) {
      let idx = this.findIndex(arr, item);
      if (idx === -1) {
        arr.push(item);
      } else {
        arr.splice(idx, 1);
      }
    },
    categoryFilterClick(selection) {
      this.selectionHandler(this.selCat, selection);
      this.applyFilter(["category", this.selCat]);
    },
    dietFilterClick(selection) {
      this.selectionHandler(this.selDiet, selection);
      this.applyFilter(["diet", this.selDiet]);
    },
    clearFilterClick() {
      this.selCat = [];
      this.selDiet = [];
      this.clearFilter();
    }
  }
};
</script>

<style lang="postcss" scoped>
  .filter-group {
    @apply cursor-pointer outline-none;
  }
  .filter-group:focus {
    @apply outline-none;
  }
  .filter-img {
    width: 60px;
    @apply opacity-50;
  }
  .filter-text {
    @apply block text-xs font-bold text-center text-blue-500 opacity-50;
  }
  .filter-group:hover .filter-img,
  .filter-group:hover .filter-text {
    @apply opacity-100;
  }
  .activeFilter > img,
  .activeFilter > span {
    @apply opacity-100;
  }
  .clear-btn {
    @apply block font-bold border border-blue-500 text-blue-500 rounded-lg shadow-sm;
  }
  .clear-btn:hover,
  .clear-btn:focus {
    @apply bg-cool-gray-500 border-cool-gray-500 shadow-none;
  }
  .clear-btn:focus {
    @apply outline-none shadow-outline;
  }
</style>