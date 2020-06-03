<template>
  <div id="app" :class="{ 'overflow-hidden' : menuOpen }" class="flex h-full flex-col">
    <Navbar :publicView="publicView" />
    <div class="container flex-grow flex-shrink-0 px-4 mx-auto">
      <AppHeader />
      <router-view :publicView="publicView" :updateList="updateList" :fPath="fPath" @status:update="updateRecipes" />
    </div>
    <AppFooter />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';

export default {
  name: 'App',
  components: {
      Navbar,
      AppHeader,
      AppFooter
  },
  computed: {
    publicView() {
      return this.$store.state.user.currentUser ? false : true
    },
    menuOpen() {
      return this.$store.state.app.menuOpen;
    }
  },
  methods: {
    updateRecipes(status) {
      this.updateList = status[0];
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
  *:hover {
      transition: all .35s ease;
  }
  body, html {
    @apply text-gray-800;
  }
  .btn:focus, .form-control:focus {
    outline: 0;
    @apply shadow-outline;
  }
  .btn {
    @apply inline-block border rounded-md px-3 py-2;
  }
  .btn:disabled {
    cursor: not-allowed;
  }
  .btn-gray {
    @apply border-gray-800 text-gray-800;
  }
  .btn-gray:hover {
    @apply bg-gray-800 text-gray-200;
  }
  .btn-green {
    @apply border-green-700 text-green-700;
  }
  .btn-green:not(:disabled):hover {
    @apply bg-green-700 text-gray-200;
  }
  .btn-red {
    border-color: salmon;
    color: salmon;
  }
  .btn-red:hover {
    background-color: salmon;
    @apply text-white;
  }
  .form-group label {
    @apply tracking-wide mb-2;
  }
  .form-control {
    @apply border rounded-md px-3 py-1;
  }
</style>