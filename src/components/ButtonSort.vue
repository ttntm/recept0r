<template>
  <button
    class="btn btn btn-gray btn-sort mb-4 md:mb-0"
    :class="{
      'btn-sort-active' : isActive()
    }"
    :disabled="isActive()"
  >
    <svg v-if="sortType === 'desc'" xmlns="http://www.w3.org/2000/svg" class="inline-block" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z"/>
      <line x1="4" y1="6" x2="13" y2="6" />
      <line x1="4" y1="12" x2="11" y2="12" />
      <line x1="4" y1="18" x2="11" y2="18" />
      <polyline points="15 15 18 18 21 15" />
      <line x1="18" y1="6" x2="18" y2="18" />
    </svg>
    <svg v-if="sortType === 'asc'" xmlns="http://www.w3.org/2000/svg" class="inline-block" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z"/>
      <line x1="4" y1="6" x2="11" y2="6" />
      <line x1="4" y1="12" x2="11" y2="12" />
      <line x1="4" y1="18" x2="13" y2="18" />
      <polyline points="15 9 18 6 21 9" />
      <line x1="18" y1="6" x2="18" y2="18" />
    </svg>
    <span class="inline-block ml-2">
      <slot></slot>
    </span>
  </button>
</template>

<script>
export default {
  name: 'button-sort',
  props: {
    sortData: String,
    sortState: Array,
    sortType: String
  },
  methods: {
    getIndex(arr, item) {
      return arr.indexOf(item);
    },
    isActive() {
      let cData = this.getIndex(this.sortState, this.sortData);
      let cType = this.getIndex(this.sortState, this.sortType);
      if(cData !== -1 && cType !== -1) {
        return true;
      }
      return false;
    }
  }
}
</script>

<style lang="postcss">
  .btn-sort {
    @apply flex flex-row items-center text-sm;
  }
  .btn-sort-active {
    @apply bg-cool-gray-500;
  }
</style>