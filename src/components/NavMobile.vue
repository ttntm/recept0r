<template>
  <div id="nav-mobile">
    <Transition name="slide-fade">
      <div
        v-if="menuOpen"
        class="min-h-screen absolute top-0 mobile-bg w-full flex flex-col justify-start items-start px-6 py-4 z-10"
      >
        <div class="flex flex-row">
          <button @click="menuClickHandler()" class="block md:hidden mr-8" type="button">
            <span class="font-bold text-3xl opacity-75">&times;</span>
          </button>
          <router-link :to="{name: 'home'}">
            <img src="@/assets/logo.svg" class="hover:opacity-75 pt-3">
          </router-link>
        </div>
        <div class="w-full flex flex-col justify-start items-center mt-12">
          <router-link
            :to="{name: 'home'}"
            class="block font-bold text-xl text-blue-600 hover:text-gray-600 p-2 mb-12"
          >Home</router-link>
          <router-link
            :to="{name: 'about'}"
            class="block font-bold text-xl text-blue-600 hover:text-gray-600 p-2 mb-12"
          >About</router-link>
          <router-link
            v-if="!publicView"
            :to="{name: 'create'}"
            class="block font-bold text-xl text-blue-600 hover:text-gray-600 p-2 mb-12"
          >&plus;Create</router-link>
        </div>
        <nav-auth :publicView="publicView" class="w-full block text-center" />
      </div>
    </Transition>
  </div>
</template>

<script>
import NavAuth from "@/components/NavAuth.vue";
import { mapActions } from 'vuex';

export default {
  name: "nav-mobile",
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
    background: linear-gradient(165deg, rgba(242, 246, 255, 1) 0%, rgba(185, 199, 229, 1) 100%);
  }
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: all 0.75s;
  }
  .slide-fade-enter,
  .slide-fade-leave-to {
    transform: translateX(-400px);
    opacity: 0;
  }
</style>