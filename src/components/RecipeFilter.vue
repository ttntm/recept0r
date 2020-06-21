<template>
  <div id="recipe-filter" class="flex flex-col relative w-full lg:w-3/4 xl:w-2/3 bg-gray-500 rounded-lg shadow-sm py-8 px-12 mx-auto">
    <button
      @click.prevent="$emit('closeFilter')"
      class="text-3xl font-bold opacity-75 cursor-pointer absolute top-0 right-0 mt-1 mr-4 hover:opacity-100 focus:outline-none"
      title="Close Filter Selection"
      v-blur
    >×</button>
    <div class="w-full">
      <h5 class="text-cool-gray-500 text-center">Filter Selection</h5>
    </div>
    <div class="w-full mb-4">
      <h5>Category</h5>
      <div class="flex flex-row flex-wrap justify-between md:justify-start items-center">
        <button
          v-for="(cat, index) in recipeCategory"
          :key="index"
          :ref="`${cat}`"
          @click="categoryFilterClick(cat)"
          :class="{ 'activeFilter': isActiveFilter(cat) }"
          class="filter-group mb-4 md:mr-4"
        >
          <img :src="getFilterImg(cat)" :alt="cat" class="filter-img" />
          <span class="filter-text">{{ cat }}</span>
        </button>
      </div>
    </div>
    <div class="w-full mb-4">
      <h5>Diet</h5>
      <div class="flex flex-row flex-wrap justify-between md:justify-start items-center">
        <button
          v-for="(diet, index) in recipeDiet"
          :key="index"
          :ref="`${diet}`"
          @click="dietFilterClick(diet)"
          :class="{ 'activeFilter': isActiveFilter(diet) }"
          class="filter-group mb-4 md:mr-4"
        >
          <img :src="getFilterImg(diet)" :alt="diet" class="filter-img" />
          <span class="filter-text">{{ diet }}</span>
        </button>
      </div>
    </div>
    <div class="w-full flex flex-row justify-center lg:justify-end">
      <button class="clear-btn px-8 py-2" v-blur @click="clearFilterClick()">Clear Filter</button>
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
      } else { return false; }
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
      this.blurFilterIcon(selection);
    },
    dietFilterClick(selection) {
      this.selectionHandler(this.selDiet, selection);
      this.applyFilter(["diet", this.selDiet]);
      this.blurFilterIcon(selection);
    },
    blurFilterIcon(icon) {
      if(!this.isActiveFilter(icon)) {
        this.$nextTick(function() {
          this.$refs[`${icon}`][0].blur();
        });
      }
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
    @apply outline-none shadow-none;
  }
  .filter-img,
  .filter-text {
    transition: opacity .35s ease-in-out;
  }
  .filter-img {
    width: 60px;
    @apply opacity-50;
  }
  .filter-text {
    @apply block text-xs font-bold text-center text-blue-500 opacity-50;
  }
  .filter-group:hover .filter-img,
  .filter-group:hover .filter-text,
  .filter-group:focus .filter-img,
  .filter-group:focus .filter-text {
    @apply opacity-100;
  }
  .activeFilter .filter-img,
  .activeFilter .filter-text {
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