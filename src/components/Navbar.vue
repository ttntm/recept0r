<template>
  <nav :class="{ 'min-h-screen mobile-bg' : menuOpen }" class="w-full absolute md:relative flex flex-col md:flex-row justify-start items-start md:items-center md:border-b p-3 z-10">
    <button @click="menuClickHandler()" class="inline-block md:hidden" type="button">
      <span class="font-bold text-xl">[{{ icon }}]</span>
    </button>
    <span class="hidden md:block md:mr-8">
      <router-link
        :to="{name: 'home'}"
        class="text-xl tracking-wider font-bold text-green-700 hover:text-gray-800"
      >recept0r</router-link>
    </span>
    <div :class="{ 'hidden' : !menuOpen }" class="w-full md:w-auto flex md:inline-flex flex-col md:flex-row justify-start items-center md:items-start md:flex-grow mt-12 md:my-0">
      <router-link
        :to="{name: 'home'}"
        class="block md:inline-block font-bold text-xl md:text-base text-gray-600 hover:text-gray-800 p-2 mb-12 md:mb-0 md:mr-4"
      >Home</router-link>
      <router-link
        :to="{name: 'about'}"
        class="block md:inline font-bold text-xl md:text-base text-gray-600 hover:text-gray-800 p-2 mb-12 md:mb-0 md:mr-4"
      >About</router-link>
      <router-link
        v-if="!publicView"
        :to="{name: 'create'}"
        class="block md:inline font-bold text-xl md:text-base text-gray-600 hover:text-gray-800 p-2 mb-12 md:mb-0"
      >&plus;Create</router-link>
    </div>
    <nav-auth :class="{ 'hidden' : !menuOpen }" :publicView="publicView" class="w-full md:w-auto block md:block text-center" />
  </nav>
</template>

<script>
import NavAuth from "@/components/NavAuth.vue";
import { mapActions } from 'vuex';

export default {
  name: "navbar",
  components: {
    NavAuth
  },
  props: {
    publicView: Boolean
  },
  computed: {
    currentPage() {
      return this.$route.name; //use this to mark the active link in the navigation
    },
    menuOpen() {
      return this.$store.state.app.menuOpen;
    },
    icon() {
      return this.menuOpen ? "x" : "-";
    }
  },
  methods: {
    ...mapActions("app", ["toggleMenu"]),
    menuClickHandler() {
      let newState = !this.menuOpen
      this.toggleMenu(newState);
    }
  }
};
</script>

<style lang="postcss">
  .mobile-bg {
    background: linear-gradient(165deg, rgba(203,213,224,1) 0%, rgba(160,174,192,1) 100%);
  }
</style>