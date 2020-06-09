<template>
  <nav class="container flex flex-row justify-start md:justify-center items-center pt-4 md:pt-12 pb-8 px-6 md:px-4 mx-auto z-10">
    <button @click="menuClickHandler()" class="block md:hidden mr-8" type="button">
      <span class="gg-menu"></span>
    </button>
    <router-link :to="{name: 'home'}" v-blur>
      <img src="@/assets/logo.svg" class="hover:opacity-75 pt-2">
    </router-link>
    <div class="hidden md:flex flex-row justify-center items-center flex-grow">
      <router-link
        :to="{name: 'home'}"
        v-blur
        class="block md:inline-block font-bold text-lg text-blue-500 rounded-lg hover:bg-gray-500 px-4 py-2 mx-4"
      >Home</router-link>
      <router-link
        :to="{name: 'about'}"
        v-blur
        class="block md:inline font-bold text-lg text-blue-500 rounded-lg hover:bg-gray-500 px-4 py-2 mx-4"
      >About</router-link>
      <router-link
        v-if="loggedIn"
        :to="{name: 'create'}"
        v-blur
        class="block md:inline font-bold text-lg text-blue-500 rounded-lg hover:bg-gray-500 px-4 py-2 mx-4"
      >&plus;Create</router-link>
    </div>
    <nav-auth class="hidden md:block" />
  </nav>
</template>

<script>
import NavAuth from "@/components/NavAuth.vue";
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "navbar",
  components: {
    NavAuth
  },
  computed: {
    ...mapGetters('app',['menuOpen']),
    ...mapGetters('user',['loggedIn']),
    currentPage() {
      return this.$route.name; //use this to mark the active link in the navigation
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
  .gg-menu,
  .gg-menu::after,
  .gg-menu::before {
    @apply relative block bg-blue-500;
    width: 20px;
    height: 2px;
  }
  .gg-menu::after,
  .gg-menu::before {
    content: "";
    position: absolute;
    top: -6px
  }
  .gg-menu::after {
    top: 6px
  }
</style>