<template>
  <div id="nav-mobile">
    <Transition name="slide-fade">
      <div
        v-if="menuOpen"
        class="min-h-screen absolute top-0 mobile-bg w-full flex flex-col justify-start items-start px-6 py-4 z-10"
      >
        <div class="flex flex-row">
          <button @click="menuClickHandler()" class="block lg:hidden mr-8" type="button" aria-label="Close Menu">
            <span class="font-bold text-3xl opacity-75">&times;</span>
          </button>
          <router-link :to="{name: 'home'}">
            <img src="@/assets/logo.svg" class="hover:opacity-75 pt-b" width="160">
          </router-link>
        </div>
        <div class="w-full flex flex-col justify-start items-center mt-12">
          <router-link
            :to="{name: 'home'}"
            class="block font-bold text-xl text-blue-600 hover:text-cool-gray-500 p-2 mb-12"
            :class="{'active-mobile-link' : currentPage === 'home'}"
          >Home</router-link>
          <router-link
            :to="{name: 'about'}"
            class="block font-bold text-xl text-blue-600 hover:text-cool-gray-500 p-2 mb-12"
            :class="{'active-mobile-link' : currentPage === 'about'}"
          >About</router-link>
          <router-link
            v-if="loggedIn"
            :to="{name: 'mine'}"
            class="block font-bold text-xl text-blue-600 hover:text-cool-gray-500 p-2 mb-12"
            :class="{'active-mobile-link' : currentPage === 'mine'}"
          >My Recipes</router-link>
          <router-link
            v-if="loggedIn"
            :to="{name: 'create'}"
            class="block font-bold text-xl text-blue-600 hover:text-cool-gray-500 p-2 mb-12"
            :class="{'active-mobile-link' : currentPage === 'create'}"
          >&plus;Create</router-link>
        </div>
        <nav-auth class="w-full block text-center" />
      </div>
    </Transition>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "nav-mobile",
  components: {
    'NavAuth': () => import('@/components/NavAuth.vue')
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

<style lang="postcss" scoped>
  .mobile-bg {
    /* background: linear-gradient(165deg, rgba(242, 246, 255, 1) 0%, rgba(185, 199, 229, 1) 100%); */
    @apply bg-white;
    opacity: 0.9;
  }
  .active-mobile-link {
    @apply underline;
  }
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: all 0.5s;
  }
  .slide-fade-enter,
  .slide-fade-leave-to {
    transform: translateX(-400px);
    opacity: 0;
  }
</style>
