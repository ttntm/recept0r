<template>
  <div id="app" :class="{ 'overflow-hidden' : menuOpen }" class="flex h-full flex-col">
    <Navbar :publicView="publicView" />
    <NavMobile :publicView="publicView" />
    <div class="container flex-grow flex-shrink-0 px-4 mt-12 mx-auto">
      <router-view :publicView="publicView" :fPath="fPath" />
    </div>
    <AppFooter />
    <toast-message />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import NavMobile from '@/components/NavMobile.vue';
import AppFooter from '@/components/AppFooter.vue';
import ToastMessage from '@/components/ToastMessage.vue';

export default {
  name: 'App',
  components: {
    Navbar,
    NavMobile,
    AppFooter,
    ToastMessage
  },
  computed: {
    publicView() {
      return this.$store.state.user.currentUser ? false : true
    },
    menuOpen() {
      return this.$store.state.app.menuOpen;
    }
  },
  data() {
    return {
      updateList: false,
      fPath: {
        readAll: process.env.VUE_APP_FUNC_PATH_ALL,
        readOne: process.env.VUE_APP_FUNC_PATH_ONE,
        create: process.env.VUE_APP_FUNC_PATH_CREATE,
        edit: process.env.VUE_APP_FUNC_PATH_EDIT,
        delete: process.env.VUE_APP_FUNC_PATH_DELETE
      }
    };
  }
};
</script>

<style lang="postcss">
  .btn:focus, .form-control:focus {
    outline: 0;
    @apply shadow-outline;
  }
  .btn {
    @apply inline-block rounded-lg shadow-sm px-3 py-2;
  }
  .btn:hover {
    @apply shadow-none;
  }
  .btn:disabled {
    cursor: not-allowed;
  }
  .btn-gray {
    @apply border-gray-500;
    @apply bg-gray-500;
    @apply text-blue-600;
  }
  .btn-gray:hover {
    @apply bg-gray-900;
    @apply text-gray-500;
  }
  .btn-green {
    border: 1px solid;
    @apply border-green-700;
    @apply text-green-700;
  }
  .btn-green:not(:disabled):hover {
    @apply bg-green-700;
    @apply text-gray-500;
  }
  .btn-red {
    border: 1px solid salmon;
    color: salmon;
  }
  .btn-red:hover {
    background-color: salmon;
    @apply text-white;
  }
  .form-control {
    @apply border border-gray-500 rounded-lg px-3 py-1;
  }
</style>