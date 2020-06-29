<template>
  <div id="app" :class="{ 'overflow-hidden' : menuOpen }" class="flex h-full flex-col">
    <Navbar :class="{ 'menu-blur' : menuOpen }" />
    <NavMobile />
    <div :class="{ 'menu-blur' : menuOpen }" class="container flex-grow flex-shrink-0 px-4 md:mt-6 lg:mt-12 mx-auto">
      <router-view />
    </div>
    <AppFooter />
    <ToastMessage />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import AppFooter from '@/components/AppFooter.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'App',
  components: {
    Navbar,
    AppFooter,
    'NavMobile': () => import('@/components/NavMobile.vue'),
    'ToastMessage': () => import('@/components/ToastMessage.vue')
  },
  computed: {
    ...mapGetters('app',['menuOpen']),
  }
};
</script>

<style lang="postcss">
  .menu-blur {
    filter: blur(1rem);
  }
  .btn:focus, .form-control:focus {
    outline: 0;
    @apply shadow-outline;
  }
  .btn {
    @apply inline-block font-bold rounded-lg shadow-sm px-6 py-2;
  }
  .btn:hover, .btn:focus {
    @apply shadow-none;
  }
  .btn:disabled {
    cursor: not-allowed;
  }
  .btn-gray {
    @apply border border-gray-500 bg-gray-500 text-blue-500;
  }
  .btn-gray:hover, .btn-gray:focus {
    @apply bg-cool-gray-400;
  }
  .btn-green {
    border: 1px solid;
    @apply border-green-700 text-green-700;
  }
  .btn-green:not(:disabled):hover, .btn-green:focus {
    @apply bg-green-700 text-gray-500;
  }
  .btn-red {
    @apply border border-red-600 text-red-600;
  }
  .btn-red:hover, .btn-red:focus {
    @apply bg-red-600 text-white;
  }
  .form-control {
    @apply border border-gray-600 rounded-lg px-3 py-1;
  }
</style>