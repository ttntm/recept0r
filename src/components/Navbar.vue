<template>
  <nav class="w-full flex flex-row justify-start items-center border-b px-2 py-4">
    <span class="block mr-8">
      <router-link :to="{name: 'home'}" class="text-xl tracking-wider font-bold text-green-700">recept0r</router-link>
    </span>
    <div class="inline-flex flex-row justify-start flex-grow">
      <router-link :to="{name: 'home'}" class="inline-block font-bold text-gray-600 hover:text-gray-800 p-2 mr-4">Home</router-link>
      <router-link :to="{name: 'about'}" class="inline-block font-bold text-gray-600 hover:text-gray-800 p-2 mr-4">About</router-link>
      <router-link v-if="!publicView" :to="{name: 'create'}" class="inline-block font-bold text-gray-600 hover:text-gray-800 p-2">&plus;Create</router-link>
    </div>
    <nav-auth :publicView="publicView" class="block" />
    <button class="hidden" type="button">
      <span class="nav-icon">[]</span>
    </button>
  </nav>
</template>

<script>
import NavAuth from '@/components/NavAuth.vue';

export default {
  name: 'navbar',
  components: {
    NavAuth
  },
  props: {
    publicView: Boolean
  },
  computed: {
    currentPage() {
      return this.$route.name; //use this to mark the active link in the navigation
    }
  }
};
</script>

<style>
</style>